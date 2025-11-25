/**
 * Copy service - orchestrates copy/clone operations with backend integration
 */

import { z } from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { deepClone, CloneResult, CloneOptions } from '../../lib/copy/deepClone';

// Request/Response schemas
export const CopyOperationRequestSchema = z.object({
  operation_type: z.enum(['copy', 'clone']),
  source_type: z.enum(['job', 'configuration', 'dashboard', 'report']),
  source_id: z.string(),
  payload: z.any().optional(),
  metadata: z.record(z.any()).optional(),
});

export const CopyOperationResponseSchema = z.object({
  success: z.boolean(),
  operation_id: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type CopyOperationRequest = z.infer<typeof CopyOperationRequestSchema>;
export type CopyOperationResponse = z.infer<typeof CopyOperationResponseSchema>;

// Copy operation status
export type CopyOperationStatus = 'pending' | 'processing' | 'success' | 'failure';

// Copy operation audit entry
export interface CopyOperationAudit {
  id: string;
  user_id: string;
  operation_type: 'copy' | 'clone';
  source_type: 'job' | 'configuration' | 'dashboard' | 'report';
  source_id: string;
  target_id?: string;
  status: CopyOperationStatus;
  payload_hash?: string;
  payload?: any;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

// Preview data for clone operations
export interface ClonePreview {
  original: any;
  cloned: any;
  changes: {
    type: 'added' | 'modified' | 'removed';
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  warnings: string[];
  idMap: Map<string, string>;
}

class CopyService {
  private edgeFunctionUrl: string;

  constructor() {
    // Use the correct Supabase URL for edge functions
    this.edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/copy-operation`;
  }

  /**
   * Get copy operation history for current user
   */
  async getCopyHistory(limit = 50, offset = 0): Promise<{
    data: CopyOperationAudit[];
    count: number;
  }> {
    const { data, error, count } = await supabase
      .from('copy_operation_audit')
      .select('*', { count: 'exact' })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch copy history: ${error.message}`);
    }

    return {
      data: data || [],
      count: count || 0
    };
  }

  /**
   * Get copy operation by ID
   */
  async getCopyOperation(id: string): Promise<CopyOperationAudit | null> {
    const { data, error } = await supabase
      .from('copy_operation_audit')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch copy operation: ${error.message}`);
    }

    return data;
  }

  /**
   * Preview a clone operation without executing it
   */
  async previewClone(
    sourceType: CopyOperationRequest['source_type'],
    sourceId: string,
    options: CloneOptions = {}
  ): Promise<ClonePreview> {
    // Fetch the original entity based on source type
    let original: any;
    
    switch (sourceType) {
      case 'job':
        original = await this.fetchJob(sourceId);
        break;
      case 'configuration':
        original = await this.fetchConfiguration(sourceId);
        break;
      case 'dashboard':
        original = await this.fetchDashboard(sourceId);
        break;
      case 'report':
        original = await this.fetchReport(sourceId);
        break;
      default:
        throw new Error(`Unsupported source type: ${sourceType}`);
    }

    if (!original) {
      throw new Error(`Source ${sourceType} with ID ${sourceId} not found`);
    }

    // Perform clone without persisting
    const cloneResult = this.performLocalClone(original, sourceType, options);
    
    if (!cloneResult.success) {
      throw new Error(`Clone preview failed: ${cloneResult.errors?.join(', ')}`);
    }

    // Generate diff
    const changes = this.generateDiff(original, cloneResult.data!);
    
    return {
      original,
      cloned: cloneResult.data!,
      changes,
      warnings: cloneResult.warnings || [],
      idMap: cloneResult.idMap || new Map()
    };
  }

  /**
   * Execute a copy/clone operation
   */
  async executeCopyOperation(
    request: CopyOperationRequest
  ): Promise<CopyOperationResponse> {
    // Validate request
    const validatedRequest = CopyOperationRequestSchema.parse(request);

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('copy-operation', {
        body: validatedRequest
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      // Validate response
      const response = CopyOperationResponseSchema.parse(data);
      return response;
    } catch (error) {
      console.error('Copy operation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Perform local clone (for preview)
   */
  private performLocalClone(
    entity: any,
    sourceType: string,
    options: CloneOptions
  ): CloneResult {
    switch (sourceType) {
      case 'job':
        return deepClone(entity, {
          ...options,
          idPrefix: 'job_clone_',
          transform: (cloned) => ({
            ...cloned,
            job_name: `${cloned.job_name} (Clone)`,
            enabled: false,
            last_run_at: null,
            next_run_at: null,
          })
        });
      case 'configuration':
        return deepClone(entity, {
          ...options,
          idPrefix: 'config_clone_',
          transform: (cloned) => ({
            ...cloned,
            name: `${cloned.name} (Clone)`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        });
      case 'dashboard':
        return deepClone(entity, {
          ...options,
          idPrefix: 'dashboard_clone_',
          transform: (cloned) => ({
            ...cloned,
            name: `${cloned.name} (Clone)`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        });
      case 'report':
        return deepClone(entity, {
          ...options,
          idPrefix: 'report_clone_',
          transform: (cloned) => ({
            ...cloned,
            title: `${cloned.title} (Clone)`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        });
      default:
        return deepClone(entity, options);
    }
  }

  /**
   * Generate diff between original and cloned entity
   */
  private generateDiff(original: any, cloned: any): ClonePreview['changes'] {
    const changes: ClonePreview['changes'] = [];
    const allKeys = new Set([...Object.keys(original), ...Object.keys(cloned)]);

    for (const key of allKeys) {
      const oldValue = original[key];
      const newValue = cloned[key];

      if (!(key in original)) {
        changes.push({
          type: 'added',
          field: key,
          newValue
        });
      } else if (!(key in cloned)) {
        changes.push({
          type: 'removed',
          field: key,
          oldValue
        });
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          type: 'modified',
          field: key,
          oldValue,
          newValue
        });
      }
    }

    return changes;
  }

  /**
   * Fetch job by ID
   */
  private async fetchJob(id: string): Promise<any> {
    const { data, error } = await supabase
      .from('scheduled_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch job: ${error.message}`);
    }

    return data;
  }

  /**
   * Fetch configuration by ID
   */
  private async fetchConfiguration(id: string): Promise<any> {
    // This would depend on your actual configuration table structure
    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch configuration: ${error.message}`);
    }

    return data;
  }

  /**
   * Fetch dashboard by ID
   */
  private async fetchDashboard(id: string): Promise<any> {
    // This would depend on your actual dashboard table structure
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch dashboard: ${error.message}`);
    }

    return data;
  }

  /**
   * Fetch report by ID
   */
  private async fetchReport(id: string): Promise<any> {
    // This would depend on your actual report table structure
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch report: ${error.message}`);
    }

    return data;
  }

  /**
   * Get copy statistics
   */
  async getCopyStats(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalOperations: number;
    successRate: number;
    operationsByType: Record<string, number>;
    operationsByStatus: Record<string, number>;
  }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    // Calculate date filter
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const { data, error } = await supabase
      .from('copy_operation_audit')
      .select('*')
      .eq('user_id', user.user.id)
      .gte('created_at', startDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch copy stats: ${error.message}`);
    }

    const operations = data || [];
    const totalOperations = operations.length;
    const successCount = operations.filter(op => op.status === 'success').length;
    const successRate = totalOperations > 0 ? successCount / totalOperations : 0;

    const operationsByType = operations.reduce((acc, op) => {
      acc[op.source_type] = (acc[op.source_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const operationsByStatus = operations.reduce((acc, op) => {
      acc[op.status] = (acc[op.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOperations,
      successRate,
      operationsByType,
      operationsByStatus
    };
  }
}

// Export singleton instance
export const copyService = new CopyService();
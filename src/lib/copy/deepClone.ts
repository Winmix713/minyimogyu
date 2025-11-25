/**
 * Deep clone utilities for various data types with ID remapping and relationship preservation
 */

import { z } from 'zod';

// Base interfaces for cloneable entities
export interface CloneableEntity {
  id: string;
  [key: string]: any;
}

export interface CloneOptions {
  preserveIds?: boolean;
  idPrefix?: string;
  idSuffix?: string;
  transform?: (entity: any, context: CloneContext) => any;
  validate?: (entity: any) => boolean;
  maxDepth?: number;
}

export interface CloneContext {
  idMap: Map<string, string>;
  depth: number;
  path: string[];
  originalRoot: any;
}

export interface CloneResult<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
  idMap?: Map<string, string>;
}

/**
 * Generic deep clone function with ID remapping
 */
export function deepClone<T extends CloneableEntity>(
  entity: T,
  options: CloneOptions = {}
): CloneResult<T> {
  const {
    preserveIds = false,
    idPrefix = 'clone_',
    idSuffix = '',
    transform,
    validate,
    maxDepth = 10
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const idMap = new Map<string, string>();
  
  const context: CloneContext = {
    idMap,
    depth: 0,
    path: [],
    originalRoot: entity
  };

  try {
    // Validate input if validator provided
    if (validate && !validate(entity)) {
      throw new Error('Entity validation failed');
    }

    const cloned = cloneEntity(entity, context, {
      preserveIds,
      idPrefix,
      idSuffix,
      transform,
      maxDepth
    });

    return {
      success: true,
      data: cloned,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      idMap
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown clone error');
    return {
      success: false,
      errors
    };
  }
}

/**
 * Clone an individual entity
 */
function cloneEntity(
  entity: any,
  context: CloneContext,
  options: Required<Pick<CloneOptions, 'preserveIds' | 'idPrefix' | 'idSuffix' | 'maxDepth'>> & {
    transform?: CloneOptions['transform'];
  }
): any {
  const { preserveIds, idPrefix, idSuffix, transform, maxDepth } = options;
  
  // Check depth limit
  if (context.depth >= maxDepth) {
    throw new Error(`Maximum clone depth (${maxDepth}) exceeded`);
  }

  // Handle null/undefined
  if (entity === null || entity === undefined) {
    return entity;
  }

  // Handle primitive types
  if (typeof entity !== 'object') {
    return entity;
  }

  // Handle arrays
  if (Array.isArray(entity)) {
    return entity.map((item, index) => 
      cloneEntity(item, { ...context, path: [...context.path, index.toString()] }, options)
    );
  }

  // Handle dates
  if (entity instanceof Date) {
    return new Date(entity.getTime());
  }

  // Handle regular expressions
  if (entity instanceof RegExp) {
    return new RegExp(entity.source, entity.flags);
  }

  // Create new object
  const cloned: any = {};
  const newContext = { ...context, depth: context.depth + 1 };

  // Handle entities with IDs
  if (entity.id && typeof entity.id === 'string') {
    const newId = preserveIds 
      ? entity.id 
      : `${idPrefix}${entity.id}${idSuffix}`;
    
    context.idMap.set(entity.id, newId);
    cloned.id = newId;
  }

  // Clone all properties
  for (const [key, value] of Object.entries(entity)) {
    // Skip id if already handled
    if (key === 'id' && entity.id) {
      continue;
    }

    // Handle special fields that might reference other entities
    if (key.endsWith('_id') && typeof value === 'string') {
      // This is a foreign key reference - check if we have a mapping
      const mappedId = context.idMap.get(value);
      cloned[key] = mappedId || value;
      continue;
    }

    // Clone nested objects
    cloned[key] = cloneEntity(value, newContext, options);
  }

  // Apply transformation if provided
  if (transform) {
    return transform(cloned, context);
  }

  return cloned;
}

/**
 * Clone a scheduler job
 */
export function cloneSchedulerJob(job: any, options: CloneOptions = {}): CloneResult {
  const jobSchema = z.object({
    id: z.string(),
    job_name: z.string(),
    job_type: z.string(),
    cron_schedule: z.string(),
    enabled: z.boolean().optional(),
    config: z.record(z.any()).optional(),
  });

  return deepClone(job, {
    ...options,
    idPrefix: 'job_clone_',
    validate: (entity) => jobSchema.safeParse(entity).success,
    transform: (entity) => ({
      ...entity,
      job_name: `${entity.job_name} (Clone)`,
      enabled: false, // Start disabled
      last_run_at: null,
      next_run_at: null,
    })
  });
}

/**
 * Clone a configuration template
 */
export function cloneConfiguration(config: any, options: CloneOptions = {}): CloneResult {
  const configSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    settings: z.record(z.any()).optional(),
  });

  return deepClone(config, {
    ...options,
    idPrefix: 'config_clone_',
    validate: (entity) => configSchema.safeParse(entity).success,
    transform: (entity) => ({
      ...entity,
      name: `${entity.name} (Clone)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  });
}

/**
 * Clone an analytics dashboard
 */
export function cloneDashboard(dashboard: any, options: CloneOptions = {}): CloneResult {
  const dashboardSchema = z.object({
    id: z.string(),
    name: z.string(),
    layout: z.array(z.any()).optional(),
    widgets: z.array(z.any()).optional(),
    filters: z.record(z.any()).optional(),
  });

  return deepClone(dashboard, {
    ...options,
    idPrefix: 'dashboard_clone_',
    validate: (entity) => dashboardSchema.safeParse(entity).success,
    transform: (entity) => ({
      ...entity,
      name: `${entity.name} (Clone)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  });
}

/**
 * Clone a report
 */
export function cloneReport(report: any, options: CloneOptions = {}): CloneResult {
  const reportSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    content: z.any().optional(),
    metadata: z.record(z.any()).optional(),
  });

  return deepClone(report, {
    ...options,
    idPrefix: 'report_clone_',
    validate: (entity) => reportSchema.safeParse(entity).success,
    transform: (entity) => ({
      ...entity,
      title: `${entity.title} (Clone)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  });
}

/**
 * Batch clone multiple entities
 */
export function batchClone<T extends CloneableEntity>(
  entities: T[],
  options: CloneOptions = {}
): CloneResult<T[]> {
  const results: T[] = [];
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const combinedIdMap = new Map<string, string>();

  for (const entity of entities) {
    const result = deepClone(entity, {
      ...options,
      transform: (cloned, context) => {
        // Merge ID maps
        context.idMap.forEach((newId, oldId) => {
          combinedIdMap.set(oldId, newId);
        });
        return options.transform ? options.transform(cloned, context) : cloned;
      }
    });

    if (result.success && result.data) {
      results.push(result.data);
      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    } else {
      allErrors.push(...(result.errors || ['Unknown error']));
    }
  }

  return {
    success: allErrors.length === 0,
    data: results.length > 0 ? results : undefined,
    errors: allErrors.length > 0 ? allErrors : undefined,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
    idMap: combinedIdMap
  };
}

/**
 * Validate clone integrity
 */
export function validateCloneIntegrity<T extends CloneableEntity>(
  original: T,
  cloned: T,
  idMap: Map<string, string>
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check if all expected properties exist
  const originalKeys = Object.keys(original).filter(k => k !== 'id');
  const clonedKeys = Object.keys(cloned).filter(k => k !== 'id');

  const missingKeys = originalKeys.filter(k => !clonedKeys.includes(k));
  if (missingKeys.length > 0) {
    issues.push(`Missing properties: ${missingKeys.join(', ')}`);
  }

  // Check ID remapping
  if (!idMap.has(original.id) || idMap.get(original.id) !== cloned.id) {
    issues.push('ID remapping is incorrect');
  }

  // Check foreign key references
  for (const [key, value] of Object.entries(cloned)) {
    if (key.endsWith('_id') && typeof value === 'string') {
      const originalValue = original[key.replace('_id', '_id')];
      if (originalValue && originalValue !== value) {
        const expectedMappedId = idMap.get(originalValue);
        if (expectedMappedId && expectedMappedId !== value) {
          issues.push(`Foreign key ${key} not properly remapped`);
        }
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
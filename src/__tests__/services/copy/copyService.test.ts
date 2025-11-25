/**
 * Tests for copy service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { copyService } from '@/services/copy/copyService'
import { supabase } from '@/integrations/supabase/client'

// Mock supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn()
  },
  from: vi.fn(),
  functions: {
    invoke: vi.fn()
  }
}

describe('Copy Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock supabase client
    vi.mock('../../../src/lib/supabase', () => ({
      supabase: mockSupabase
    }))
    
    // Setup default user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getCopyHistory', () => {
    it('fetches copy history successfully', async () => {
      const mockHistory = [
        {
          id: 'op-1',
          user_id: 'test-user-id',
          operation_type: 'clone',
          source_type: 'job',
          source_id: 'job-123',
          status: 'success',
          created_at: '2023-01-01T00:00:00Z'
        }
      ]

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockOrder = vi.fn().mockReturnThis()
      const mockRange = vi.fn().mockResolvedValue({
        data: mockHistory,
        error: null,
        count: 1
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        range: mockRange
      } as any)

      const result = await copyService.getCopyHistory()

      expect(mockSupabase.from).toHaveBeenCalledWith('copy_operation_audit')
      expect(mockEq).toHaveBeenCalledWith('user_id', 'test-user-id')
      expect(result.data).toEqual(mockHistory)
      expect(result.count).toBe(1)
    })

    it('handles fetch errors', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockOrder = vi.fn().mockReturnThis()
      const mockRange = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
        count: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        range: mockRange
      } as any)

      await expect(copyService.getCopyHistory()).rejects.toThrow('Failed to fetch copy history: Database error')
    })
  })

  describe('getCopyOperation', () => {
    it('fetches specific copy operation', async () => {
      const mockOperation = {
        id: 'op-1',
        user_id: 'test-user-id',
        operation_type: 'clone',
        source_type: 'job',
        source_id: 'job-123',
        status: 'success'
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockOperation,
        error: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      } as any)

      const result = await copyService.getCopyOperation('op-1')

      expect(result).toEqual(mockOperation)
    })

    it('returns null for non-existent operation', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' } // Not found error code
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      } as any)

      const result = await copyService.getCopyOperation('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('previewClone', () => {
    it('previews job clone successfully', async () => {
      const mockJob = {
        id: 'job-123',
        job_name: 'Test Job',
        job_type: 'data-processing',
        cron_schedule: '0 0 * * *',
        enabled: true,
        config: { timeout: 300 }
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockJob,
        error: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      } as any)

      const result = await copyService.previewClone('job', 'job-123')

      expect(result.original).toEqual(mockJob)
      expect(result.cloned).toBeDefined()
      expect(result.cloned.id).toMatch(/^job_clone_job-123/)
      expect(result.cloned.job_name).toBe('Test Job (Clone)')
      expect(result.cloned.enabled).toBe(false)
      expect(result.changes).toBeDefined()
      expect(result.warnings).toBeDefined()
      expect(result.idMap).toBeDefined()
    })

    it('handles non-existent source entity', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' }
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      } as any)

      await expect(copyService.previewClone('job', 'non-existent')).rejects.toThrow('Source job with ID non-existent not found')
    })

    it('handles unsupported source type', async () => {
      await expect(copyService.previewClone('unsupported' as any, 'id-123')).rejects.toThrow('Unsupported source type: unsupported')
    })
  })

  describe('executeCopyOperation', () => {
    it('executes copy operation successfully', async () => {
      const mockResponse = {
        success: true,
        operation_id: 'op-123',
        data: { id: 'cloned-job-456' }
      }

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null
      })

      const request = {
        operation_type: 'clone' as const,
        source_type: 'job' as const,
        source_id: 'job-123',
        payload: { name: 'Cloned Job' }
      }

      const result = await copyService.executeCopyOperation(request)

      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('copy-operation', {
        body: request
      })
      expect(result).toEqual(mockResponse)
    })

    it('handles edge function errors', async () => {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Edge function error' }
      })

      const request = {
        operation_type: 'clone' as const,
        source_type: 'job' as const,
        source_id: 'job-123'
      }

      const result = await copyService.executeCopyOperation(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Edge function error')
    })

    it('handles network errors', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Network error'))

      const request = {
        operation_type: 'clone' as const,
        source_type: 'job' as const,
        source_id: 'job-123'
      }

      const result = await copyService.executeCopyOperation(request)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })
  })

  describe('getCopyStats', () => {
    it('fetches copy statistics successfully', async () => {
      const mockStats = [
        { source_type: 'job', status: 'success', created_at: '2023-01-01T00:00:00Z' },
        { source_type: 'job', status: 'success', created_at: '2023-01-02T00:00:00Z' },
        { source_type: 'configuration', status: 'failure', created_at: '2023-01-03T00:00:00Z' }
      ]

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockGte = vi.fn().mockResolvedValue({
        data: mockStats,
        error: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        gte: mockGte
      } as any)

      const result = await copyService.getCopyStats('week')

      expect(result.totalOperations).toBe(3)
      expect(result.successRate).toBe(2/3) // 2 successes out of 3 operations
      expect(result.operationsByType).toEqual({
        job: 2,
        configuration: 1
      })
      expect(result.operationsByStatus).toEqual({
        success: 2,
        failure: 1
      })
    })

    it('handles empty stats', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockGte = vi.fn().mockResolvedValue({
        data: [],
        error: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        gte: mockGte
      } as any)

      const result = await copyService.getCopyStats('day')

      expect(result.totalOperations).toBe(0)
      expect(result.successRate).toBe(0)
      expect(result.operationsByType).toEqual({})
      expect(result.operationsByStatus).toEqual({})
    })

    it('handles stats fetch errors', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockGte = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Stats fetch error' }
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        gte: mockGte
      } as any)

      await expect(copyService.getCopyStats('month')).rejects.toThrow('Failed to fetch copy stats: Stats fetch error')
    })

    it('handles unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      await expect(copyService.getCopyStats()).rejects.toThrow('User not authenticated')
    })
  })

  describe('generateDiff', () => {
    it('generates correct diff for simple changes', async () => {
      const mockOriginal = {
        id: 'job-123',
        job_name: 'Original Job',
        enabled: true,
        config: { timeout: 300 }
      }

      // Mock the fetch and clone process
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockOriginal,
        error: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      } as any)

      const result = await copyService.previewClone('job', 'job-123')

      // Check that changes are detected
      expect(result.changes).toBeDefined()
      
      // Should have modifications for job_name and enabled
      const nameChange = result.changes.find(c => c.field === 'job_name')
      const enabledChange = result.changes.find(c => c.field === 'enabled')
      
      expect(nameChange).toBeDefined()
      expect(nameChange?.type).toBe('modified')
      expect(nameChange?.oldValue).toBe('Original Job')
      expect(nameChange?.newValue).toBe('Original Job (Clone)')
      
      expect(enabledChange).toBeDefined()
      expect(enabledChange?.type).toBe('modified')
      expect(enabledChange?.oldValue).toBe(true)
      expect(enabledChange?.newValue).toBe(false)
    })
  })

  describe('ID mapping', () => {
    it('maintains correct ID mappings', async () => {
      const mockJob = {
        id: 'job-123',
        job_name: 'Test Job',
        config: {
          schedule_id: 'schedule-456',
          notification_id: 'notification-789'
        }
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockJob,
        error: null
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle
      } as any)

      const result = await copyService.previewClone('job', 'job-123')

      expect(result.idMap).toBeDefined()
      expect(result.idMap?.get('job-123')).toMatch(/^job_clone_job-123/)
      expect(result.idMap?.get('schedule-456')).toMatch(/^job_clone_schedule-456/)
      expect(result.idMap?.get('notification-789')).toMatch(/^job_clone_notification-789/)
    })
  })
})
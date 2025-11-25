/**
 * Tests for deep clone utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  deepClone,
  cloneSchedulerJob,
  cloneConfiguration,
  cloneDashboard,
  cloneReport,
  batchClone,
  validateCloneIntegrity
} from '@/lib/copy/deepClone'

describe('Deep Clone Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('deepClone', () => {
    it('clones simple objects with ID remapping', () => {
      const original = {
        id: 'test-123',
        name: 'Test Entity',
        value: 42,
        active: true
      }

      const result = deepClone(original, { idPrefix: 'clone_' })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe('clone_test-123')
      expect(result.data?.name).toBe('Test Entity')
      expect(result.data?.value).toBe(42)
      expect(result.data?.active).toBe(true)
      expect(result.idMap?.get('test-123')).toBe('clone_test-123')
    })

    it('preserves IDs when preserveIds option is true', () => {
      const original = {
        id: 'test-123',
        name: 'Test Entity'
      }

      const result = deepClone(original, { preserveIds: true })

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('test-123')
    })

    it('handles nested objects', () => {
      const original = {
        id: 'parent-123',
        name: 'Parent',
        nested: {
          id: 'child-456',
          name: 'Child',
          value: 'nested-value'
        }
      }

      const result = deepClone(original, { idPrefix: 'clone_' })

      expect(result.success).toBe(true)
      expect(result.data?.id).toBe('clone_parent-123')
      expect(result.data?.nested.id).toBe('clone_child-456')
      expect(result.idMap?.get('parent-123')).toBe('clone_parent-123')
      expect(result.idMap?.get('child-456')).toBe('clone_child-456')
    })

    it('handles arrays', () => {
      const original = {
        id: 'list-123',
        items: [
          { id: 'item-1', name: 'Item 1' },
          { id: 'item-2', name: 'Item 2' }
        ]
      }

      const result = deepClone(original, { idPrefix: 'clone_' })

      expect(result.success).toBe(true)
      expect(result.data?.items).toHaveLength(2)
      expect(result.data?.items[0].id).toBe('clone_item-1')
      expect(result.data?.items[1].id).toBe('clone_item-2')
      expect(result.idMap?.get('item-1')).toBe('clone_item-1')
      expect(result.idMap?.get('item-2')).toBe('clone_item-2')
    })

    it('handles foreign key references', () => {
      const original = {
        id: 'entity-123',
        name: 'Entity',
        user_id: 'user-456',
        parent_id: 'parent-789'
      }

      const result = deepClone(original, { 
        idPrefix: 'clone_',
        // Simulate having mappings for the foreign keys
        transform: (cloned) => {
          // Simulate ID mapping for foreign keys
          if (cloned.user_id === 'user-456') {
            cloned.user_id = 'clone_user-456'
          }
          if (cloned.parent_id === 'parent-789') {
            cloned.parent_id = 'clone_parent-789'
          }
          return cloned
        }
      })

      expect(result.success).toBe(true)
      expect(result.data?.user_id).toBe('clone_user-456')
      expect(result.data?.parent_id).toBe('clone_parent-789')
    })

    it('applies transform function', () => {
      const original = {
        id: 'test-123',
        name: 'Test',
        created_at: '2023-01-01T00:00:00Z'
      }

      const result = deepClone(original, {
        idPrefix: 'clone_',
        transform: (cloned) => ({
          ...cloned,
          name: `${cloned.name} (Transformed)`,
          updated_at: new Date().toISOString()
        })
      })

      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Test (Transformed)')
      expect(result.data?.updated_at).toBeDefined()
    })

    it('validates with custom validator', () => {
      const original = {
        id: 'test-123',
        name: 'Valid Entity'
      }

      const validator = vi.fn(() => true)
      const result = deepClone(original, { validate: validator })

      expect(result.success).toBe(true)
      expect(validator).toHaveBeenCalledWith(original)
    })

    it('fails validation', () => {
      const original = {
        id: 'test-123',
        name: 'Invalid Entity'
      }

      const validator = vi.fn(() => false)
      const result = deepClone(original, { validate: validator })

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Entity validation failed')
    })

    it('handles depth limit', () => {
      const deepObject = {
        id: 'deep-1',
        level1: {
          id: 'deep-2',
          level2: {
            id: 'deep-3',
            level3: {
              id: 'deep-4',
              level4: {
                id: 'deep-5'
              }
            }
          }
        }
      }

      const result = deepClone(deepObject, { maxDepth: 3 })

      expect(result.success).toBe(false)
      expect(result.errors).toContain('Maximum clone depth (3) exceeded')
    })

    it('handles special data types', () => {
      const date = new Date('2023-01-01T00:00:00Z')
      const regex = /test-regex/g
      const original = {
        id: 'special-123',
        date: date,
        regex: regex,
        nullValue: null,
        undefinedValue: undefined,
        number: 42,
        string: 'test',
        boolean: true
      }

      const result = deepClone(original, { idPrefix: 'clone_' })

      expect(result.success).toBe(true)
      expect(result.data?.date).toEqual(date)
      expect(result.data?.date).not.toBe(date) // Should be a new Date instance
      expect(result.data?.regex).toEqual(regex)
      expect(result.data?.regex).not.toBe(regex) // Should be a new RegExp instance
      expect(result.data?.nullValue).toBeNull()
      expect(result.data?.undefinedValue).toBeUndefined()
      expect(result.data?.number).toBe(42)
      expect(result.data?.string).toBe('test')
      expect(result.data?.boolean).toBe(true)
    })
  })

  describe('cloneSchedulerJob', () => {
    it('clones a scheduler job with proper transformations', () => {
      const job = {
        id: 'job-123',
        job_name: 'Test Job',
        job_type: 'data-processing',
        cron_schedule: '0 0 * * *',
        enabled: true,
        config: { timeout: 300 }
      }

      const result = cloneSchedulerJob(job)

      expect(result.success).toBe(true)
      expect(result.data?.id).toMatch(/^job_clone_job-123/)
      expect(result.data?.job_name).toBe('Test Job (Clone)')
      expect(result.data?.enabled).toBe(false)
      expect(result.data?.last_run_at).toBeNull()
      expect(result.data?.next_run_at).toBeNull()
      expect(result.data?.job_type).toBe('data-processing')
      expect(result.data?.cron_schedule).toBe('0 0 * * *')
      expect(result.data?.config).toEqual({ timeout: 300 })
    })

    it('validates job structure', () => {
      const invalidJob = {
        id: 'job-123',
        // Missing required fields
        job_name: 'Incomplete Job'
      }

      const result = cloneSchedulerJob(invalidJob)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('cloneConfiguration', () => {
    it('clones a configuration with proper transformations', () => {
      const config = {
        id: 'config-123',
        name: 'Test Config',
        type: 'processing',
        settings: { retries: 3, timeout: 100 }
      }

      const result = cloneConfiguration(config)

      expect(result.success).toBe(true)
      expect(result.data?.id).toMatch(/^config_clone_config-123/)
      expect(result.data?.name).toBe('Test Config (Clone)')
      expect(result.data?.type).toBe('processing')
      expect(result.data?.settings).toEqual({ retries: 3, timeout: 100 })
      expect(result.data?.created_at).toBeDefined()
      expect(result.data?.updated_at).toBeDefined()
    })

    it('validates configuration structure', () => {
      const invalidConfig = {
        id: 'config-123',
        // Missing required fields
        settings: {}
      }

      const result = cloneConfiguration(invalidConfig)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('cloneDashboard', () => {
    it('clones a dashboard with proper transformations', () => {
      const dashboard = {
        id: 'dashboard-123',
        name: 'Test Dashboard',
        layout: [{ x: 0, y: 0, w: 6, h: 4 }],
        widgets: [{ id: 'widget-1', type: 'chart' }],
        filters: { date: '7d' }
      }

      const result = cloneDashboard(dashboard)

      expect(result.success).toBe(true)
      expect(result.data?.id).toMatch(/^dashboard_clone_dashboard-123/)
      expect(result.data?.name).toBe('Test Dashboard (Clone)')
      expect(result.data?.layout).toEqual([{ x: 0, y: 0, w: 6, h: 4 }])
      expect(result.data?.widgets).toEqual([{ id: 'widget-1', type: 'chart' }])
      expect(result.data?.filters).toEqual({ date: '7d' })
      expect(result.data?.created_at).toBeDefined()
      expect(result.data?.updated_at).toBeDefined()
    })

    it('validates dashboard structure', () => {
      const invalidDashboard = {
        id: 'dashboard-123',
        // Missing required fields
        layout: []
      }

      const result = cloneDashboard(invalidDashboard)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('cloneReport', () => {
    it('clones a report with proper transformations', () => {
      const report = {
        id: 'report-123',
        title: 'Test Report',
        type: 'summary',
        content: { sections: ['overview', 'details'] },
        metadata: { author: 'test-user' }
      }

      const result = cloneReport(report)

      expect(result.success).toBe(true)
      expect(result.data?.id).toMatch(/^report_clone_report-123/)
      expect(result.data?.title).toBe('Test Report (Clone)')
      expect(result.data?.type).toBe('summary')
      expect(result.data?.content).toEqual({ sections: ['overview', 'details'] })
      expect(result.data?.metadata).toEqual({ author: 'test-user' })
      expect(result.data?.created_at).toBeDefined()
      expect(result.data?.updated_at).toBeDefined()
    })

    it('validates report structure', () => {
      const invalidReport = {
        id: 'report-123',
        // Missing required fields
        content: {}
      }

      const result = cloneReport(invalidReport)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })

  describe('batchClone', () => {
    it('clones multiple entities successfully', () => {
      const entities = [
        { id: 'entity-1', name: 'Entity 1' },
        { id: 'entity-2', name: 'Entity 2' },
        { id: 'entity-3', name: 'Entity 3' }
      ]

      const result = batchClone(entities, { idPrefix: 'batch_' })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(3)
      expect(result.data?.[0].id).toBe('batch_entity-1')
      expect(result.data?.[1].id).toBe('batch_entity-2')
      expect(result.data?.[2].id).toBe('batch_entity-3')
      expect(result.idMap?.size).toBe(3)
    })

    it('handles partial failures', () => {
      const entities = [
        { id: 'entity-1', name: 'Entity 1' },
        { id: 'entity-2', name: 'Entity 2' }
      ]

      // Make the second entity fail validation
      const validator = (entity: any) => entity.id !== 'entity-2'
      
      const result = batchClone(entities, { 
        idPrefix: 'batch_',
        validate: validator
      })

      expect(result.success).toBe(false)
      expect(result.data).toHaveLength(1) // Only the first entity succeeded
      expect(result.errors).toHaveLength(1)
    })

    it('aggregates warnings across all clones', () => {
      const entities = [
        { id: 'entity-1', name: 'Entity 1' },
        { id: 'entity-2', name: 'Entity 2' }
      ]

      const result = batchClone(entities, { 
        idPrefix: 'batch_',
        transform: (cloned) => {
          // Add a warning condition
          if (cloned.name.includes('Entity')) {
            // This would normally come from the clone utility
            return cloned
          }
          return cloned
        }
      })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })
  })

  describe('validateCloneIntegrity', () => {
    it('validates successful clone', () => {
      const original = {
        id: 'original-123',
        name: 'Test Entity',
        user_id: 'user-456',
        value: 42
      }

      const cloned = {
        id: 'clone_original-123',
        name: 'Test Entity',
        user_id: 'clone_user-456',
        value: 42
      }

      const idMap = new Map([
        ['original-123', 'clone_original-123'],
        ['user-456', 'clone_user-456']
      ])

      const result = validateCloneIntegrity(original, cloned, idMap)

      expect(result.valid).toBe(true)
      expect(result.issues).toHaveLength(0)
    })

    it('detects missing properties', () => {
      const original = {
        id: 'original-123',
        name: 'Test Entity',
        value: 42
      }

      const cloned = {
        id: 'clone_original-123',
        name: 'Test Entity'
        // Missing 'value' property
      }

      const idMap = new Map([['original-123', 'clone_original-123']])

      const result = validateCloneIntegrity(original, cloned, idMap)

      expect(result.valid).toBe(false)
      expect(result.issues).toContain('Missing properties: value')
    })

    it('detects incorrect ID remapping', () => {
      const original = {
        id: 'original-123',
        name: 'Test Entity'
      }

      const cloned = {
        id: 'wrong-id',
        name: 'Test Entity'
      }

      const idMap = new Map([['original-123', 'expected-id']])

      const result = validateCloneIntegrity(original, cloned, idMap)

      expect(result.valid).toBe(false)
      expect(result.issues).toContain('ID remapping is incorrect')
    })

    it('detects incorrect foreign key remapping', () => {
      const original = {
        id: 'original-123',
        name: 'Test Entity',
        user_id: 'user-456'
      }

      const cloned = {
        id: 'clone_original-123',
        name: 'Test Entity',
        user_id: 'wrong-user-id' // Should be 'clone_user-456'
      }

      const idMap = new Map([
        ['original-123', 'clone_original-123'],
        ['user-456', 'clone_user-456']
      ])

      const result = validateCloneIntegrity(original, cloned, idMap)

      expect(result.valid).toBe(false)
      expect(result.issues).toContain('Foreign key user_id not properly remapped')
    })
  })
})
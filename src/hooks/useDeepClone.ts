/**
 * useDeepClone hook - Deep clone functionality with optimistic updates
 */

import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  deepClone, 
  cloneSchedulerJob, 
  cloneConfiguration, 
  cloneDashboard, 
  cloneReport,
  batchClone,
  CloneResult,
  CloneOptions 
} from '../lib/copy/deepClone'
import { copyService, ClonePreview } from '../services/copy/copyService'

interface UseDeepCloneOptions {
  onSuccess?: (result: any, original: any) => void
  onError?: (error: string) => void
  showToast?: boolean
  optimisticUpdate?: boolean
  validateBeforeClone?: boolean
}

interface DeepCloneState {
  isCloning: boolean
  preview: ClonePreview | null
  error: string | null
}

export function useDeepClone(options: UseDeepCloneOptions = {}) {
  const {
    onSuccess,
    onError,
    showToast = true,
    optimisticUpdate = false,
    validateBeforeClone = true
  } = options

  const [state, setState] = useState<DeepCloneState>({
    isCloning: false,
    preview: null,
    error: null
  })

  const queryClient = useQueryClient()

  // Preview clone mutation
  const previewMutation = useMutation({
    mutationFn: async ({
      sourceType,
      sourceId,
      options
    }: {
      sourceType: 'job' | 'configuration' | 'dashboard' | 'report'
      sourceId: string
      options?: CloneOptions
    }): Promise<ClonePreview> => {
      return await copyService.previewClone(sourceType, sourceId, options)
    },
    onSuccess: (preview) => {
      setState(prev => ({ 
        ...prev, 
        preview,
        error: null 
      }))
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Preview failed'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }))
      if (showToast) {
        toast.error(`Preview failed: ${errorMessage}`)
      }
    }
  })

  // Execute clone mutation
  const cloneMutation = useMutation({
    mutationFn: async ({
      sourceType,
      sourceId,
      options
    }: {
      sourceType: 'job' | 'configuration' | 'dashboard' | 'report'
      sourceId: string
      options?: CloneOptions
    }) => {
      setState(prev => ({ ...prev, isCloning: true, error: null }))

      try {
        // Execute copy operation via service
        const response = await copyService.executeCopyOperation({
          operation_type: 'clone',
          source_type: sourceType,
          source_id: sourceId,
          payload: options
        })

        if (!response.success) {
          throw new Error(response.error || 'Clone operation failed')
        }

        return response.data
      } finally {
        setState(prev => ({ ...prev, isCloning: false }))
      }
    },
    onSuccess: (result, variables) => {
      setState(prev => ({ 
        ...prev, 
        error: null,
        preview: null 
      }))

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [variables.sourceType + 's'] // jobs, configurations, etc.
      })
      queryClient.invalidateQueries({
        queryKey: ['copy-history']
      })

      if (showToast) {
        toast.success(`${variables.sourceType} cloned successfully`)
      }

      onSuccess?.(result, variables)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Clone failed'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage 
      }))
      
      if (showToast) {
        toast.error(`Clone failed: ${errorMessage}`)
      }
      
      onError?.(errorMessage)
    }
  })

  // Local clone (without backend)
  const localCloneMutation = useMutation({
    mutationFn: async ({
      entity,
      options
    }: {
      entity: any
      options?: CloneOptions
    }): Promise<CloneResult> => {
      return deepClone(entity, options)
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        if (showToast) {
          toast.success('Entity cloned locally')
        }
        onSuccess?.(result.data, variables.entity)
      } else {
        const errorMessage = result.errors?.join(', ') || 'Local clone failed'
        setState(prev => ({ ...prev, error: errorMessage }))
        if (showToast) {
          toast.error(`Clone failed: ${errorMessage}`)
        }
        onError?.(errorMessage)
      }
    }
  })

  // Preview a clone operation
  const preview = useCallback(async (
    sourceType: 'job' | 'configuration' | 'dashboard' | 'report',
    sourceId: string,
    options?: CloneOptions
  ): Promise<ClonePreview | null> => {
    try {
      return await previewMutation.mutateAsync({ sourceType, sourceId, options })
    } catch {
      return null
    }
  }, [previewMutation])

  // Execute a clone operation
  const clone = useCallback(async (
    sourceType: 'job' | 'configuration' | 'dashboard' | 'report',
    sourceId: string,
    options?: CloneOptions
  ): Promise<any> => {
    if (validateBeforeClone && !state.preview) {
      // Auto-preview if not already done
      await preview(sourceType, sourceId, options)
    }

    return await cloneMutation.mutateAsync({ sourceType, sourceId, options })
  }, [cloneMutation, validateBeforeClone, state.preview, preview])

  // Clone locally (without backend)
  const cloneLocal = useCallback((
    entity: any,
    options?: CloneOptions
  ): Promise<CloneResult> => {
    return localCloneMutation.mutateAsync({ entity, options })
  }, [localCloneMutation])

  // Clone with specific type helpers
  const cloneJob = useCallback((
    job: any,
    options?: CloneOptions
  ): Promise<CloneResult> => {
    return cloneSchedulerJob(job, options)
  }, [])

  const cloneConfig = useCallback((
    config: any,
    options?: CloneOptions
  ): Promise<CloneResult> => {
    return cloneConfiguration(config, options)
  }, [])

  const cloneDashboardEntity = useCallback((
    dashboard: any,
    options?: CloneOptions
  ): Promise<CloneResult> => {
    return cloneDashboard(dashboard, options)
  }, [])

  const cloneReportEntity = useCallback((
    report: any,
    options?: CloneOptions
  ): Promise<CloneResult> => {
    return cloneReport(report, options)
  }, [])

  // Batch clone
  const batchCloneEntities = useCallback((
    entities: any[],
    options?: CloneOptions
  ): Promise<CloneResult<any[]>> => {
    return batchClone(entities, options)
  }, [])

  // Reset state
  const reset = useCallback(() => {
    setState({
      isCloning: false,
      preview: null,
      error: null
    })
    cloneMutation.reset()
    previewMutation.reset()
    localCloneMutation.reset()
  }, [cloneMutation, previewMutation, localCloneMutation])

  return {
    // State
    isCloning: state.isCloning || cloneMutation.isPending,
    isPreviewing: previewMutation.isPending,
    preview: state.preview,
    error: state.error,
    
    // Actions
    preview,
    clone,
    cloneLocal,
    cloneJob,
    cloneConfig,
    cloneDashboardEntity,
    cloneReportEntity,
    batchCloneEntities,
    reset,
    
    // Mutation states
    cloneError: cloneMutation.error,
    previewError: previewMutation.error,
    localCloneError: localCloneMutation.error
  }
}
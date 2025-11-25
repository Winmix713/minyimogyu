/**
 * useCopy hook - Generic copy functionality with toast notifications
 */

import { useState, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { copyToClipboard, copyJsonToClipboard, CopyResult } from '../lib/copy/clipboard'

interface UseCopyOptions {
  onSuccess?: (data: string) => void
  onError?: (error: string) => void
  showToast?: boolean
  telemetry?: {
    operation: string
    metadata?: Record<string, any>
  }
}

export function useCopy(options: UseCopyOptions = {}) {
  const { onSuccess, onError, showToast = true, telemetry } = options
  const queryClient = useQueryClient()

  const copyMutation = useMutation({
    mutationFn: async (data: string): Promise<CopyResult> => {
      return await copyToClipboard(data, {
        onSuccess,
        onError: (error) => {
          const errorMessage = error.message
          onError?.(errorMessage)
          if (showToast) {
            toast.error(`Copy failed: ${errorMessage}`)
          }
        },
        telemetry
      })
    },
    onSuccess: (result) => {
      if (result.success) {
        if (showToast) {
          toast.success('Copied to clipboard')
        }
        onSuccess?.(result.data!)
      }
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Copy failed'
      onError?.(errorMessage)
      if (showToast) {
        toast.error(errorMessage)
      }
    }
  })

  const copy = useCallback((data: string) => {
    return copyMutation.mutateAsync(data)
  }, [copyMutation])

  return {
    copy,
    isLoading: copyMutation.isPending,
    error: copyMutation.error,
    reset: copyMutation.reset
  }
}

/**
 * useCopyJson hook - Specialized for JSON data
 */
interface UseCopyJsonOptions extends UseCopyOptions {
  format?: 'pretty' | 'compact'
}

export function useCopyJson(options: UseCopyJsonOptions = {}) {
  const { format = 'pretty', ...restOptions } = options
  const queryClient = useQueryClient()

  const copyJsonMutation = useMutation({
    mutationFn: async (data: any): Promise<CopyResult> => {
      const jsonString = format === 'pretty' 
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data)
      
      return await copyJsonToClipboard(data, {
        ...restOptions,
        telemetry: {
          ...restOptions.telemetry,
          metadata: {
            ...restOptions.telemetry?.metadata,
            format,
            dataType: 'json',
          }
        }
      })
    },
    onSuccess: (result) => {
      if (result.success && restOptions.showToast !== false) {
        toast.success('JSON copied to clipboard')
      }
      restOptions.onSuccess?.(result.data!)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'JSON copy failed'
      restOptions.onError?.(errorMessage)
      if (restOptions.showToast !== false) {
        toast.error(errorMessage)
      }
    }
  })

  const copyJson = useCallback((data: any) => {
    return copyJsonMutation.mutateAsync(data)
  }, [copyJsonMutation])

  return {
    copyJson,
    isLoading: copyJsonMutation.isPending,
    error: copyJsonMutation.error,
    reset: copyJsonMutation.reset
  }
}
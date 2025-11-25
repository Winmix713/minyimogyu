/**
 * useCopyToClipboard hook - Enhanced clipboard functionality
 */

import { useState, useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  copyToClipboard, 
  copyJsonToClipboard, 
  readFromClipboard, 
  readJsonFromClipboard,
  getClipboardPermission,
  requestClipboardPermission,
  CopyResult 
} from '../lib/copy/clipboard'

interface UseCopyToClipboardOptions {
  onSuccess?: (data: string) => void
  onError?: (error: string) => void
  onPermissionDenied?: () => void
  showToast?: boolean
  requestPermissionOnFirstUse?: boolean
}

interface ClipboardState {
  isSupported: boolean
  permission: PermissionState | 'unknown'
  isCopying: boolean
  lastCopied: string | null
  error: string | null
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const {
    onSuccess,
    onError,
    onPermissionDenied,
    showToast = true,
    requestPermissionOnFirstUse = true
  } = options

  const [state, setState] = useState<ClipboardState>({
    isSupported: false,
    permission: 'unknown',
    isCopying: false,
    lastCopied: null,
    error: null
  })

  // Check clipboard support and permission on mount
  useEffect(() => {
    const checkClipboardSupport = async () => {
      const supported = !!navigator.clipboard
      setState(prev => ({ ...prev, isSupported: supported }))

      if (supported) {
        try {
          const permission = await getClipboardPermission()
          setState(prev => ({ ...prev, permission }))
        } catch {
          setState(prev => ({ ...prev, permission: 'unknown' }))
        }
      }
    }

    checkClipboardSupport()
  }, [])

  const copyMutation = useMutation({
    mutationFn: async (data: string): Promise<CopyResult> => {
      setState(prev => ({ ...prev, isCopying: true, error: null }))

      try {
        // Request permission if needed and this is the first use
        if (requestPermissionOnFirstUse && state.permission === 'prompt') {
          const granted = await requestClipboardPermission()
          if (!granted) {
            throw new Error('Clipboard permission denied')
          }
          setState(prev => ({ ...prev, permission: 'granted' }))
        }

        const result = await copyToClipboard(data, {
          onSuccess: (copiedData) => {
            setState(prev => ({ 
              ...prev, 
              lastCopied: copiedData,
              error: null 
            }))
            onSuccess?.(copiedData)
            if (showToast) {
              toast.success('Copied to clipboard')
            }
          },
          onError: (error) => {
            const errorMessage = error.message
            setState(prev => ({ 
              ...prev, 
              error: errorMessage 
            }))
            onError?.(errorMessage)
            
            if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
              onPermissionDenied?.()
            }
            
            if (showToast) {
              toast.error(`Copy failed: ${errorMessage}`)
            }
          }
        })

        return result
      } finally {
        setState(prev => ({ ...prev, isCopying: false }))
      }
    }
  })

  const copy = useCallback(async (data: string): Promise<boolean> => {
    try {
      const result = await copyMutation.mutateAsync(data)
      return result.success
    } catch {
      return false
    }
  }, [copyMutation])

  const copyJson = useCallback(async (data: any): Promise<boolean> => {
    setState(prev => ({ ...prev, isCopying: true, error: null }))

    try {
      // Request permission if needed
      if (requestPermissionOnFirstUse && state.permission === 'prompt') {
        const granted = await requestClipboardPermission()
        if (!granted) {
          throw new Error('Clipboard permission denied')
        }
        setState(prev => ({ ...prev, permission: 'granted' }))
      }

      const result = await copyJsonToClipboard(data, {
        onSuccess: (copiedData) => {
          setState(prev => ({ 
            ...prev, 
            lastCopied: copiedData,
            error: null 
          }))
          onSuccess?.(copiedData)
          if (showToast) {
            toast.success('JSON copied to clipboard')
          }
        },
        onError: (error) => {
          const errorMessage = error.message
          setState(prev => ({ 
            ...prev, 
            error: errorMessage 
          }))
          onError?.(errorMessage)
          
          if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
            onPermissionDenied?.()
          }
          
          if (showToast) {
            toast.error(`JSON copy failed: ${errorMessage}`)
          }
        }
      })

      return result.success
    } finally {
      setState(prev => ({ ...prev, isCopying: false }))
    }
  }, [state.permission, requestPermissionOnFirstUse, onSuccess, onError, onPermissionDenied, showToast])

  const read = useCallback(async (): Promise<string | null> => {
    if (!state.isSupported) {
      return null
    }

    try {
      const result = await readFromClipboard()
      return result.success ? result.data! : null
    } catch {
      return null
    }
  }, [state.isSupported])

  const readJson = useCallback(async <T = any>(): Promise<T | null> => {
    if (!state.isSupported) {
      return null
    }

    try {
      const result = await readJsonFromClipboard<T>()
      return result.success ? result.data! : null
    } catch {
      return null
    }
  }, [state.isSupported])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      return false
    }

    try {
      const granted = await requestClipboardPermission()
      setState(prev => ({ 
        ...prev, 
        permission: granted ? 'granted' : 'denied' 
      }))
      return granted
    } catch {
      setState(prev => ({ ...prev, permission: 'denied' }))
      return false
    }
  }, [state.isSupported])

  const reset = useCallback(() => {
    copyMutation.reset()
    setState(prev => ({ 
      ...prev, 
      lastCopied: null,
      error: null 
    }))
  }, [copyMutation])

  return {
    // State
    isSupported: state.isSupported,
    permission: state.permission,
    isCopying: state.isCopying,
    lastCopied: state.lastCopied,
    error: state.error,
    
    // Actions
    copy,
    copyJson,
    read,
    readJson,
    requestPermission,
    reset,
    
    // Mutation state
    isLoading: copyMutation.isPending,
    mutationError: copyMutation.error
  }
}
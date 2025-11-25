/**
 * CopyButton component - Reusable copy button with loading states
 */

import { useState } from 'react'
import { Button } from '../ui/button'
import { 
  Copy, 
  Check, 
  AlertCircle,
  Loader2 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCopy } from '@/hooks/useCopy'

interface CopyButtonProps {
  data: string | any
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
  successMessage?: string
  errorMessage?: string
  isJson?: boolean
  disabled?: boolean
  iconOnly?: boolean
  onCopySuccess?: (data: string) => void
  onCopyError?: (error: string) => void
  telemetry?: {
    operation: string
    metadata?: Record<string, any>
  }
}

export function CopyButton({
  data,
  variant = 'outline',
  size = 'sm',
  className,
  children,
  successMessage = 'Copied!',
  errorMessage = 'Copy failed',
  isJson = false,
  disabled = false,
  iconOnly = false,
  onCopySuccess,
  onCopyError,
  telemetry
}: CopyButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const { copy, isLoading } = useCopy({
    onSuccess: (copiedData) => {
      setShowSuccess(true)
      setShowError(false)
      onCopySuccess?.(copiedData)
      
      // Reset success state after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000)
    },
    onError: (error) => {
      setShowError(true)
      setShowSuccess(false)
      onCopyError?.(error)
      
      // Reset error state after 3 seconds
      setTimeout(() => setShowError(false), 3000)
    },
    showToast: false, // We handle our own toast/state
    telemetry
  })

  const handleCopy = async () => {
    if (isLoading || disabled) return

    const dataToCopy = isJson && typeof data === 'object' 
      ? JSON.stringify(data, null, 2)
      : String(data)

    await copy(dataToCopy)
  }

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    
    if (showSuccess) {
      return <Check className="h-4 w-4 text-green-600" />
    }
    
    if (showError) {
      return <AlertCircle className="h-4 w-4 text-red-600" />
    }
    
    return <Copy className="h-4 w-4" />
  }

  const getButtonText = () => {
    if (iconOnly) return null
    
    if (showSuccess) return successMessage
    if (showError) return errorMessage
    if (isLoading) return 'Copying...'
    
    return children || 'Copy'
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'gap-2 transition-all duration-200',
        showSuccess && 'border-green-600 text-green-600',
        showError && 'border-red-600 text-red-600',
        className
      )}
      onClick={handleCopy}
      disabled={disabled || isLoading}
      title={showSuccess ? successMessage : showError ? errorMessage : 'Copy to clipboard'}
    >
      {getIcon()}
      {getButtonText()}
    </Button>
  )
}

/**
 * CopyIconButton - Smaller version with just an icon
 */
interface CopyIconButtonProps extends Omit<CopyButtonProps, 'iconOnly' | 'children' | 'size'> {
  size?: 'icon' | 'sm' | 'default'
}

export function CopyIconButton({
  size = 'icon',
  ...props
}: CopyIconButtonProps) {
  return (
    <CopyButton
      {...props}
      size={size}
      iconOnly={true}
    />
  )
}

/**
 * CopyWithTooltip component - Copy button with tooltip
 */
interface CopyWithTooltipProps extends CopyButtonProps {
  tooltip?: string
}

export function CopyWithTooltip({
  tooltip = 'Copy to clipboard',
  ...props
}: CopyWithTooltipProps) {
  return (
    <div className="relative group">
      <CopyButton {...props} />
      {!props.disabled && !props.isLoading && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}
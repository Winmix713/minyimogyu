/**
 * CloneDialog component - Modal for previewing and confirming clone operations
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Copy, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  GitBranch,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDeepClone } from '@/hooks/useDeepClone'
import { ClonePreview } from '@/services/copy/copyService'

interface CloneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceType: 'job' | 'configuration' | 'dashboard' | 'report'
  sourceId: string
  sourceName?: string
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
}

export function CloneDialog({
  open,
  onOpenChange,
  sourceType,
  sourceId,
  sourceName,
  onSuccess,
  onError
}: CloneDialogProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'changes' | 'details'>('preview')
  
  const {
    preview,
    isPreviewing,
    isCloning,
    error,
    preview: previewData,
    clone,
    reset
  } = useDeepClone({
    onSuccess: (result) => {
      onOpenChange(false)
      onSuccess?.(result)
    },
    onError: (errorMessage) => {
      onError?.(errorMessage)
    }
  })

  // Auto-preview when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !previewData) {
      handlePreview()
    }
    onOpenChange(newOpen)
    
    if (!newOpen) {
      reset()
      setActiveTab('preview')
    }
  }

  const handlePreview = async () => {
    await preview(sourceType, sourceId)
  }

  const handleClone = async () => {
    await clone(sourceType, sourceId)
  }

  const getSourceTypeLabel = () => {
    switch (sourceType) {
      case 'job': return 'Job'
      case 'configuration': return 'Configuration'
      case 'dashboard': return 'Dashboard'
      case 'report': return 'Report'
      default: return 'Item'
    }
  }

  const renderChange = (change: ClonePreview['changes'][0], index: number) => {
    const getTypeIcon = () => {
      switch (change.type) {
        case 'added': return <CheckCircle className="h-4 w-4 text-green-600" />
        case 'modified': return <GitBranch className="h-4 w-4 text-blue-600" />
        case 'removed': return <AlertTriangle className="h-4 w-4 text-red-600" />
      }
    }

    const getTypeBadge = () => {
      const variants = {
        added: 'default',
        modified: 'secondary',
        removed: 'destructive'
      } as const
      
      return (
        <Badge variant={variants[change.type]} className="text-xs">
          {change.type}
        </Badge>
      )
    }

    return (
      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
        {getTypeIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-sm font-mono">{change.field}</code>
            {getTypeBadge()}
          </div>
          
          {change.type === 'modified' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Old:</span>
                <pre className="mt-1 p-2 bg-red-50 rounded text-red-900 overflow-x-auto">
                  {JSON.stringify(change.oldValue, null, 2)}
                </pre>
              </div>
              <div>
                <span className="text-muted-foreground">New:</span>
                <pre className="mt-1 p-2 bg-green-50 rounded text-green-900 overflow-x-auto">
                  {JSON.stringify(change.newValue, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {change.type === 'added' && (
            <pre className="mt-1 p-2 bg-green-50 rounded text-green-900 text-xs overflow-x-auto">
              {JSON.stringify(change.newValue, null, 2)}
            </pre>
          )}
          
          {change.type === 'removed' && (
            <pre className="mt-1 p-2 bg-red-50 rounded text-red-900 text-xs overflow-x-auto">
              {JSON.stringify(change.oldValue, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Clone {getSourceTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            {sourceName ? `Clone "${sourceName}"` : `Clone ${getSourceTypeLabel()}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="changes" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Changes
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            {isPreviewing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Generating preview...</span>
              </div>
            ) : previewData ? (
              <ScrollArea className="h-96">
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(previewData.cloned, null, 2)}
                </pre>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Click "Preview" to see how the cloned item will look
              </div>
            )}
          </TabsContent>

          <TabsContent value="changes" className="mt-4">
            {isPreviewing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Analyzing changes...</span>
              </div>
            ) : previewData ? (
              <div className="space-y-3">
                {previewData.changes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No changes detected
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {previewData.changes.map(renderChange)}
                    </div>
                  </ScrollArea>
                )}
                
                {previewData.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">Warnings:</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {previewData.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Click "Preview" to see the changes
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            {isPreviewing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading details...</span>
              </div>
            ) : previewData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Source Type
                    </label>
                    <p className="capitalize">{sourceType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Source ID
                    </label>
                    <p className="font-mono text-xs">{sourceId}</p>
                  </div>
                  {previewData.cloned.id && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        New ID
                      </label>
                      <p className="font-mono text-xs">{previewData.cloned.id}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ID Mappings
                    </label>
                    <p className="text-sm">{previewData.idMap.size} mappings</p>
                  </div>
                </div>
                
                <Separator />
                
                {previewData.idMap.size > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      ID Remapping
                    </label>
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {Array.from(previewData.idMap.entries()).map(([oldId, newId]) => (
                          <div key={oldId} className="flex items-center gap-2 text-xs">
                            <code className="bg-muted px-1 rounded">{oldId}</code>
                            <span>→</span>
                            <code className="bg-muted px-1 rounded">{newId}</code>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Click "Preview" to see the details
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCloning}
          >
            Cancel
          </Button>
          
          {!previewData && (
            <Button
              variant="secondary"
              onClick={handlePreview}
              disabled={isPreviewing}
            >
              {isPreviewing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Preview
            </Button>
          )}
          
          <Button
            onClick={handleClone}
            disabled={!previewData || isCloning || isPreviewing}
          >
            {isCloning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Clone {getSourceTypeLabel()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
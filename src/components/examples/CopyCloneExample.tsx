/**
 * Example usage of Copy & Clone functionality
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CopyButton, CloneDialog } from '@/components/copy'
import { useCopy, useDeepClone } from '@/hooks'
import { copyService } from '@/services/copy/copyService'

// Example job data
const exampleJob = {
  id: 'job-123',
  job_name: 'Data Processing Job',
  job_type: 'data-processing',
  cron_schedule: '0 2 * * *',
  enabled: true,
  config: {
    timeout: 300,
    retries: 3,
    batchSize: 100
  },
  last_run_at: '2023-12-01T02:00:00Z',
  next_run_at: '2023-12-02T02:00:00Z'
}

export function CopyCloneExample() {
  const [showCloneDialog, setShowCloneDialog] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  
  // Copy hook example
  const { copy, isLoading: isCopying } = useCopy({
    onSuccess: (data) => {
      console.log('Copied successfully:', data)
    },
    telemetry: {
      operation: 'example-copy',
      metadata: { source: 'example-component' }
    }
  })
  
  // Deep clone hook example
  const { preview, clone, isPreviewing, isCloning, error } = useDeepClone({
    onSuccess: (result, original) => {
      console.log('Cloned successfully:', result)
      console.log('Original was:', original)
    },
    showToast: true
  })

  const handleCopyJobId = async () => {
    await copy(exampleJob.id)
  }

  const handleCopyJobJson = async () => {
    await copy(JSON.stringify(exampleJob, null, 2))
  }

  const handleCloneJob = async () => {
    setSelectedEntity(exampleJob)
    setShowCloneDialog(true)
  }

  const handlePreviewClone = async () => {
    const previewResult = await preview('job', exampleJob.id)
    if (previewResult) {
      console.log('Clone preview:', previewResult)
    }
  }

  const handleExecuteClone = async () => {
    const result = await clone('job', exampleJob.id, {
      idPrefix: 'example_',
      transform: (cloned) => ({
        ...cloned,
        job_name: `${cloned.job_name} (Example Clone)`,
        config: {
          ...cloned.config,
          timeout: 600 // Double the timeout for example
        }
      })
    })
    console.log('Clone result:', result)
  }

  const handleCopyHistory = async () => {
    try {
      const history = await copyService.getCopyHistory(10, 0)
      console.log('Copy history:', history)
    } catch (error) {
      console.error('Failed to fetch copy history:', error)
    }
  }

  const handleCopyStats = async () => {
    try {
      const stats = await copyService.getCopyStats('week')
      console.log('Copy stats:', stats)
    } catch (error) {
      console.error('Failed to fetch copy stats:', error)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Copy & Clone Examples</h1>
        <p className="text-muted-foreground">
          Demonstrating various copy and clone functionality
        </p>
      </div>

      {/* Example Job */}
      <Card>
        <CardHeader>
          <CardTitle>Example Job</CardTitle>
          <CardDescription>
            Sample job entity to demonstrate copy and clone operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID:</strong> <code className="bg-muted px-1 rounded">{exampleJob.id}</code>
              </div>
              <div>
                <strong>Name:</strong> {exampleJob.job_name}
              </div>
              <div>
                <strong>Type:</strong> {exampleJob.job_type}
              </div>
              <div>
                <strong>Schedule:</strong> {exampleJob.cron_schedule}
              </div>
              <div>
                <strong>Status:</strong> 
                <Badge variant={exampleJob.enabled ? 'default' : 'secondary'} className="ml-2">
                  {exampleJob.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <strong>Next Run:</strong> {new Date(exampleJob.next_run_at).toLocaleString()}
              </div>
            </div>
            
            <div>
              <strong>Configuration:</strong>
              <pre className="mt-2 text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(exampleJob.config, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Copy Examples</CardTitle>
          <CardDescription>
            Different ways to copy data using the copy utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <CopyButton
              data={exampleJob.id}
              onSuccess={() => console.log('Job ID copied')}
              telemetry={{ operation: 'copy-job-id-example' }}
            >
              Copy Job ID
            </CopyButton>
            
            <CopyButton
              data={exampleJob}
              isJson={true}
              onSuccess={() => console.log('Job JSON copied')}
              telemetry={{ operation: 'copy-job-json-example' }}
            >
              Copy Job JSON
            </CopyButton>
            
            <Button
              variant="outline"
              onClick={handleCopyJobId}
              disabled={isCopying}
            >
              {isCopying ? 'Copying...' : 'Copy ID (Hook)'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyJobJson}
              disabled={isCopying}
            >
              {isCopying ? 'Copying...' : 'Copy JSON (Hook)'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clone Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Clone Examples</CardTitle>
          <CardDescription>
            Clone operations with preview and custom transformations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCloneJob}>
              Clone Job (Dialog)
            </Button>
            
            <Button
              variant="outline"
              onClick={handlePreviewClone}
              disabled={isPreviewing}
            >
              {isPreviewing ? 'Previewing...' : 'Preview Clone (Hook)'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleExecuteClone}
              disabled={isCloning}
            >
              {isCloning ? 'Cloning...' : 'Execute Clone (Hook)'}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">Error: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Service Examples</CardTitle>
          <CardDescription>
            Using the copy service for advanced operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleCopyHistory}
            >
              Fetch Copy History
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCopyStats}
            >
              Fetch Copy Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clone Dialog */}
      <CloneDialog
        open={showCloneDialog}
        onOpenChange={setShowCloneDialog}
        sourceType="job"
        sourceId={exampleJob.id}
        sourceName={exampleJob.job_name}
        onSuccess={(result) => {
          console.log('Job cloned via dialog:', result)
          setShowCloneDialog(false)
        }}
        onError={(error) => {
          console.error('Clone failed via dialog:', error)
        }}
      />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Copy Button:</strong> Click any copy button to copy data to clipboard. 
              Check browser console for success/error logs.
            </div>
            <div>
              <strong>Clone Dialog:</strong> Opens a modal to preview and execute clone operations. 
              Shows diff of changes before execution.
            </div>
            <div>
              <strong>Service Calls:</strong> Demonstrates backend service integration for 
              copy history and statistics.
            </div>
            <div>
              <strong>Browser Console:</strong> Open developer tools to see detailed logs 
              for all operations and telemetry data.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
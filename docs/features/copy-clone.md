# Copy & Clone Suite

The Copy & Clone Suite provides comprehensive copy and clone functionality across the WinMix TipsterHub platform, with clipboard utilities, deep cloning capabilities, audit trails, and administrative oversight.

## Overview

This suite enables users to:
- Copy text and JSON data to the clipboard with fallback support
- Clone scheduler jobs, configurations, dashboards, and reports
- Preview clone operations before execution
- Maintain audit trails for all copy operations
- Monitor copy activity through admin interfaces

## Features

### 1. Clipboard Utilities (`src/lib/copy/clipboard.ts`)

- **Modern Clipboard API Support**: Uses `navigator.clipboard` when available
- **Fallback Support**: Gracefully degrades to `execCommand` for older browsers
- **JSON Handling**: Specialized functions for copying structured data
- **Permission Management**: Handles clipboard permissions appropriately
- **Telemetry Integration**: Logs operations for analytics and debugging

#### Key Functions

```typescript
// Basic text copy
const result = await copyToClipboard('text data', {
  onSuccess: (data) => console.log('Copied:', data),
  onError: (error) => console.error('Failed:', error),
  telemetry: { operation: 'copy-job-id', metadata: { source: 'jobs-page' } }
})

// JSON copy with formatting
const jsonResult = await copyJsonToClipboard({ id: '123', name: 'Test' }, {
  telemetry: { operation: 'copy-config' }
})

// Read from clipboard
const readResult = await readFromClipboard()

// Read and parse JSON
const jsonData = await readJsonFromClipboard<MyType>()
```

### 2. Deep Clone Utilities (`src/lib/copy/deepClone.ts`)

- **ID Remapping**: Automatically generates new IDs for cloned entities
- **Relationship Preservation**: Maintains foreign key relationships
- **Type-Safe Cloning**: Validates input with Zod schemas
- **Batch Operations**: Clone multiple entities simultaneously
- **Integrity Validation**: Verify clone success with detailed reporting

#### Key Functions

```typescript
// Generic deep clone
const result = deepClone(entity, {
  idPrefix: 'clone_',
  transform: (cloned) => ({ ...cloned, name: `${cloned.name} (Clone)` }),
  validate: (entity) => entity.requiredProperty !== undefined
})

// Type-specific cloning
const jobClone = cloneSchedulerJob(job, { idSuffix: '_copy' })
const configClone = cloneConfiguration(config)
const dashboardClone = cloneDashboard(dashboard)
const reportClone = cloneReport(report)

// Batch cloning
const batchResult = batchClone([entity1, entity2, entity3], {
  idPrefix: 'batch_'
})

// Integrity validation
const validation = validateCloneIntegrity(original, cloned, idMap)
```

### 3. React Hooks

#### `useCopy` Hook (`src/hooks/useCopy.ts`)
Generic copy functionality with toast notifications.

```typescript
const { copy, isLoading, error } = useCopy({
  onSuccess: (data) => console.log('Copied:', data),
  showToast: true,
  telemetry: { operation: 'copy-button-click' }
})

// Usage
await copy('text to copy')
```

#### `useCopyToClipboard` Hook (`src/hooks/useCopyToClipboard.ts`)
Enhanced clipboard functionality with permission handling.

```typescript
const { 
  copy, 
  copyJson, 
  read, 
  readJson, 
  isSupported, 
  permission,
  requestPermission 
} = useCopyToClipboard({
  onSuccess: (data) => console.log('Copied:', data),
  onError: (error) => console.error('Copy failed:', error),
  requestPermissionOnFirstUse: true
})

// Usage
await copy('text data')
await copyJson({ complex: 'object' })
const clipboardData = await read()
const parsedData = await readJson<MyType>()
```

#### `useDeepClone` Hook (`src/hooks/useDeepClone.ts`)
Deep clone functionality with optimistic updates and preview support.

```typescript
const { 
  preview, 
  clone, 
  cloneLocal, 
  isCloning, 
  preview: previewData,
  error 
} = useDeepClone({
  onSuccess: (result, original) => console.log('Cloned:', result),
  validateBeforeClone: true,
  optimisticUpdate: false
})

// Preview a clone
const previewResult = await preview('job', 'job-123')

// Execute clone
const cloneResult = await clone('job', 'job-123', {
  idPrefix: 'custom_',
  transform: (entity) => ({ ...entity, customField: 'value' })
})
```

### 4. UI Components

#### CopyButton (`src/components/copy/CopyButton.tsx`)
Reusable copy button with loading states and visual feedback.

```typescript
<CopyButton 
  data={textToCopy}
  variant="outline"
  size="sm"
  isJson={false}
  onSuccess={() => console.log('Copied!')}
  telemetry={{ operation: 'copy-job-id' }}
>
  Copy ID
</CopyButton>

// Icon-only version
<CopyIconButton 
  data={jsonData}
  isJson={true}
  tooltip="Copy JSON configuration"
/>
```

#### CloneDialog (`src/components/copy/CloneDialog.tsx`)
Modal for previewing and confirming clone operations.

```typescript
<CloneDialog
  open={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  sourceType="job"
  sourceId="job-123"
  sourceName="Data Processing Job"
  onSuccess={(result) => console.log('Cloned:', result)}
  onError={(error) => console.error('Clone failed:', error)}
/>
```

### 5. Copy Service (`src/services/copy/copyService.ts`)

Frontend service that orchestrates copy operations with backend integration.

```typescript
import { copyService } from '@/services/copy/copyService'

// Get copy history
const { data: operations, count } = await copyService.getCopyHistory(50, 0)

// Preview clone
const preview = await copyService.previewClone('job', 'job-123', {
  idPrefix: 'preview_'
})

// Execute clone
const result = await copyService.executeCopyOperation({
  operation_type: 'clone',
  source_type: 'job',
  source_id: 'job-123',
  payload: { customOptions: true }
})

// Get statistics
const stats = await copyService.getCopyStats('week')
```

### 6. Backend Integration

#### Copy Operation Edge Function (`supabase/functions/copy-operation/index.ts`)
Deno-based edge function that handles copy operations with audit logging.

**Features:**
- Authentication and authorization checks
- Type-specific cloning logic
- Audit trail creation and updates
- Error handling and rollback support
- Payload hash generation for integrity

**API Endpoints:**
```
POST /functions/v1/copy-operation
```

**Request Format:**
```typescript
{
  operation_type: 'copy' | 'clone',
  source_type: 'job' | 'configuration' | 'dashboard' | 'report',
  source_id: string,
  payload?: any,
  metadata?: Record<string, any>
}
```

**Response Format:**
```typescript
{
  success: boolean,
  operation_id?: string,
  data?: any,
  error?: string
}
```

#### Database Schema (`copy_operation_audit` table)

```sql
CREATE TABLE copy_operation_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('copy', 'clone')),
  source_type TEXT NOT NULL CHECK (source_type IN ('job', 'configuration', 'dashboard', 'report')),
  source_id TEXT NOT NULL,
  target_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failure', 'pending')),
  payload_hash TEXT,
  payload JSONB,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

### 7. Admin Interface

#### Copy Activity Page (`src/pages/admin/CopyActivityPage.tsx`)
Administrative interface for monitoring copy operations.

**Features:**
- Real-time statistics dashboard
- Filterable operation history
- Detailed operation inspection
- CSV export functionality
- Pagination support
- Search and filtering capabilities

**Access:** Admin and analyst roles

## Usage Examples

### Basic Copy Operation

```typescript
import { CopyButton } from '@/components/copy/CopyButton'

// In a component
function JobRow({ job }) {
  return (
    <tr>
      <td>{job.name}</td>
      <td>
        <code>{job.id}</code>
        <CopyButton 
          data={job.id}
          size="icon"
          telemetry={{ operation: 'copy-job-id', metadata: { jobId: job.id } }}
        />
      </td>
    </tr>
  )
}
```

### Clone Operation with Preview

```typescript
import { CloneDialog } from '@/components/copy/CloneDialog'

function JobManagement() {
  const [selectedJob, setSelectedJob] = useState(null)
  
  const handleCloneSuccess = (clonedJob) => {
    console.log('Job cloned successfully:', clonedJob)
    // Refresh job list
    queryClient.invalidateQueries(['jobs'])
  }
  
  return (
    <div>
      {/* Job list with clone buttons */}
      <button onClick={() => setSelectedJob(job)}>Clone Job</button>
      
      {/* Clone dialog */}
      <CloneDialog
        open={!!selectedJob}
        onOpenChange={() => setSelectedJob(null)}
        sourceType="job"
        sourceId={selectedJob?.id}
        sourceName={selectedJob?.name}
        onSuccess={handleCloneSuccess}
      />
    </div>
  )
}
```

### Advanced Deep Clone with Custom Transform

```typescript
import { useDeepClone } from '@/hooks/useDeepClone'

function CustomCloneComponent() {
  const { clone, isCloning } = useDeepClone({
    onSuccess: (result, original) => {
      // Custom success handling
      showNotification(`${original.name} cloned as ${result.name}`)
    }
  })
  
  const handleCustomClone = async (originalEntity) => {
    const result = await clone('dashboard', originalEntity.id, {
      idPrefix: 'custom_',
      transform: (cloned) => ({
        ...cloned,
        name: `${cloned.name} (Custom Clone)`,
        customField: 'added during clone',
        metadata: {
          ...cloned.metadata,
          clonedBy: 'custom-process',
          cloneTimestamp: new Date().toISOString()
        }
      })
    })
    
    return result
  }
  
  return (
    <button 
      onClick={() => handleCustomClone(selectedDashboard)}
      disabled={isCloning}
    >
      {isCloning ? 'Cloning...' : 'Custom Clone'}
    </button>
  )
}
```

## Integrity Guarantees

### Data Integrity
- **Schema Validation**: All entities are validated against Zod schemas before cloning
- **Type Safety**: TypeScript ensures type-safe operations throughout the stack
- **Referential Integrity**: Foreign key relationships are preserved through ID remapping

### Operation Integrity
- **Atomic Operations**: Clone operations are atomic - either fully succeed or fail completely
- **Audit Trail**: Every operation is logged with full context and payload hashes
- **Rollback Support**: Failed operations leave no partial data in the system

### Security
- **Authorization**: All operations require appropriate user roles (admin/analyst for cloning)
- **Permission Handling**: Clipboard operations respect browser permission models
- **Input Validation**: All inputs are validated and sanitized

## Performance Considerations

### Frontend
- **Optimistic Updates**: Optional optimistic updates improve perceived performance
- **Lazy Loading**: Preview operations load data only when needed
- **Caching**: Query results are cached to reduce redundant requests

### Backend
- **Efficient ID Generation**: Uses database UUID generation for optimal performance
- **Batch Operations**: Supports bulk cloning to minimize database round trips
- **Indexing**: Audit table is properly indexed for fast queries

### Browser Compatibility
- **Graceful Degradation**: Falls back to legacy clipboard methods when needed
- **Feature Detection**: Properly detects and adapts to browser capabilities
- **Memory Management**: Efficient handling of large data structures

## Troubleshooting

### Common Issues

#### Clipboard Access Denied
**Problem**: Browser denies clipboard access
**Solution**: 
- Ensure user interaction (click, keyboard) triggers the copy
- Use HTTPS in production
- Handle permission requests appropriately

#### Clone Operation Fails
**Problem**: Clone operation returns error
**Solution**:
- Check user permissions (admin/analyst required)
- Verify source entity exists
- Check database connectivity
- Review audit logs for detailed error information

#### Preview Not Loading
**Problem**: Clone preview shows loading indefinitely
**Solution**:
- Check network connectivity
- Verify edge function is deployed
- Check browser console for JavaScript errors
- Ensure source ID is valid

#### ID Conflicts
**Problem**: Cloned entity has conflicting ID
**Solution**:
- Use unique ID prefixes/suffixes
- Check existing ID mappings
- Verify ID generation logic

### Debug Tools

#### Browser Console
```javascript
// Check clipboard support
console.log('Clipboard available:', !!navigator.clipboard)

// Check permission status
navigator.permissions.query({ name: 'clipboard-write' })
  .then(result => console.log('Permission:', result.state))
```

#### Database Queries
```sql
-- Check recent copy operations
SELECT * FROM copy_operation_audit 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Check failed operations
SELECT * FROM copy_operation_audit 
WHERE status = 'failure'
ORDER BY created_at DESC;

-- Check operations by user
SELECT user_id, COUNT(*) as operation_count
FROM copy_operation_audit
GROUP BY user_id
ORDER BY operation_count DESC;
```

## Testing

### Unit Tests
- **Clipboard Utilities**: `src/__tests__/lib/copy/clipboard.test.ts`
- **Deep Clone**: `src/__tests__/lib/copy/deepClone.test.ts`
- **Copy Service**: `src/__tests__/services/copy/copyService.test.ts`

### Integration Tests
- **Edge Function**: `supabase/tests/copy-operation.test.ts`
- **End-to-End**: `e2e/copy-clone.spec.ts`

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Future Enhancements

### Planned Features
- **Real-time Collaboration**: Live clone operation updates
- **Advanced Diff Viewer**: Visual diff for complex objects
- **Clone Templates**: Pre-configured clone patterns
- **Bulk Operations**: Enhanced batch processing with progress
- **Export/Import**: Clone configuration portability

### Performance Optimizations
- **Web Workers**: Offload heavy clone operations
- **Streaming**: Handle large datasets efficiently
- **Caching**: Enhanced caching strategies
- **Lazy Loading**: Progressive data loading

### Security Enhancements
- **Audit Log Encryption**: Sensitive data protection
- **Operation Signing**: Cryptographic operation verification
- **Rate Limiting**: Prevent abuse of copy operations
- **Access Control**: Granular permission management

## API Reference

### Clipboard API

#### `copyToClipboard(data: string, options?: ClipboardOptions): Promise<CopyResult>`
Copies text to clipboard with fallback support.

#### `copyJsonToClipboard(data: any, options?: ClipboardOptions): Promise<CopyResult>`
Copies JSON data to clipboard with automatic stringification.

#### `readFromClipboard(): Promise<CopyResult>`
Reads text from clipboard.

#### `readJsonFromClipboard<T>(): Promise<CopyResult & { data?: T }>`
Reads and parses JSON from clipboard.

### Deep Clone API

#### `deepClone<T>(entity: T, options?: CloneOptions): CloneResult<T>`
Generic deep clone with ID remapping and validation.

#### `cloneSchedulerJob(job: any, options?: CloneOptions): CloneResult`
Type-specific job cloning with business logic.

#### `cloneConfiguration(config: any, options?: CloneOptions): CloneResult`
Type-specific configuration cloning.

#### `cloneDashboard(dashboard: any, options?: CloneOptions): CloneResult`
Type-specific dashboard cloning.

#### `cloneReport(report: any, options?: CloneOptions): CloneResult`
Type-specific report cloning.

#### `batchClone<T>(entities: T[], options?: CloneOptions): CloneResult<T[]>`
Clones multiple entities with shared ID mapping.

### Service API

#### `copyService.getCopyHistory(limit?: number, offset?: number): Promise<{ data: CopyOperationAudit[], count: number }>`
Retrieves paginated copy operation history.

#### `copyService.previewClone(sourceType, sourceId, options?): Promise<ClonePreview>`
Previews clone operation without executing it.

#### `copyService.executeCopyOperation(request): Promise<CopyOperationResponse>`
Executes copy/clone operation via backend service.

#### `copyService.getCopyStats(timeframe?): Promise<CopyStats>`
Retrieves copy operation statistics.

## Contributing

When contributing to the Copy & Clone Suite:

1. **Follow existing patterns** for consistency
2. **Add comprehensive tests** for new functionality
3. **Update documentation** with API changes
4. **Consider browser compatibility** for clipboard operations
5. **Handle errors gracefully** with user-friendly messages
6. **Add telemetry** for debugging and analytics
7. **Maintain type safety** with TypeScript
8. **Respect security boundaries** and permission models

## License

This feature is part of the WinMix TipsterHub platform and follows the same licensing terms.
/**
 * Copy Utilities Index
 */

// Clipboard utilities
export {
  copyToClipboard,
  copyJsonToClipboard,
  readFromClipboard,
  readJsonFromClipboard,
  isClipboardAvailable,
  getClipboardPermission,
  requestClipboardPermission,
  type ClipboardOptions,
  type CopyResult
} from './clipboard'

// Deep clone utilities
export {
  deepClone,
  cloneSchedulerJob,
  cloneConfiguration,
  cloneDashboard,
  cloneReport,
  batchClone,
  validateCloneIntegrity,
  type CloneableEntity,
  type CloneOptions,
  type CloneContext,
  type CloneResult
} from './deepClone'
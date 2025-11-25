/**
 * Clipboard utility functions with fallbacks and telemetry hooks
 */

export interface ClipboardOptions {
  onSuccess?: (data: string) => void;
  onError?: (error: Error) => void;
  telemetry?: {
    operation: string;
    metadata?: Record<string, any>;
  };
}

export interface CopyResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
}

/**
 * Copy text to clipboard with fallback to execCommand
 */
export async function copyToClipboard(
  data: string, 
  options: ClipboardOptions = {}
): Promise<CopyResult> {
  const { onSuccess, onError, telemetry } = options;

  try {
    // Try modern clipboard API first
    if (isClipboardAvailable()) {
      await navigator.clipboard.writeText(data);
    } else {
      // Fallback to execCommand method
      await copyWithExecCommand(data);
    }

    // Log telemetry if provided
    if (telemetry) {
      logTelemetry('clipboard_copy_success', {
        operation: telemetry.operation,
        dataLength: data.length,
        metadata: telemetry.metadata,
      });
    }

    onSuccess?.(data);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error telemetry
    if (telemetry) {
      logTelemetry('clipboard_copy_error', {
        operation: telemetry.operation,
        error: errorMessage,
        metadata: telemetry.metadata,
      });
    }

    onError?.(error instanceof Error ? error : new Error(errorMessage));
    return { success: false, error: errorMessage };
  }
}

/**
 * Copy JSON data to clipboard (stringifies it)
 */
export async function copyJsonToClipboard(
  data: any,
  options: ClipboardOptions = {}
): Promise<CopyResult> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    return await copyToClipboard(jsonString, {
      ...options,
      telemetry: {
        ...options.telemetry,
        metadata: {
          ...options.telemetry?.metadata,
          dataType: 'json',
          originalType: typeof data,
        },
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to stringify JSON';
    options.onError?.(new Error(errorMessage));
    return { success: false, error: errorMessage };
  }
}

/**
 * Read text from clipboard
 */
export async function readFromClipboard(): Promise<CopyResult> {
  try {
    if (!isClipboardAvailable()) {
      throw new Error('Clipboard API not available');
    }

    const text = await navigator.clipboard.readText();
    return { success: true, data: text };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to read clipboard';
    return { success: false, error: errorMessage };
  }
}

/**
 * Parse JSON from clipboard
 */
export async function readJsonFromClipboard<T = any>(): Promise<CopyResult & { data?: T }> {
  try {
    const result = await readFromClipboard();
    if (!result.success) {
      return result;
    }

    const parsed = JSON.parse(result.data!);
    return { success: true, data: parsed };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse JSON from clipboard';
    return { success: false, error: errorMessage };
  }
}

/**
 * Fallback method using execCommand and textarea
 */
async function copyWithExecCommand(text: string): Promise<void> {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  textarea.style.top = '-999999px';
  document.body.appendChild(textarea);
  
  try {
    textarea.focus();
    textarea.select();
    
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('execCommand copy failed');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Simple telemetry logger - can be replaced with actual analytics
 */
function logTelemetry(event: string, properties: Record<string, any>): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Clipboard Telemetry] ${event}:`, properties);
  }
  
  // TODO: Integrate with actual analytics service
  // This could send to your analytics backend, Mixpanel, etc.
}

/**
 * Get clipboard permission status
 */
export async function getClipboardPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
    return permission.state;
  } catch {
    return 'prompt';
  }
}

/**
 * Request clipboard permission if needed
 */
export async function requestClipboardPermission(): Promise<boolean> {
  try {
    // Try a simple write to trigger permission prompt if needed
    await navigator.clipboard.writeText('');
    return true;
  } catch {
    return false;
  }
}
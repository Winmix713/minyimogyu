/**
 * Tests for clipboard utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  copyToClipboard, 
  copyJsonToClipboard, 
  readFromClipboard, 
  readJsonFromClipboard,
  isClipboardAvailable,
  getClipboardPermission,
  requestClipboardPermission
} from '@/lib/copy/clipboard'

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn(),
  readText: vi.fn(),
}

// Mock navigator.permissions
const mockPermissions = {
  query: vi.fn(),
}

// Mock document.execCommand
const mockExecCommand = vi.fn()

// Mock console.log to capture telemetry
const mockConsoleLog = vi.fn()

describe('Clipboard Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    })
    
    Object.defineProperty(navigator, 'permissions', {
      value: mockPermissions,
      writable: true,
    })
    
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true,
    })
    
    vi.stubGlobal('console', { log: mockConsoleLog })
    vi.stubGlobal('import', { meta: { env: { DEV: false } } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('isClipboardAvailable', () => {
    it('returns true when clipboard API is available', () => {
      expect(isClipboardAvailable()).toBe(true)
    })

    it('returns false when clipboard API is not available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })
      
      expect(isClipboardAvailable()).toBe(false)
    })

    it('returns false when writeText is not available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: undefined },
        writable: true,
      })
      
      expect(isClipboardAvailable()).toBe(false)
    })
  })

  describe('copyToClipboard', () => {
    it('copies text using clipboard API when available', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined)
      
      const result = await copyToClipboard('test text')
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test text')
      expect(result.success).toBe(true)
      expect(result.data).toBe('test text')
    })

    it('falls back to execCommand when clipboard API fails', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard API failed'))
      mockExecCommand.mockReturnValue(true)
      
      // Mock DOM methods for fallback
      const mockTextarea = {
        value: '',
        style: { position: '', left: '', top: '' },
        focus: vi.fn(),
        select: vi.fn(),
      }
      
      const mockCreateElement = vi.fn(() => mockTextarea)
      const mockAppendChild = vi.fn()
      const mockRemoveChild = vi.fn()
      
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true,
      })
      
      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true,
      })
      
      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true,
      })
      
      const result = await copyToClipboard('test text')
      
      expect(mockCreateElement).toHaveBeenCalledWith('textarea')
      expect(mockTextarea.value).toBe('test text')
      expect(mockTextarea.focus).toHaveBeenCalled()
      expect(mockTextarea.select).toHaveBeenCalled()
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
      expect(result.success).toBe(true)
    })

    it('handles errors gracefully', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard failed'))
      mockExecCommand.mockReturnValue(false)
      
      // Mock DOM methods
      const mockTextarea = { value: '', style: {}, focus: vi.fn(), select: vi.fn() }
      const mockCreateElement = vi.fn(() => mockTextarea)
      const mockAppendChild = vi.fn()
      const mockRemoveChild = vi.fn()
      
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true,
      })
      
      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true,
      })
      
      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true,
      })
      
      const result = await copyToClipboard('test text')
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('calls success callback when provided', async () => {
      const onSuccess = vi.fn()
      mockClipboard.writeText.mockResolvedValue(undefined)
      
      await copyToClipboard('test text', { onSuccess })
      
      expect(onSuccess).toHaveBeenCalledWith('test text')
    })

    it('calls error callback when provided', async () => {
      const onError = vi.fn()
      mockClipboard.writeText.mockRejectedValue(new Error('Test error'))
      mockExecCommand.mockReturnValue(false)
      
      // Mock DOM methods
      const mockTextarea = { value: '', style: {}, focus: vi.fn(), select: vi.fn() }
      const mockCreateElement = vi.fn(() => mockTextarea)
      const mockAppendChild = vi.fn()
      const mockRemoveChild = vi.fn()
      
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
        writable: true,
      })
      
      Object.defineProperty(document.body, 'appendChild', {
        value: mockAppendChild,
        writable: true,
      })
      
      Object.defineProperty(document.body, 'removeChild', {
        value: mockRemoveChild,
        writable: true,
      })
      
      await copyToClipboard('test text', { onError })
      
      expect(onError).toHaveBeenCalled()
    })

    it('logs telemetry when provided', async () => {
      const telemetry = { operation: 'test-copy', metadata: { source: 'unit-test' } }
      mockClipboard.writeText.mockResolvedValue(undefined)
      
      vi.stubGlobal('import', { meta: { env: { DEV: true } } })
      
      await copyToClipboard('test text', { telemetry })
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Clipboard Telemetry] clipboard_copy_success:',
        expect.objectContaining({
          operation: 'test-copy',
          dataLength: 9,
          metadata: { source: 'unit-test' }
        })
      )
    })
  })

  describe('copyJsonToClipboard', () => {
    it('copies JSON as formatted string', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined)
      
      const data = { name: 'test', value: 123 }
      const result = await copyJsonToClipboard(data)
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith(JSON.stringify(data, null, 2))
      expect(result.success).toBe(true)
      expect(result.data).toBe(JSON.stringify(data, null, 2))
    })

    it('handles JSON stringify errors', async () => {
      const circularData = {}
      circularData.self = circularData // Create circular reference
      
      const result = await copyJsonToClipboard(circularData)
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to stringify JSON')
    })

    it('includes data type in telemetry', async () => {
      const telemetry = { operation: 'test-json-copy' }
      mockClipboard.writeText.mockResolvedValue(undefined)
      
      vi.stubGlobal('import', { meta: { env: { DEV: true } } })
      
      const data = { test: true }
      await copyJsonToClipboard(data, { telemetry })
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[Clipboard Telemetry] clipboard_copy_success:',
        expect.objectContaining({
          operation: 'test-json-copy',
          metadata: expect.objectContaining({
            dataType: 'json',
            originalType: 'object'
          })
        })
      )
    })
  })

  describe('readFromClipboard', () => {
    it('reads text from clipboard', async () => {
      const testText = 'clipboard content'
      mockClipboard.readText.mockResolvedValue(testText)
      
      const result = await readFromClipboard()
      
      expect(mockClipboard.readText).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.data).toBe(testText)
    })

    it('handles clipboard read errors', async () => {
      mockClipboard.readText.mockRejectedValue(new Error('Read failed'))
      
      const result = await readFromClipboard()
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to read clipboard')
    })

    it('returns error when clipboard API not available', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })
      
      const result = await readFromClipboard()
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Clipboard API not available')
    })
  })

  describe('readJsonFromClipboard', () => {
    it('reads and parses JSON from clipboard', async () => {
      const testData = { test: true }
      mockClipboard.readText.mockResolvedValue(JSON.stringify(testData))
      
      const result = await readJsonFromClipboard()
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(testData)
    })

    it('handles JSON parse errors', async () => {
      mockClipboard.readText.mockResolvedValue('invalid json')
      
      const result = await readJsonFromClipboard()
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to parse JSON from clipboard')
    })

    it('propagates clipboard read errors', async () => {
      mockClipboard.readText.mockRejectedValue(new Error('Read failed'))
      
      const result = await readJsonFromClipboard()
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to read clipboard')
    })
  })

  describe('getClipboardPermission', () => {
    it('returns permission state when permissions API is available', async () => {
      const mockPermissionState = { state: 'granted' }
      mockPermissions.query.mockResolvedValue(mockPermissionState)
      
      const result = await getClipboardPermission()
      
      expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'clipboard-write' })
      expect(result).toBe('granted')
    })

    it('returns prompt when permissions API is not available', async () => {
      Object.defineProperty(navigator, 'permissions', {
        value: undefined,
        writable: true,
      })
      
      const result = await getClipboardPermission()
      
      expect(result).toBe('prompt')
    })

    it('returns prompt when permissions query fails', async () => {
      mockPermissions.query.mockRejectedValue(new Error('Permission query failed'))
      
      const result = await getClipboardPermission()
      
      expect(result).toBe('prompt')
    })
  })

  describe('requestClipboardPermission', () => {
    it('returns true when clipboard write succeeds', async () => {
      mockClipboard.writeText.mockResolvedValue(undefined)
      
      const result = await requestClipboardPermission()
      
      expect(mockClipboard.writeText).toHaveBeenCalledWith('')
      expect(result).toBe(true)
    })

    it('returns false when clipboard write fails', async () => {
      mockClipboard.writeText.mockRejectedValue(new Error('Permission denied'))
      
      const result = await requestClipboardPermission()
      
      expect(result).toBe(false)
    })
  })
})
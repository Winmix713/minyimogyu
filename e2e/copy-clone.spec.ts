/**
 * Playwright tests for copy/clone functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Copy/Clone Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@example.com')
    await page.fill('[data-testid="password"]', 'admin-password')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })

  test('copy button copies text to clipboard', async ({ page }) => {
    // Navigate to a page with copyable content
    await page.goto('/jobs')
    
    // Find a job with copy button
    const jobRow = page.locator('[data-testid="job-row"]').first()
    const copyButton = jobRow.locator('[data-testid="copy-button"]')
    
    // Get the job ID to verify
    const jobId = await jobRow.locator('[data-testid="job-id"]').textContent()
    
    // Click copy button
    await copyButton.click()
    
    // Verify success toast appears
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Copied')
    
    // Verify clipboard content (using page.evaluate)
    const clipboardContent = await page.evaluate(async () => {
      return await navigator.clipboard.readText()
    })
    
    expect(clipboardContent).toBe(jobId)
  })

  test('copy button handles clipboard errors gracefully', async ({ page }) => {
    // Mock clipboard failure
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.reject(new Error('Clipboard denied'))
        }
      })
    })
    
    await page.goto('/jobs')
    
    const copyButton = page.locator('[data-testid="copy-button"]').first()
    await copyButton.click()
    
    // Verify error toast appears
    await expect(page.locator('[data-testid="toast-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="toast-error"]')).toContainText('Copy failed')
    
    // Verify button shows error state
    await expect(copyButton.locator('[data-testid="error-icon"]')).toBeVisible()
  })

  test('clone dialog previews job clone correctly', async ({ page }) => {
    await page.goto('/jobs')
    
    // Find a job and click clone button
    const jobRow = page.locator('[data-testid="job-row"]').first()
    const cloneButton = jobRow.locator('[data-testid="clone-button"]')
    await cloneButton.click()
    
    // Wait for dialog to open
    await expect(page.locator('[data-testid="clone-dialog"]')).toBeVisible()
    
    // Verify dialog title
    await expect(page.locator('[data-testid="clone-dialog-title"]')).toContainText('Clone Job')
    
    // Click preview button
    await page.click('[data-testid="preview-button"]')
    
    // Wait for preview to load
    await expect(page.locator('[data-testid="preview-loading"]')).not.toBeVisible()
    
    // Verify preview tab shows cloned data
    await expect(page.locator('[data-testid="preview-content"]')).toBeVisible()
    
    // Verify changes tab shows modifications
    await page.click('[data-testid="changes-tab"]')
    await expect(page.locator('[data-testid="changes-list"]')).toBeVisible()
    
    // Should show job_name modification
    await expect(page.locator('[data-testid="change-job_name"]')).toBeVisible()
    await expect(page.locator('[data-testid="change-job_name"]')).toContainText('modified')
    
    // Should show enabled modification
    await expect(page.locator('[data-testid="change-enabled"]')).toBeVisible()
    await expect(page.locator('[data-testid="change-enabled"]')).toContainText('modified')
  })

  test('clone dialog executes job clone successfully', async ({ page }) => {
    await page.goto('/jobs')
    
    // Get initial job count
    const initialJobCount = await page.locator('[data-testid="job-row"]').count()
    
    // Find a job and click clone button
    const jobRow = page.locator('[data-testid="job-row"]').first()
    const originalJobName = await jobRow.locator('[data-testid="job-name"]').textContent()
    
    const cloneButton = jobRow.locator('[data-testid="clone-button"]')
    await cloneButton.click()
    
    // Wait for dialog to open
    await expect(page.locator('[data-testid="clone-dialog"]')).toBeVisible()
    
    // Click preview first
    await page.click('[data-testid="preview-button"]')
    await expect(page.locator('[data-testid="preview-loading"]')).not.toBeVisible()
    
    // Click clone button
    await page.click('[data-testid="execute-clone-button"]')
    
    // Wait for clone to complete
    await expect(page.locator('[data-testid="clone-loading"]')).not.toBeVisible()
    
    // Verify dialog closes
    await expect(page.locator('[data-testid="clone-dialog"]')).not.toBeVisible()
    
    // Verify success toast
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Job cloned successfully')
    
    // Refresh page to see new job
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Verify new job exists
    const newJobCount = await page.locator('[data-testid="job-row"]').count()
    expect(newJobCount).toBe(initialJobCount + 1)
    
    // Find the cloned job
    const clonedJob = page.locator('[data-testid="job-row"]').filter({ hasText: `${originalJobName} (Clone)` })
    await expect(clonedJob).toBeVisible()
    
    // Verify cloned job properties
    await expect(clonedJob.locator('[data-testid="job-enabled"]')).toContainText('false')
  })

  test('clone dialog handles clone failure gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/functions/v1/copy-operation', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Clone operation failed' })
      })
    })
    
    await page.goto('/jobs')
    
    const jobRow = page.locator('[data-testid="job-row"]').first()
    const cloneButton = jobRow.locator('[data-testid="clone-button"]')
    await cloneButton.click()
    
    // Wait for dialog to open
    await expect(page.locator('[data-testid="clone-dialog"]')).toBeVisible()
    
    // Click preview first
    await page.click('[data-testid="preview-button"]')
    await expect(page.locator('[data-testid="preview-loading"]')).not.toBeVisible()
    
    // Click clone button
    await page.click('[data-testid="execute-clone-button"]')
    
    // Wait for clone to fail
    await expect(page.locator('[data-testid="clone-loading"]')).not.toBeVisible()
    
    // Verify error message in dialog
    await expect(page.locator('[data-testid="clone-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="clone-error"]')).toContainText('Clone operation failed')
    
    // Verify dialog stays open
    await expect(page.locator('[data-testid="clone-dialog"]')).toBeVisible()
  })

  test('copy activity page displays operations correctly', async ({ page }) => {
    await page.goto('/admin/copy-activity')
    
    // Verify page loads
    await expect(page.locator('[data-testid="copy-activity-page"]')).toBeVisible()
    
    // Verify statistics cards
    await expect(page.locator('[data-testid="total-operations-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-rate-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="failed-operations-card"]')).toBeVisible()
    await expect(page.locator('[data-testid="most-used-card"]')).toBeVisible()
    
    // Verify operations table
    await expect(page.locator('[data-testid="operations-table"]')).toBeVisible()
    await expect(page.locator('[data-testid="table-header"]')).toBeVisible()
    
    // If there are operations, verify they display correctly
    const operationRows = page.locator('[data-testid="operation-row"]')
    if (await operationRows.count() > 0) {
      const firstRow = operationRows.first()
      
      // Verify status badge
      await expect(firstRow.locator('[data-testid="status-badge"]')).toBeVisible()
      
      // Verify type badge
      await expect(firstRow.locator('[data-testid="type-badge"]')).toBeVisible()
      
      // Verify source ID
      await expect(firstRow.locator('[data-testid="source-id"]')).toBeVisible()
      
      // Verify timestamp
      await expect(firstRow.locator('[data-testid="timestamp"]')).toBeVisible()
      
      // Verify details button
      await expect(firstRow.locator('[data-testid="details-button"]')).toBeVisible()
    }
  })

  test('copy activity page filters work correctly', async ({ page }) => {
    await page.goto('/admin/copy-activity')
    
    // Test status filter
    await page.selectOption('[data-testid="status-filter"]', 'success')
    await expect(page.locator('[data-testid="status-filter"]')).toHaveValue('success')
    
    // Test type filter
    await page.selectOption('[data-testid="type-filter"]', 'job')
    await expect(page.locator('[data-testid="type-filter"]')).toHaveValue('job')
    
    // Test operation filter
    await page.selectOption('[data-testid="operation-filter"]', 'clone')
    await expect(page.locator('[data-testid="operation-filter"]')).toHaveValue('clone')
    
    // Test search
    await page.fill('[data-testid="search-input"]', 'test-job-id')
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('test-job-id')
    
    // Test clear filters
    await page.click('[data-testid="clear-filters-button"]')
    await expect(page.locator('[data-testid="status-filter"]')).toHaveValue('all')
    await expect(page.locator('[data-testid="type-filter"]')).toHaveValue('all')
    await expect(page.locator('[data-testid="operation-filter"]')).toHaveValue('all')
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('')
  })

  test('copy activity page operation details dialog', async ({ page }) => {
    await page.goto('/admin/copy-activity')
    
    // Wait for operations to load
    await page.waitForSelector('[data-testid="operation-row"]', { timeout: 10000 })
    
    const operationRows = page.locator('[data-testid="operation-row"]')
    if (await operationRows.count() > 0) {
      const firstRow = operationRows.first()
      
      // Click details button
      await firstRow.locator('[data-testid="details-button"]').click()
      
      // Verify details dialog opens
      await expect(page.locator('[data-testid="operation-details-dialog"]')).toBeVisible()
      
      // Verify operation details
      await expect(page.locator('[data-testid="operation-id"]')).toBeVisible()
      await expect(page.locator('[data-testid="operation-status"]')).toBeVisible()
      await expect(page.locator('[data-testid="operation-type"]')).toBeVisible()
      await expect(page.locator('[data-testid="source-type"]')).toBeVisible()
      await expect(page.locator('[data-testid="source-id"]')).toBeVisible()
      
      // Close dialog
      await page.click('[data-testid="close-dialog-button"]')
      await expect(page.locator('[data-testid="operation-details-dialog"]')).not.toBeVisible()
    }
  })

  test('copy activity page export to CSV', async ({ page }) => {
    await page.goto('/admin/copy-activity')
    
    // Wait for operations to load
    await page.waitForSelector('[data-testid="operation-row"]', { timeout: 10000 })
    
    const operationRows = page.locator('[data-testid="operation-row"]')
    if (await operationRows.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download')
      
      // Click export button
      await page.click('[data-testid="export-csv-button"]')
      
      // Wait for download
      const download = await downloadPromise
      
      // Verify filename
      const filename = download.suggestedFilename()
      expect(filename).toMatch(/copy-operations-\d{4}-\d{2}-\d{2}\.csv/)
    }
  })

  test('copy activity page pagination', async ({ page }) => {
    await page.goto('/admin/copy-activity')
    
    // Wait for operations to load
    await page.waitForSelector('[data-testid="operation-row"]', { timeout: 10000 })
    
    // Check if pagination is visible (only if there are enough operations)
    const pagination = page.locator('[data-testid="pagination"]')
    if (await pagination.isVisible()) {
      // Test next button
      const nextButton = page.locator('[data-testid="next-button"]')
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await expect(page.locator('[data-testid="pagination-info"]')).toBeVisible()
      }
      
      // Test previous button
      const prevButton = page.locator('[data-testid="previous-button"]')
      if (await prevButton.isEnabled()) {
        await prevButton.click()
        await expect(page.locator('[data-testid="pagination-info"]')).toBeVisible()
      }
    }
  })

  test('copy button with JSON data', async ({ page }) => {
    await page.goto('/models')
    
    // Find a model with JSON data copy button
    const modelRow = page.locator('[data-testid="model-row"]').first()
    const copyJsonButton = modelRow.locator('[data-testid="copy-json-button"]')
    
    if (await copyJsonButton.isVisible()) {
      await copyJsonButton.click()
      
      // Verify success toast
      await expect(page.locator('[data-testid="toast-success"]')).toBeVisible()
      await expect(page.locator('[data-testid="toast-success"]')).toContainText('JSON copied')
      
      // Verify clipboard content is valid JSON
      const clipboardContent = await page.evaluate(async () => {
        return await navigator.clipboard.readText()
      })
      
      expect(() => JSON.parse(clipboardContent)).not.toThrow()
    }
  })

  test('batch clone functionality', async ({ page }) => {
    await page.goto('/jobs')
    
    // Select multiple jobs
    const jobCheckboxes = page.locator('[data-testid="job-checkbox"]')
    const count = await jobCheckboxes.count()
    
    if (count >= 2) {
      // Select first two jobs
      await jobCheckboxes.first().check()
      await jobCheckboxes.nth(1).check()
      
      // Click batch clone button
      await page.click('[data-testid="batch-clone-button"]')
      
      // Verify batch clone dialog opens
      await expect(page.locator('[data-testid="batch-clone-dialog"]')).toBeVisible()
      
      // Verify selected jobs are shown
      await expect(page.locator('[data-testid="selected-jobs-list"]')).toBeVisible()
      await expect(page.locator('[data-testid="selected-job-item"]')).toHaveCount(2)
      
      // Click preview
      await page.click('[data-testid="batch-preview-button"]')
      
      // Wait for preview
      await expect(page.locator('[data-testid="batch-preview-loading"]')).not.toBeVisible()
      
      // Execute batch clone
      await page.click('[data-testid="batch-execute-button"]')
      
      // Wait for completion
      await expect(page.locator('[data-testid="batch-clone-loading"]')).not.toBeVisible()
      
      // Verify success
      await expect(page.locator('[data-testid="toast-success"]')).toBeVisible()
      await expect(page.locator('[data-testid="toast-success"]')).toContainText('Batch clone completed')
    }
  })
})
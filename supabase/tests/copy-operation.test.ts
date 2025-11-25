/**
 * Tests for copy-operation edge function
 */

import { assertEquals, assertExists, assertRejects } from "https://deno.land/std@0.168.0/testing/asserts.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Mock the edge function handler
const { serve } = await import("../../../supabase/functions/copy-operation/index.ts")

// Test utilities
function createMockRequest(method: string, body?: any, headers?: Record<string, string>): Request {
  return new Request("http://localhost", {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer test-token",
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
}

function createMockSupabaseClient(user: any, profile: any, tableResponses: Record<string, any>) {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user }, error: null })
    },
    from: (table: string) => {
      const response = tableResponses[table] || {}
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve(response)
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve(response)
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }
    }
  }
}

Deno.test("copy-operation function handles CORS preflight", async () => {
  const request = createMockRequest("OPTIONS")
  const response = await serve(request)
  
  assertEquals(response.status, 200)
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*")
})

Deno.test("copy-operation function rejects unauthorized requests", async () => {
  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "job",
    source_id: "job-123"
  }, {
    "Authorization": "Bearer invalid-token"
  })

  // Mock the createClient to return unauthorized
  const mockClient = createMockSupabaseClient(null, null, {})
  globalThis.supabase = mockClient

  const response = await serve(request)
  assertEquals(response.status, 401)
  
  const body = await response.json()
  assertEquals(body.error, "Unauthorized")
})

Deno.test("copy-operation function validates required fields", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "admin" }
  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null }
  })
  
  // Mock createClient to return our mock
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    // Missing required fields
    operation_type: "clone"
  })

  const response = await serve(request)
  assertEquals(response.status, 400)
  
  const body = await response.json()
  assertExists(body.error)
  assert(body.error.includes("Missing required fields"))
})

Deno.test("copy-operation function clones job successfully", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "admin" }
  const mockOriginalJob = {
    id: "job-123",
    job_name: "Test Job",
    job_type: "data-processing",
    cron_schedule: "0 0 * * *",
    enabled: true,
    config: { timeout: 300 }
  }
  const mockClonedJob = {
    id: "job-456",
    job_name: "Test Job (Clone)",
    job_type: "data-processing",
    cron_schedule: "0 0 * * *",
    enabled: false,
    config: { timeout: 300 },
    last_run_at: null,
    next_run_at: null
  }

  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null },
    copy_operation_audit: { 
      data: { id: "audit-123" }, 
      error: null 
    },
    scheduled_jobs: {
      data: mockClonedJob,
      error: null
    }
  })
  
  // Override the from method to handle different queries
  mockClient.from = (table: string) => {
    if (table === "user_profiles") {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null })
          })
        })
      }
    } else if (table === "copy_operation_audit") {
      return {
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "audit-123" }, error: null })
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }
    } else if (table === "scheduled_jobs") {
      let callCount = 0
      return {
        select: () => ({
          eq: () => ({
            single: () => {
              callCount++
              if (callCount === 1) {
                // First call - fetch original job
                return Promise.resolve({ data: mockOriginalJob, error: null })
              } else {
                // Second call - this shouldn't happen in our flow
                return Promise.resolve({ data: null, error: { message: "Unexpected call" } })
              }
            }
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: mockClonedJob, error: null })
          })
        })
      }
    }
    return {
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
    }
  }
  
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "job",
    source_id: "job-123"
  })

  const response = await serve(request)
  assertEquals(response.status, 200)
  
  const body = await response.json()
  assertEquals(body.success, true)
  assertEquals(body.data.job_name, "Test Job (Clone)")
  assertEquals(body.data.enabled, false)
  assertEquals(body.operation_id, "audit-123")
})

Deno.test("copy-operation function handles job not found", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "admin" }

  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null },
    copy_operation_audit: { 
      data: { id: "audit-123" }, 
      error: null 
    },
    scheduled_jobs: {
      data: null,
      error: { message: "Not found" }
    }
  })
  
  mockClient.from = (table: string) => {
    if (table === "user_profiles") {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null })
          })
        })
      } else if (table === "copy_operation_audit") {
      return {
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "audit-123" }, error: null })
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }
    } else if (table === "scheduled_jobs") {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "Not found" } })
          })
        })
      }
    }
    return {
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
    }
  }
  
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "job",
    source_id: "non-existent-job"
  })

  const response = await serve(request)
  assertEquals(response.status, 200)
  
  const body = await response.json()
  assertEquals(body.success, false)
  assertExists(body.error)
  assert(body.error.includes("not found"))
})

Deno.test("copy-operation function handles insufficient permissions", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "user" } // Non-admin role

  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null }
  })
  
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "job",
    source_id: "job-123"
  })

  const response = await serve(request)
  assertEquals(response.status, 200)
  
  const body = await response.json()
  assertEquals(body.success, false)
  assertExists(body.error)
  assert(body.error.includes("Admin or analyst access required"))
})

Deno.test("copy-operation function handles configuration clone", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "admin" }
  const mockOriginalConfig = {
    id: "config-123",
    name: "Test Config",
    type: "processing",
    settings: { retries: 3 }
  }
  const mockClonedConfig = {
    id: "config-456",
    name: "Test Config (Clone)",
    type: "processing",
    settings: { retries: 3 },
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }

  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null },
    copy_operation_audit: { 
      data: { id: "audit-123" }, 
      error: null 
    },
    configurations: {
      data: mockClonedConfig,
      error: null
    }
  })
  
  mockClient.from = (table: string) => {
    if (table === "user_profiles") {
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null })
          })
        })
      } else if (table === "copy_operation_audit") {
      return {
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "audit-123" }, error: null })
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }
    } else if (table === "configurations") {
      let callCount = 0
      return {
        select: () => ({
          eq: () => ({
            single: () => {
              callCount++
              if (callCount === 1) {
                return Promise.resolve({ data: mockOriginalConfig, error: null })
              } else {
                return Promise.resolve({ data: null, error: { message: "Unexpected call" } })
              }
            }
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: mockClonedConfig, error: null })
          })
        })
      }
    }
    return {
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) })
    }
  }
  
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "configuration",
    source_id: "config-123"
  })

  const response = await serve(request)
  assertEquals(response.status, 200)
  
  const body = await response.json()
  assertEquals(body.success, true)
  assertEquals(body.data.name, "Test Config (Clone)")
  assertExists(body.data.created_at)
  assertExists(body.data.updated_at)
})

Deno.test("copy-operation function handles unsupported source type", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "admin" }

  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null },
    copy_operation_audit: { 
      data: { id: "audit-123" }, 
      error: null 
    }
  })
  
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "unsupported",
    source_id: "id-123"
  })

  const response = await serve(request)
  assertEquals(response.status, 200)
  
  const body = await response.json()
  assertEquals(body.success, false)
  assertExists(body.error)
  assert(body.error.includes("Unsupported source type"))
})

Deno.test("copy-operation function handles audit entry creation failure", async () => {
  const mockUser = { id: "test-user" }
  const mockProfile = { role: "admin" }

  const mockClient = createMockSupabaseClient(mockUser, mockProfile, {
    user_profiles: { data: mockProfile, error: null },
    copy_operation_audit: { 
      data: null, 
      error: { message: "Database error" } 
    }
  })
  
  globalThis.createClient = () => mockClient

  const request = createMockRequest("POST", {
    operation_type: "clone",
    source_type: "job",
    source_id: "job-123"
  })

  const response = await serve(request)
  assertEquals(response.status, 500)
  
  const body = await response.json()
  assertExists(body.error)
  assert(body.error.includes("Failed to create audit entry"))
})
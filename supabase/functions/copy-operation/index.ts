import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

interface CopyOperationRequest {
  operation_type: 'copy' | 'clone';
  source_type: 'job' | 'configuration' | 'dashboard' | 'report';
  source_id: string;
  payload?: any;
  metadata?: Record<string, any>;
}

interface CopyOperationResponse {
  success: boolean;
  operation_id?: string;
  data?: any;
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user profile for role checking
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const request: CopyOperationRequest = await req.json()

    // Validate required fields
    if (!request.operation_type || !request.source_type || !request.source_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: operation_type, source_type, source_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate payload hash for integrity checking
    const payloadHash = await generateHash(JSON.stringify(request.payload || {}))

    // Create audit entry
    const { data: auditEntry, error: auditError } = await supabaseClient
      .from('copy_operation_audit')
      .insert({
        user_id: user.id,
        operation_type: request.operation_type,
        source_type: request.source_type,
        source_id: request.source_id,
        status: 'pending',
        payload_hash: payloadHash,
        payload: request.payload,
        metadata: request.metadata || {}
      })
      .select()
      .single()

    if (auditError) {
      console.error('Failed to create audit entry:', auditError)
      return new Response(
        JSON.stringify({ error: 'Failed to create audit entry', details: auditError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Execute the copy/clone operation
    let result: CopyOperationResponse
    try {
      result = await executeCopyOperation(supabaseClient, request, profile.role)
    } catch (error) {
      console.error('Copy operation failed:', error)
      result = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Update audit entry with result
    const updateData: any = {
      status: result.success ? 'success' : 'failure',
      completed_at: new Date().toISOString()
    }

    if (result.success && result.data?.id) {
      updateData.target_id = result.data.id
    }

    if (!result.success) {
      updateData.error_message = result.error
    }

    await supabaseClient
      .from('copy_operation_audit')
      .update(updateData)
      .eq('id', auditEntry.id)

    return new Response(
      JSON.stringify({
        ...result,
        operation_id: auditEntry.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in copy-operation function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/**
 * Execute the actual copy/clone operation based on source type
 */
async function executeCopyOperation(
  supabaseClient: any,
  request: CopyOperationRequest,
  userRole: string
): Promise<CopyOperationResponse> {
  switch (request.source_type) {
    case 'job':
      return await cloneJob(supabaseClient, request, userRole)
    case 'configuration':
      return await cloneConfiguration(supabaseClient, request, userRole)
    case 'dashboard':
      return await cloneDashboard(supabaseClient, request, userRole)
    case 'report':
      return await cloneReport(supabaseClient, request, userRole)
    default:
      throw new Error(`Unsupported source type: ${request.source_type}`)
  }
}

/**
 * Clone a scheduled job
 */
async function cloneJob(
  supabaseClient: any,
  request: CopyOperationRequest,
  userRole: string
): Promise<CopyOperationResponse> {
  // Check permissions (admin/analyst only)
  if (!['admin', 'analyst'].includes(userRole)) {
    throw new Error('Admin or analyst access required')
  }

  // Fetch original job
  const { data: originalJob, error: fetchError } = await supabaseClient
    .from('scheduled_jobs')
    .select('*')
    .eq('id', request.source_id)
    .single()

  if (fetchError || !originalJob) {
    throw new Error(`Original job not found: ${fetchError?.message}`)
  }

  // Create cloned job with new ID and modified name
  const clonedJob = {
    ...originalJob,
    job_name: `${originalJob.job_name} (Clone)`,
    enabled: false, // Start disabled
    last_run_at: null,
    next_run_at: null,
    // Remove the original ID to let the database generate a new one
    id: undefined
  }

  // Insert cloned job
  const { data: newJob, error: insertError } = await supabaseClient
    .from('scheduled_jobs')
    .insert(clonedJob)
    .select()
    .single()

  if (insertError || !newJob) {
    throw new Error(`Failed to create cloned job: ${insertError?.message}`)
  }

  return {
    success: true,
    data: newJob
  }
}

/**
 * Clone a configuration
 */
async function cloneConfiguration(
  supabaseClient: any,
  request: CopyOperationRequest,
  userRole: string
): Promise<CopyOperationResponse> {
  // Check permissions (admin/analyst only)
  if (!['admin', 'analyst'].includes(userRole)) {
    throw new Error('Admin or analyst access required')
  }

  // Fetch original configuration
  const { data: originalConfig, error: fetchError } = await supabaseClient
    .from('configurations')
    .select('*')
    .eq('id', request.source_id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Configurations table not found - feature may not be implemented')
    }
    throw new Error(`Original configuration not found: ${fetchError.message}`)
  }

  if (!originalConfig) {
    throw new Error('Original configuration not found')
  }

  // Create cloned configuration
  const clonedConfig = {
    ...originalConfig,
    name: `${originalConfig.name} (Clone)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Remove the original ID
    id: undefined
  }

  // Insert cloned configuration
  const { data: newConfig, error: insertError } = await supabaseClient
    .from('configurations')
    .insert(clonedConfig)
    .select()
    .single()

  if (insertError) {
    throw new Error(`Failed to create cloned configuration: ${insertError.message}`)
  }

  return {
    success: true,
    data: newConfig
  }
}

/**
 * Clone a dashboard
 */
async function cloneDashboard(
  supabaseClient: any,
  request: CopyOperationRequest,
  userRole: string
): Promise<CopyOperationResponse> {
  // Check permissions (admin/analyst only)
  if (!['admin', 'analyst'].includes(userRole)) {
    throw new Error('Admin or analyst access required')
  }

  // Fetch original dashboard
  const { data: originalDashboard, error: fetchError } = await supabaseClient
    .from('dashboards')
    .select('*')
    .eq('id', request.source_id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Dashboards table not found - feature may not be implemented')
    }
    throw new Error(`Original dashboard not found: ${fetchError.message}`)
  }

  if (!originalDashboard) {
    throw new Error('Original dashboard not found')
  }

  // Create cloned dashboard
  const clonedDashboard = {
    ...originalDashboard,
    name: `${originalDashboard.name} (Clone)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Remove the original ID
    id: undefined
  }

  // Insert cloned dashboard
  const { data: newDashboard, error: insertError } = await supabaseClient
    .from('dashboards')
    .insert(clonedDashboard)
    .select()
    .single()

  if (insertError) {
    throw new Error(`Failed to create cloned dashboard: ${insertError.message}`)
  }

  return {
    success: true,
    data: newDashboard
  }
}

/**
 * Clone a report
 */
async function cloneReport(
  supabaseClient: any,
  request: CopyOperationRequest,
  userRole: string
): Promise<CopyOperationResponse> {
  // Check permissions (admin/analyst only)
  if (!['admin', 'analyst'].includes(userRole)) {
    throw new Error('Admin or analyst access required')
  }

  // Fetch original report
  const { data: originalReport, error: fetchError } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('id', request.source_id)
    .single()

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Reports table not found - feature may not be implemented')
    }
    throw new Error(`Original report not found: ${fetchError.message}`)
  }

  if (!originalReport) {
    throw new Error('Original report not found')
  }

  // Create cloned report
  const clonedReport = {
    ...originalReport,
    title: `${originalReport.title} (Clone)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Remove the original ID
    id: undefined
  }

  // Insert cloned report
  const { data: newReport, error: insertError } = await supabaseClient
    .from('reports')
    .insert(clonedReport)
    .select()
    .single()

  if (insertError) {
    throw new Error(`Failed to create cloned report: ${insertError.message}`)
  }

  return {
    success: true,
    data: newReport
  }
}

/**
 * Generate SHA-256 hash
 */
async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
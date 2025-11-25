-- Create copy_operation_audit table
CREATE TABLE IF NOT EXISTS copy_operation_audit (
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

-- Add indexes for performance
CREATE INDEX idx_copy_operation_audit_user_id ON copy_operation_audit(user_id);
CREATE INDEX idx_copy_operation_audit_created_at ON copy_operation_audit(created_at);
CREATE INDEX idx_copy_operation_audit_status ON copy_operation_audit(status);
CREATE INDEX idx_copy_operation_audit_source_type ON copy_operation_audit(source_type);

-- Add RLS policies
ALTER TABLE copy_operation_audit ENABLE ROW LEVEL SECURITY;

-- Users can view their own copy operations
CREATE POLICY "Users can view own copy operations" ON copy_operation_audit
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all copy operations
CREATE POLICY "Admins can view all copy operations" ON copy_operation_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Users can insert their own copy operations
CREATE POLICY "Users can insert own copy operations" ON copy_operation_audit
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can insert copy operations for any user
CREATE POLICY "Admins can insert copy operations" ON copy_operation_audit
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );
-- Add RLS policy to allow admins to update companies
-- This allows service role (admin client) to update company data

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow service role to update companies" ON companies;

-- Create policy to allow service role to update companies
CREATE POLICY "Allow service role to update companies"
ON companies
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Also allow authenticated users with admin role to update
DROP POLICY IF EXISTS "Allow admins to update companies" ON companies;

CREATE POLICY "Allow admins to update companies"
ON companies
FOR UPDATE
TO authenticated
USING (
    auth.jwt() ->> 'role' IN ('admin', 'master_admin')
)
WITH CHECK (
    auth.jwt() ->> 'role' IN ('admin', 'master_admin')
);

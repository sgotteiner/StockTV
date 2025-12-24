import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Singleton instances
let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null
let adminClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Client for browser (with RLS)
export function createClient() {
  if (clientInstance) return clientInstance

  clientInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return clientInstance
}

// Admin client (bypasses RLS) - use for development
export function createAdminClient() {
  if (adminClientInstance) return adminClientInstance

  // Use environment variable for service role key (more secure)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

  adminClientInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  )

  return adminClientInstance
}

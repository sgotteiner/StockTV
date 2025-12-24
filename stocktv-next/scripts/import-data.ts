// Simple data import script - using service role to bypass RLS
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Use service role key to bypass Row Level Security
const supabase = createClient(
    'http://localhost:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
)

async function main() {
    console.log('🚀 Importing data...\n')

    // Read companies
    const companiesData = JSON.parse(fs.readFileSync('../backend/data/companies.json', 'utf-8'))
    const videosData = JSON.parse(fs.readFileSync('../backend/data/videos.json', 'utf-8'))

    // Map to store old ID -> new UUID
    const companyMap = new Map()

    // Import companies
    console.log('📦 Companies:')
    for (const c of companiesData.companies) {
        const { data, error } = await supabase
            .from('companies')
            .insert({ name: c.name, website: c.website || null })
            .select()
            .single()

        if (data) {
            companyMap.set(c.id, data.id)
            console.log(`  ✅ ${c.name}`)
        } else {
            console.log(`  ❌ ${c.name}: ${error?.message}`)
        }
    }

    // Import videos
    console.log('\n📹 Videos:')
    let count = 0
    for (const v of videosData) {
        const companyId = companyMap.get(v.company_id)
        if (!companyId) {
            console.log(`  ⚠️  Skipped: ${v.title || v.filename} (no company)`)
            continue
        }

        const { error } = await supabase.from('videos').insert({
            title: v.title || v.filename || 'Untitled',
            company_id: companyId,
            file_path: v.file_path || `/videos/${v.filename}`,
            duration: v.duration || null
        })

        if (!error) {
            count++
            console.log(`  ✅ ${v.title || v.filename}`)
        } else {
            console.log(`  ❌ Error: ${error.message}`)
        }
    }

    console.log(`\n🎉 Done! Imported ${companyMap.size} companies and ${count} videos`)
}

main()

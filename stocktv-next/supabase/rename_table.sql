-- Rename user_company_follows to user_company_interactions
-- Run this in your Supabase SQL Editor

-- Step 1: Rename the table
ALTER TABLE user_company_follows 
RENAME TO user_company_interactions;

-- Step 2: Rename the indexes
ALTER INDEX idx_company_follows_user_id 
RENAME TO idx_company_interactions_user_id;

ALTER INDEX idx_company_follows_company_id 
RENAME TO idx_company_interactions_company_id;

-- Done! The table is now user_company_interactions

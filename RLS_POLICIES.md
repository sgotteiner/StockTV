# Current RLS Policies - StockTV Database

## Overview
Row Level Security (RLS) is enabled on all tables with policies that control access based on user roles.

---

## 📋 Companies Table

**RLS Status:** ✅ Enabled

### Policies:

1. **`Companies are viewable by everyone`** (SELECT)
   - **Who:** Everyone (anonymous + authenticated)
   - **What:** Can view all companies
   - **Rule:** `true` (no restrictions)

2. **`Company users can update own company`** (UPDATE)
   - **Who:** Users with role = 'company'
   - **What:** Can update their own company data (website, etc.)
   - **Rule:** Company name matches user's name

3. **`Admins can update companies`** (UPDATE)
   - **Who:** Users with role = 'admin' or 'master_admin'
   - **What:** Can update any company
   - **Rule:** User has admin role

4. **`Service role can manage companies`** (ALL)
   - **Who:** Service role (backend)
   - **What:** Full access (SELECT, INSERT, UPDATE, DELETE)
   - **Rule:** `true` (no restrictions)

---

## 🎥 Videos Table

**RLS Status:** ✅ Enabled

### Policies:

1. **`Videos are viewable by everyone`** (SELECT)
   - **Who:** Everyone (anonymous + authenticated)
   - **What:** Can view all videos
   - **Rule:** `true` (no restrictions)

2. **`Company users can upload own videos`** (INSERT)
   - **Who:** Users with role = 'company'
   - **What:** Can upload videos for their company only
   - **Rule:** Video's company_id matches user's company

3. **`Admins can upload any videos`** (INSERT)
   - **Who:** Users with role = 'admin' or 'master_admin'
   - **What:** Can upload videos for any company
   - **Rule:** User has admin role

4. **`Service role can manage videos`** (ALL)
   - **Who:** Service role (backend)
   - **What:** Full access (SELECT, INSERT, UPDATE, DELETE)
   - **Rule:** `true` (no restrictions)

---

## 👤 User Video Interactions Table

**RLS Status:** ✅ Enabled

### Policies:

1. **`Users can view own interactions`** (SELECT)
   - **Who:** Authenticated users
   - **What:** Can view their own likes, saves, views
   - **Rule:** `user_id = auth.uid()`

2. **`Users can manage own interactions`** (ALL)
   - **Who:** Authenticated users
   - **What:** Can create/update/delete their own interactions
   - **Rule:** `user_id = auth.uid()`

3. **`Service role can manage video interactions`** (ALL)
   - **Who:** Service role (backend)
   - **What:** Full access to all interactions
   - **Rule:** `true` (no restrictions)

---

## 🏢 User Company Interactions Table

**RLS Status:** ✅ Enabled

### Policies:

1. **`Users can view own company interactions`** (SELECT)
   - **Who:** Authenticated users
   - **What:** Can view which companies they follow
   - **Rule:** `user_id = auth.uid()`

2. **`Users can manage own company interactions`** (ALL)
   - **Who:** Authenticated users
   - **What:** Can follow/unfollow companies
   - **Rule:** `user_id = auth.uid()`

3. **`Service role can manage company interactions`** (ALL)
   - **Who:** Service role (backend)
   - **What:** Full access to all interactions
   - **Rule:** `true` (no restrictions)

---

## 📊 Public Functions (No RLS)

These functions are available to **everyone** and return aggregate data only:

### Video Metrics:
- `get_video_view_count(video_id)` - Returns total view count
- `get_video_like_count(video_id)` - Returns total like count
- `get_video_save_count(video_id)` - Returns total save count

### Company Metrics:
- `get_company_follower_count(company_id)` - Returns total follower count

**Security:** These functions use `SECURITY DEFINER` to access interaction data, but only return aggregate counts - individual user data remains private.

---

## 🔒 Security Model Summary

### Role Hierarchy:
1. **Service Role** (Backend) - Full access to everything
2. **Master Admin** - Can manage companies and upload videos
3. **Admin** - Can manage companies and upload videos
4. **Company** - Can update own company and upload own videos
5. **User** - Can view everything, manage own interactions
6. **Anonymous** - Can view companies and videos (read-only)

### Data Privacy:
- ✅ **Public:** Companies, videos, aggregate metrics (views, likes, followers)
- 🔒 **Private:** Individual user interactions (who liked/saved/followed what)
- 🔐 **Restricted:** Company data editing (only own company or admins)

---

## 📝 Notes

- All policies allow **service role** full access for backend operations
- **Company users** are matched by name (company name = user name)
- **Aggregate functions** provide public metrics without exposing individual users
- RLS is properly configured for **production security**

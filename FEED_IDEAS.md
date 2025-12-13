# Smart Feed - Core Ideas

## The Problem
Users see the same videos repeatedly. Feed needs to be smart and performant.

## The Solution

### 1. Track What Users Watch
Create `user_video_interactions.json` - one record per user-video pair.

**Consolidates**:
- Views (has user watched this?)
- Likes (has user liked this?)
- Engagement (how much did they watch?)

**Why one table?**
- Single source of truth
- One query gets all user-video data
- Update view and like together

### 2. Organize Videos by Company
Create `companies.json` and add `company_id` to videos.

**Why?**
- Videos belong to companies
- Future: users can follow companies
- Feed can prioritize followed companies

### 3. Smart Feed Algorithm
```
Show videos user HASN'T watched yet
Sort by newest first
(Future: prioritize followed companies)
```

### 4. Handle Long Feeds
**Pagination**: Load 20 videos at a time, not all
**Infinite scroll**: Load more as user scrolls
**Lazy loading**: Don't load video files until visible

## Data Structure

```
users.json                   - existing
companies.json               - NEW (id, name)
videos.json                  - ADD company_id
user_video_interactions.json - NEW (replaces likes.json)
user_company_interactions.json - NEW (empty, for future)
```

## Key Insight
One `user_video_interactions` table tracks EVERYTHING about user-video relationship:
- Viewed? When? How long?
- Liked? When?

This is simpler and more efficient than separate tables.

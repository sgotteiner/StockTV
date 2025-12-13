# Tables Design - Quick Reference

## 5 Tables (JSON files)

### 1. users.json
```json
{
  "users": [{
    "id": "user_001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user|company|admin|master_admin",
    "company_id": "comp_001",  // only for company role
    "created_at": "2025-12-12T10:00:00Z"
  }]
}
```

### 2. companies.json (NEW)
```json
{
  "companies": [{
    "id": "comp_001",
    "name": "TechCorp",
    "created_at": "2025-12-12T10:00:00Z"
  }]
}
```

### 3. videos.json
```json
{
  "videos": [{
    "id": "vid_001",
    "title": "Market Update",
    "company_id": "comp_001",  // ADD THIS
    "file_path": "/videos/vid_001.mp4",
    "thumbnail_path": "/thumbnails/vid_001.jpg",
    "duration": 45,
    "uploaded_by": "user_002",
    "created_at": "2025-12-12T12:00:00Z"
  }]
}
```

### 4. user_video_interactions.json (REPLACES likes.json)
```json
{
  "interactions": [{
    "id": "int_001",
    "user_id": "user_001",
    "video_id": "vid_001",
    "viewed_at": "2025-12-12T14:00:00Z",
    "watch_percentage": 0,
    "liked": false,
    "saved": false,
    "shared_with": []
  }]
}
```
**Key**: One record per user-video pair. Created automatically when user views a video.
- `viewed_at`: First view timestamp (interaction creation time)
- `watch_percentage`: 0-100, tracks video watch progress (future feature)
- `liked`: Boolean, whether user liked the video
- `saved`: Boolean, save for later (future feature)
- `shared_with`: Array of user IDs this video was shared with (future feature)

### 5. user_company_interactions.json (Future - create empty)
```json
{
  "interactions": []
}
```

---

## Key Changes from Current

1. **Add** `companies.json`
2. **Add** `company_id` to videos
3. **Replace** `likes.json` with `user_video_interactions.json` (tracks views + likes)
4. **Add** pagination to feed API

---

---

## Feed Algorithm (✅ IMPLEMENTED)

**Location:** `backend/services/feedService.js`

```javascript
function getPersonalizedFeed(userId) {
  // 1. Get unwatched videos (sorted by created_at DESC - newest first)
  const unwatchedVideos = videos
    .filter(v => !hasInteraction(userId, v.id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // 2. Get watched videos (sorted by viewed_at ASC - oldest first, encourages scrolling)
  const watchedVideos = videos
    .filter(v => hasInteraction(userId, v.id))
    .sort((a, b) => new Date(a.viewed_at) - new Date(b.viewed_at));
  
  // 3. Combine: unwatched first, then watched
  return [...unwatchedVideos, ...watchedVideos];
}
```

**Features:**
- ✅ Personalized per user
- ✅ Unwatched videos prioritized
- ✅ Watched videos appear after unwatched (oldest first - encourages scrolling to discover more)
- ✅ Auto-updates when user logs in/out
- ✅ Pagination with infinite scroll (configurable via constants.js)
- ✅ Centralized configuration (change page size in one place)


---

## PostgreSQL Migration (Future)

```sql
CREATE TABLE user_video_interactions (
  user_id VARCHAR(50),
  video_id VARCHAR(50),
  viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP,
  watch_percentage INTEGER,
  liked BOOLEAN DEFAULT false,
  liked_at TIMESTAMP,
  PRIMARY KEY (user_id, video_id)
);
```

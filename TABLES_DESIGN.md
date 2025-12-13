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

## Feed Algorithm (Simple)

```javascript
function getFeed(userId, page = 1, limit = 20) {
  // 1. Get unwatched videos
  const watchedIds = interactions
    .filter(i => i.user_id === userId && i.viewed)
    .map(i => i.video_id);
  
  const unwatched = videos.filter(v => !watchedIds.includes(v.id));
  
  // 2. Sort newest first
  unwatched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // 3. Paginate
  const start = (page - 1) * limit;
  return unwatched.slice(start, start + limit);
}
```

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

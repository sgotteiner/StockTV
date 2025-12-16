# Lesson 10: React vs Next.js

Understanding the differences and why Next.js is better for your project.

---

## 1. What is Next.js?

**Next.js = React + Extra Features**

```
React (CRA)              Next.js
├── Components           ├── Components (same)
├── Hooks                ├── Hooks (same)
├── Context              ├── Context (same)
└── Client-side only     ├── Server-side rendering
                         ├── API routes (backend)
                         ├── File-based routing
                         ├── Built-in security
                         ├── Image optimization
                         └── Much more...
```

**Key Point:** Everything you learned about React applies to Next.js!

---

## 2. Routing

### **React (with React Router):**
```javascript
// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FeedScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/video/:id" element={<VideoDetail />} />
            </Routes>
        </BrowserRouter>
    );
}
```

### **Next.js (File-based):**
```
app/
├── page.tsx              → /
├── profile/
│   └── page.tsx          → /profile
└── video/
    └── [id]/
        └── page.tsx      → /video/:id
```

```javascript
// app/page.tsx (automatically becomes /)
export default function FeedScreen() {
    return <div>Feed</div>;
}

// app/profile/page.tsx (automatically becomes /profile)
export default function ProfileScreen() {
    return <div>Profile</div>;
}

// app/video/[id]/page.tsx (automatically becomes /video/:id)
export default function VideoDetail({ params }) {
    return <div>Video {params.id}</div>;
}
```

**Advantage:** No routing configuration needed!

---

## 3. API Routes (Backend)

### **React + Express (Separate):**
```javascript
// backend/routes/interactions.js
router.post('/videos/:videoId/like', async (req, res) => {
    const result = await likeVideo(req.params.videoId, req.body.userId);
    res.json(result);
});

// frontend/src/services/interactionsApi.js
export const likeVideo = async (videoId, userId) => {
    const response = await fetch(`http://localhost:5000/api/interactions/videos/${videoId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
    return response.json();
};
```

### **Next.js (Integrated):**
```javascript
// app/api/videos/[videoId]/like/route.ts
export async function POST(request, { params }) {
    const { userId } = await request.json();
    const result = await likeVideo(params.videoId, userId);
    return Response.json(result);
}

// Frontend (same file or different component)
const likeVideo = async (videoId, userId) => {
    const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });
    return response.json();
};
```

**Advantages:**
- ✅ One codebase (no separate backend)
- ✅ Automatic API routes
- ✅ Built-in security (CSRF protection)
- ✅ Same deployment

---

## 4. Security

### **React (CRA):**
```javascript
// ❌ No built-in XSS protection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ❌ No CSRF protection
fetch('/api/like', { method: 'POST' });

// ❌ No security headers
// You must configure manually

// ❌ No HTTPS enforcement
// You must configure manually
```

### **Next.js:**
```javascript
// ✅ XSS protection built-in
<div>{userInput}</div>  // Automatically escaped

// ✅ CSRF protection built-in
// Automatic token handling

// ✅ Security headers automatic
// Content-Security-Policy, X-Frame-Options, etc.

// ✅ HTTPS enforced (on Vercel)
// Automatic redirect to HTTPS
```

**This is why you chose Next.js!**

---

## 5. Data Fetching

### **React (Client-side only):**
```javascript
function VideoCard({ videoId }) {
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch(`/api/videos/${videoId}`)
            .then(res => res.json())
            .then(setVideo)
            .finally(() => setLoading(false));
    }, [videoId]);
    
    if (loading) return <div>Loading...</div>;
    return <div>{video.title}</div>;
}
```

### **Next.js (Server + Client):**

**Option 1: Server Component (default):**
```javascript
// Runs on server, no loading state needed!
async function VideoCard({ videoId }) {
    const video = await fetch(`/api/videos/${videoId}`).then(r => r.json());
    
    return <div>{video.title}</div>;
}
```

**Option 2: Client Component (when you need interactivity):**
```javascript
'use client';  // Mark as client component

function VideoCard({ videoId }) {
    const [video, setVideo] = useState(null);
    // Same as React
}
```

**Advantages:**
- ✅ Faster initial load (server-rendered)
- ✅ Better SEO (search engines see content)
- ✅ Choose server or client per component

---

## 6. Component Migration

### **Your React Component:**
```javascript
// frontend/src/components/VideoCard.js
import React, { useState } from 'react';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import './VideoCard.css';

export default function VideoCard({ video }) {
    const { videoRef, isPlaying, togglePlayPause } = useVideoPlayback();
    
    return (
        <div className="video-card" onClick={togglePlayPause}>
            <video ref={videoRef} src={video.file_path} />
            {!isPlaying && <div className="play-icon">▶</div>}
        </div>
    );
}
```

### **Next.js Version:**
```javascript
// app/components/VideoCard.tsx
'use client';  // Needs interactivity

import { useState } from 'react';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import './VideoCard.css';

export default function VideoCard({ video }) {
    const { videoRef, isPlaying, togglePlayPause } = useVideoPlayback();
    
    return (
        <div className="video-card" onClick={togglePlayPause}>
            <video ref={videoRef} src={video.file_path} />
            {!isPlaying && <div className="play-icon">▶</div>}
        </div>
    );
}
```

**Changes:**
1. Add `'use client'` if component uses hooks/state
2. Change `.js` to `.tsx` (TypeScript - optional but recommended)
3. Everything else is the same!

---

## 7. File Structure Comparison

### **React (CRA):**
```
frontend/src/
├── App.js
├── index.js
├── components/
│   └── VideoCard.js
├── screens/
│   ├── FeedScreen.js
│   └── ProfileScreen.js
├── hooks/
│   └── useVideoPlayback.js
└── services/
    └── api.js

backend/
├── app.js
├── routes/
└── controllers/
```

### **Next.js:**
```
app/
├── page.tsx                    # Home (Feed)
├── profile/
│   └── page.tsx                # Profile page
├── api/
│   └── videos/
│       └── [id]/
│           └── like/
│               └── route.ts    # API endpoint
├── components/
│   └── VideoCard.tsx
├── hooks/
│   └── useVideoPlayback.ts
└── lib/
    └── api.ts
```

**Changes:**
- ✅ `screens/` → `app/` (pages)
- ✅ Backend routes → `app/api/`
- ✅ One codebase instead of two

---

## 8. Environment Variables

### **React:**
```javascript
// .env
REACT_APP_API_URL=http://localhost:5000

// Usage
const apiUrl = process.env.REACT_APP_API_URL;
```

### **Next.js:**
```javascript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000  # Client-side
DATABASE_URL=postgresql://...               # Server-side only

// Usage
const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // Client
const dbUrl = process.env.DATABASE_URL;          // Server only
```

**Advantage:** Separate client/server env vars (more secure)

---

## 9. Deployment

### **React + Express:**
```
1. Build frontend: npm run build
2. Deploy frontend to: Netlify/Vercel/etc.
3. Deploy backend to: Heroku/Railway/etc.
4. Configure CORS
5. Set up environment variables (2 places)
6. Set up database connection
7. Set up file storage
```

### **Next.js:**
```
1. Push to GitHub
2. Connect to Vercel
3. Deploy (automatic)
4. Done!
```

**Advantage:** One deployment, automatic HTTPS, global CDN

---

## 10. Migration Checklist

### **What Stays the Same:**
- ✅ All React concepts (components, hooks, state, effects)
- ✅ Your custom hooks (useVideoPlayback, useSwipe, etc.)
- ✅ Your components (VideoCard, etc.)
- ✅ Your CSS files
- ✅ Your logic

### **What Changes:**
- 🔄 File structure (screens → app/)
- 🔄 Routing (React Router → file-based)
- 🔄 API calls (Express → Next.js API routes)
- 🔄 Add `'use client'` to interactive components
- 🔄 Environment variables (REACT_APP_ → NEXT_PUBLIC_)

### **What You Gain:**
- ✅ Built-in security (XSS, CSRF, headers)
- ✅ Server-side rendering (faster, better SEO)
- ✅ API routes (no separate backend)
- ✅ File-based routing (simpler)
- ✅ Image optimization (automatic)
- ✅ TypeScript support (better)
- ✅ Easier deployment (one codebase)

---

## 11. Side-by-Side Example

### **React Version:**
```javascript
// frontend/src/screens/FeedScreen.js
import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import * as api from '../services/api';

export default function FeedScreen() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        api.getVideos()
            .then(setVideos)
            .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div className="feed">
            {videos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
```

### **Next.js Version:**
```javascript
// app/page.tsx
import VideoCard from './components/VideoCard';

// Server Component (runs on server)
export default async function FeedScreen() {
    const videos = await fetch('http://localhost:3000/api/videos')
        .then(r => r.json());
    
    return (
        <div className="feed">
            {videos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}

// API Route
// app/api/videos/route.ts
export async function GET() {
    const videos = await getVideos();  // Your existing function
    return Response.json(videos);
}
```

**Differences:**
1. No useState/useEffect needed (server component)
2. No loading state needed (server-rendered)
3. API route in same codebase
4. Faster initial load

---

## 12. When to Use Client vs Server Components

### **Use Server Components (default):**
- ✅ Fetching data
- ✅ Accessing backend resources
- ✅ Keeping sensitive info on server
- ✅ Large dependencies (keep on server)

### **Use Client Components ('use client'):**
- ✅ Interactive components (onClick, onChange)
- ✅ Using hooks (useState, useEffect, etc.)
- ✅ Using browser APIs (localStorage, etc.)
- ✅ Event listeners

**Your components:**
- `VideoCard` → Client (uses hooks, interactive)
- `FeedScreen` → Could be Server (just renders list)
- `ProfileScreen` → Client (uses state)

---

## 🎯 Key Takeaways

1. **Next.js = React + Extra Features**
2. **Everything you learned applies** to Next.js
3. **Main changes:** File structure, routing, API routes
4. **Main benefits:** Security, performance, simpler deployment
5. **Migration is straightforward** - mostly moving files
6. **Your hooks and components** work the same
7. **TypeScript is easier** in Next.js (but optional)

---

## 📝 Migration Strategy

### **Phase 1: Setup**
1. Create Next.js project
2. Copy `components/` folder
3. Copy `hooks/` folder
4. Copy `styles/` folder

### **Phase 2: Pages**
1. Convert `FeedScreen` → `app/page.tsx`
2. Convert `ProfileScreen` → `app/profile/page.tsx`
3. Add `'use client'` where needed

### **Phase 3: API**
1. Convert Express routes → Next.js API routes
2. Update API calls (remove localhost:5000)
3. Test all endpoints

### **Phase 4: Features**
1. Wire up feature flags
2. Test all features
3. Deploy!

---

## 🚀 Ready to Migrate?

You now understand:
- ✅ React fundamentals
- ✅ How your app works
- ✅ What Next.js changes
- ✅ Why Next.js is better
- ✅ How to migrate

**Next step:** Start the migration! 🎉

---

**Course Complete!** 🎓

You've learned:
1. JavaScript basics
2. Async JavaScript
3. HTML & CSS
4. React fundamentals
5. React hooks
6. Custom hooks
7. Context & state
8. React architecture
9. Best practices
10. Next.js comparison

**You're ready to migrate to Next.js with confidence!**

# Lesson 2: Async JavaScript

Learn how JavaScript handles asynchronous operations using your StockTV API calls as examples.

---

## 1. The Problem: Blocking vs Non-Blocking

### **Blocking (Bad for servers):**
```javascript
// This would freeze your server!
const data = readFileSync('huge-file.txt');  // Wait... wait... wait...
console.log('This runs AFTER file is read');
```

### **Non-Blocking (Good!):**
```javascript
// Server keeps running while file is read
readFile('huge-file.txt', (data) => {
    console.log('File read!');
});
console.log('This runs IMMEDIATELY');
```

**Why it matters:** Your Express server handles multiple users. If one user's request blocks, everyone waits!

---

## 2. Callbacks (Old Way)

```javascript
// Callback function
function getVideos(callback) {
    readFile('videos.json', (error, data) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}

// Using the callback
getVideos((error, videos) => {
    if (error) {
        console.error(error);
    } else {
        console.log(videos);
    }
});
```

**Problem:** "Callback Hell" (nested callbacks)
```javascript
getUser((user) => {
    getVideos(user.id, (videos) => {
        getLikes(videos[0].id, (likes) => {
            // Too many levels!
        });
    });
});
```

---

## 3. Promises (Better Way)

### **What is a Promise?**
A Promise represents a value that will be available in the future.

```javascript
// Creating a Promise
const promise = new Promise((resolve, reject) => {
    // Do async work
    if (success) {
        resolve(result);  // Success!
    } else {
        reject(error);    // Failed!
    }
});

// Using a Promise
promise
    .then(result => console.log(result))   // If resolved
    .catch(error => console.error(error)); // If rejected
```

### **Promise States:**
```
Pending  → Doing async work
Fulfilled → Success (resolved)
Rejected  → Failed (rejected)
```

**In your code:** `frontend/src/services/api.js`
```javascript
export const getVideos = () => {
    return fetch(`${API_URL}/videos`)  // Returns a Promise
        .then(response => response.json())  // Chain promises
        .then(data => data.videos)
        .catch(error => {
            console.error('Error fetching videos:', error);
            throw error;
        });
};
```

---

## 4. Async/Await (Modern Way)

### **Syntax:**
```javascript
// Mark function as async
async function getVideos() {
    // Wait for promise to resolve
    const response = await fetch('/videos');
    const data = await response.json();
    return data.videos;
}
```

### **Same as Promise chain:**
```javascript
// With Promises
function getVideos() {
    return fetch('/videos')
        .then(response => response.json())
        .then(data => data.videos);
}

// With async/await (cleaner!)
async function getVideos() {
    const response = await fetch('/videos');
    const data = await response.json();
    return data.videos;
}
```

**In your code:** `backend/controllers/videoController.js`
```javascript
export const fetchVideos = async (req, res) => {
    try {
        // await pauses here until getVideos() completes
        const videos = await getVideos();
        res.json({ videos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

---

## 5. Error Handling

### **With Promises (.catch):**
```javascript
fetch('/videos')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

### **With async/await (try/catch):**
```javascript
async function getVideos() {
    try {
        const response = await fetch('/videos');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Re-throw if needed
    }
}
```

**In your code:** `frontend/src/services/interactionsApi.js`
```javascript
export const likeVideo = async (videoId, userId) => {
    try {
        const response = await fetch(`${API_URL}/interactions/videos/${videoId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        
        if (!response.ok) {
            throw new Error('Failed to like video');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error liking video:', error);
        throw error;
    }
};
```

---

## 6. Promise.all (Parallel Execution)

### **Run multiple promises at once:**

```javascript
// Sequential (slow - waits for each)
const user = await getUser();
const videos = await getVideos();
const likes = await getLikes();
// Total time: 3 seconds (1s + 1s + 1s)

// Parallel (fast - all at once)
const [user, videos, likes] = await Promise.all([
    getUser(),
    getVideos(),
    getLikes()
]);
// Total time: 1 second (all run together)
```

**When to use:**
- ✅ When operations are independent
- ❌ When one depends on another

**Example:**
```javascript
// Good: Independent operations
const [companies, videos, users] = await Promise.all([
    getCompanies(),
    getVideos(),
    getUsers()
]);

// Bad: videos needs userId
const user = await getUser();
const videos = await getUserVideos(user.id);  // Depends on user
```

---

## 7. Common Async Patterns in Your Code

### **Pattern 1: Fetch Data**
```javascript
// frontend/src/hooks/useVideoInteractions.js
useEffect(() => {
    const fetchLikeData = async () => {
        try {
            // Get user's liked videos
            const userLikes = await interactionsApi.getUserLikedVideos(currentUser.id);
            const userLikedVideoIds = userLikes.likedVideos.map(item => item.videoId);
            setIsLiked(userLikedVideoIds.includes(video.id));
            
            // Get video like count
            const likeData = await interactionsApi.getVideoLikes(video.id);
            setLikeCount(likeData.likeCount);
        } catch (error) {
            console.error('Error fetching like data:', error);
        }
    };
    fetchLikeData();
}, [video.id, currentUser]);
```

### **Pattern 2: Handle User Actions**
```javascript
// frontend/src/hooks/useVideoInteractions.js
const toggleLike = useCallback(async () => {
    if (!currentUser || isLoading) return { requiresLogin: !currentUser };
    
    setIsLoading(true);
    try {
        if (isLiked) {
            const result = await interactionsApi.unlikeVideo(video.id, currentUser.id);
            setLikeCount(result.likeCount);
            setIsLiked(false);
        } else {
            const result = await interactionsApi.likeVideo(video.id, currentUser.id);
            setLikeCount(result.likeCount);
            setIsLiked(true);
        }
        return { success: true };
    } catch (error) {
        console.error('Error toggling like:', error);
        return { success: false, error: error.message };
    } finally {
        setIsLoading(false);  // Always runs
    }
}, [video.id, currentUser, isLiked, isLoading]);
```

### **Pattern 3: Backend Route Handler**
```javascript
// backend/routes/interactions.js
router.post('/videos/:videoId/like', async (req, res) => {
    try {
        // await the controller function
        const result = await interactionController.likeVideo(
            req.params.videoId,
            req.body.userId
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

---

## 8. The Event Loop (How It Works)

```
┌─────────────────────────────┐
│   Call Stack                │  ← Currently executing
│   [function3]               │
│   [function2]               │
│   [function1]               │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Web APIs                  │  ← Browser/Node APIs
│   - setTimeout              │
│   - fetch                   │
│   - file operations         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Callback Queue            │  ← Waiting to execute
│   [callback1]               │
│   [callback2]               │
└──────────┬──────────────────┘
           │
           ▼
     Event Loop ←─────────────┘
     (Moves callbacks to call stack when empty)
```

**Example:**
```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

Promise.resolve().then(() => {
    console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
// Why?
// - 1, 4 are synchronous (run immediately)
// - Promise callbacks run before setTimeout (microtask queue)
// - setTimeout runs last (macrotask queue)
```

---

## 9. Common Mistakes

### **Mistake 1: Forgetting await**
```javascript
// Wrong - returns Promise, not data
const videos = getVideos();  // Promise { <pending> }

// Right - waits for data
const videos = await getVideos();  // Array of videos
```

### **Mistake 2: Not handling errors**
```javascript
// Wrong - errors crash the app
const data = await fetch('/api/videos');

// Right - handle errors
try {
    const data = await fetch('/api/videos');
} catch (error) {
    console.error('Failed to fetch:', error);
}
```

### **Mistake 3: Using await in non-async function**
```javascript
// Wrong - syntax error
function getVideos() {
    const data = await fetch('/videos');  // Error!
}

// Right - mark function as async
async function getVideos() {
    const data = await fetch('/videos');  // OK
}
```

---

## 10. Async/Await Best Practices

### **1. Always use try/catch**
```javascript
async function fetchData() {
    try {
        const data = await fetch('/api/data');
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Or handle gracefully
    }
}
```

### **2. Use Promise.all for parallel operations**
```javascript
// Slow (sequential)
const videos = await getVideos();
const companies = await getCompanies();

// Fast (parallel)
const [videos, companies] = await Promise.all([
    getVideos(),
    getCompanies()
]);
```

### **3. Use finally for cleanup**
```javascript
async function uploadVideo() {
    setLoading(true);
    try {
        await upload();
    } catch (error) {
        showError(error);
    } finally {
        setLoading(false);  // Always runs
    }
}
```

---

## 🎯 Key Takeaways

1. **async/await** makes async code look synchronous (easier to read)
2. **await** pauses execution until Promise resolves
3. **try/catch** handles errors in async functions
4. **Promise.all** runs multiple promises in parallel
5. **Always mark function as async** to use await
6. **JavaScript is single-threaded** but handles async via event loop

---

## 📝 Practice Exercise

Look at your `frontend/src/services/interactionsApi.js` and:
1. Find all async functions
2. Find all await statements
3. Find all try/catch blocks
4. Identify which operations could run in parallel

---

**Next:** [Lesson 3: HTML & CSS Basics](./03-html-css-basics.md) →

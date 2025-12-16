# Lesson 1: JavaScript Basics

Learn JavaScript fundamentals using your StockTV backend code as examples.

---

## 1. Variables

### **Three Ways to Declare Variables:**

```javascript
// const - Cannot be reassigned (use this most)
const PORT = 5000;  // From backend/app.js
const videoId = 'vid_001';

// let - Can be reassigned
let likeCount = 0;
likeCount = likeCount + 1;  // OK

// var - Old way (don't use)
var oldStyle = 'avoid this';
```

**In your code:** `backend/app.js`
```javascript
const app = express();  // Won't change
const PORT = 5000;      // Won't change
```

---

## 2. Data Types

### **Primitive Types:**

```javascript
// String (text)
const title = "Market Update";
const company = 'TechCorp';

// Number
const duration = 45;
const likeCount = 127;

// Boolean (true/false)
const isLiked = true;
const isPlaying = false;

// Null (intentionally empty)
const user = null;

// Undefined (not set yet)
let videoRef;  // undefined until assigned
```

**In your code:** `backend/storage/videoStorage.js`
```javascript
const video = {
    id: "vid_001",           // string
    title: "Market Update",  // string
    duration: 45,            // number
    uploaded_by: "user_002"  // string
};
```

---

## 3. Objects

### **Objects store related data:**

```javascript
// Object literal
const video = {
    id: 'vid_001',
    title: 'Market News',
    duration: 45
};

// Access properties
console.log(video.title);      // "Market News"
console.log(video['duration']); // 45

// Add/modify properties
video.views = 100;
video.title = 'Updated Title';
```

**In your code:** `backend/data/videos.json`
```json
{
  "id": "vid_001",
  "title": "Market Update",
  "company_id": "comp_001",
  "file_path": "/videos/vid_001.mp4",
  "duration": 45
}
```

---

## 4. Arrays

### **Arrays store lists:**

```javascript
// Array of strings
const companies = ['TechCorp', 'FinanceInc', 'MarketPro'];

// Array of objects
const videos = [
    { id: 'vid_001', title: 'Video 1' },
    { id: 'vid_002', title: 'Video 2' }
];

// Access by index (starts at 0)
console.log(companies[0]);  // 'TechCorp'
console.log(videos[1].title);  // 'Video 2'

// Array methods
companies.push('NewCorp');     // Add to end
companies.length;              // Get count
```

**In your code:** `backend/storage/videoStorage.js`
```javascript
const data = readJSON(dataPath, { videos: [] });
const videos = data.videos || [];  // Array of video objects
```

---

## 5. Functions

### **Regular Functions:**

```javascript
// Function declaration
function addLike(videoId, userId) {
    // Function body
    return { success: true };
}

// Call the function
const result = addLike('vid_001', 'user_001');
```

### **Arrow Functions (Modern):**

```javascript
// Arrow function (shorter syntax)
const addLike = (videoId, userId) => {
    return { success: true };
};

// Even shorter (implicit return)
const addLike = (videoId, userId) => ({ success: true });

// No parameters
const getVideos = () => {
    return videos;
};
```

**In your code:** `backend/controllers/videoController.js`
```javascript
// Arrow function
export const fetchVideos = async (req, res) => {
    try {
        const videos = await getVideos();
        res.json({ videos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

---

## 6. Imports/Exports (ES6 Modules)

### **Exporting:**

```javascript
// Named exports (can export multiple)
export const getVideos = () => { /* ... */ };
export const addVideo = () => { /* ... */ };

// Default export (one per file)
export default function VideoCard() { /* ... */ }
```

### **Importing:**

```javascript
// Import named exports
import { getVideos, addVideo } from './videoService.js';

// Import default export
import VideoCard from './VideoCard.js';

// Import everything
import * as videoService from './videoService.js';
videoService.getVideos();

// Import and rename
import { getVideos as fetchAllVideos } from './videoService.js';
```

**In your code:** `backend/app.js`
```javascript
// Importing
import express from 'express';
import { fetchVideos } from './controllers/videoController.js';
import interactionsRouter from './routes/interactions.js';

// Using imports
const app = express();
app.get('/videos', fetchVideos);
app.use('/api/interactions', interactionsRouter);
```

---

## 7. Template Literals (String Interpolation)

```javascript
// Old way (concatenation)
const message = 'Hello ' + userName + ', you have ' + likeCount + ' likes';

// New way (template literals)
const message = `Hello ${userName}, you have ${likeCount} likes`;

// Multi-line strings
const html = `
    <div>
        <h1>${title}</h1>
        <p>${description}</p>
    </div>
`;
```

**In your code:** `backend/utils/fileIO.js`
```javascript
const generateId = (prefix = 'id_') => {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
// Returns: "id_1702742400000_k3j2h1g9f"
```

---

## 8. Destructuring

### **Object Destructuring:**

```javascript
// Extract properties from object
const video = { id: 'vid_001', title: 'Market News', duration: 45 };

// Old way
const id = video.id;
const title = video.title;

// New way (destructuring)
const { id, title } = video;

// With renaming
const { id: videoId, title: videoTitle } = video;

// With default values
const { id, views = 0 } = video;  // views = 0 if not in object
```

**In your code:** `backend/controllers/interactionController.js`
```javascript
export const likeVideo = async (videoId, userId) => {
    // Destructuring the result
    const { likeCount, isLiked } = await toggleLike(videoId, userId);
    return { success: true, likeCount, isLiked };
};
```

### **Array Destructuring:**

```javascript
const colors = ['red', 'green', 'blue'];

// Extract first two
const [first, second] = colors;
// first = 'red', second = 'green'

// Skip elements
const [, , third] = colors;
// third = 'blue'
```

---

## 9. Spread Operator (...)

```javascript
// Copy array
const original = [1, 2, 3];
const copy = [...original];  // [1, 2, 3]

// Combine arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4]

// Copy object
const video = { id: 'vid_001', title: 'News' };
const videoCopy = { ...video };

// Merge objects
const updated = { ...video, views: 100 };
// { id: 'vid_001', title: 'News', views: 100 }
```

**In your code:** `backend/storage/interactionStorage.js`
```javascript
const newInteraction = {
    ...existingInteraction,  // Copy all properties
    liked: !existingInteraction.liked  // Override one property
};
```

---

## 10. How JavaScript Runs

### **Single-Threaded Event Loop:**

```
JavaScript runs ONE thing at a time (single-threaded)
But can handle async operations (non-blocking)

Call Stack:  [function3] ← Currently executing
             [function2]
             [function1]

Event Loop: Manages async operations
Web APIs: Handle setTimeout, fetch, etc.
Callback Queue: Waiting functions
```

### **Synchronous (Blocking):**
```javascript
console.log('1');
console.log('2');
console.log('3');
// Output: 1, 2, 3 (in order)
```

### **Asynchronous (Non-Blocking):**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// Output: 1, 3, 2 (setTimeout goes to queue)
```

**In your code:** This is why you use `async/await` for database operations - they don't block the server!

---

## 🎯 Key Takeaways

1. **const** for variables that don't change, **let** for variables that do
2. **Objects** `{}` store related data, **Arrays** `[]` store lists
3. **Arrow functions** `() => {}` are the modern way
4. **Destructuring** `{ id, title }` extracts properties easily
5. **Spread operator** `...` copies/merges objects and arrays
6. **Template literals** `` `Hello ${name}` `` for string interpolation
7. **JavaScript is single-threaded** but handles async operations

---

## 📝 Practice Exercise

Look at your `backend/storage/videoStorage.js` file and identify:
1. All variable declarations (const, let)
2. All functions (arrow vs regular)
3. All objects and arrays
4. All imports/exports
5. Any destructuring or spread operators

---

**Next:** [Lesson 2: Async JavaScript](./02-async-javascript.md) →

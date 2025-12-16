# Lesson 9: React Best Practices

Learn React best practices by examining your StockTV code.

---

## 1. Component Best Practices

### **Keep Components Small:**
```javascript
// ❌ Bad - too large (200+ lines)
function VideoCard() {
    // 50 lines of state
    // 100 lines of logic
    // 50 lines of JSX
}

// ✅ Good - focused (< 100 lines)
function VideoCard() {
    const playback = useVideoPlayback();
    const interactions = useVideoInteractions();
    
    return <VideoCardUI {...playback} {...interactions} />;
}
```

### **Descriptive Names:**
```javascript
// ❌ Bad
function VC() { }
const h = () => { };
const [x, setX] = useState(0);

// ✅ Good
function VideoCard() { }
const handleClick = () => { };
const [likeCount, setLikeCount] = useState(0);
```

### **Destructure Props:**
```javascript
// ❌ Less clear
function VideoCard(props) {
    return <div>{props.video.title}</div>;
}

// ✅ Clear
function VideoCard({ video, isFirst, onLike }) {
    return <div>{video.title}</div>;
}
```

---

## 2. State Management Best Practices

### **Initialize State Correctly:**
```javascript
// ❌ Bad - expensive calculation every render
const [videos, setVideos] = useState(expensiveCalculation());

// ✅ Good - lazy initialization
const [videos, setVideos] = useState(() => expensiveCalculation());
```

### **Functional Updates:**
```javascript
// ❌ Bad - stale closure
const increment = () => {
    setCount(count + 1);
    setCount(count + 1);  // Still adds 1, not 2!
};

// ✅ Good - always correct
const increment = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);  // Adds 2
};
```

### **Don't Mutate State:**
```javascript
// ❌ Bad - mutates array
const addVideo = (video) => {
    videos.push(video);
    setVideos(videos);  // React won't detect change!
};

// ✅ Good - creates new array
const addVideo = (video) => {
    setVideos([...videos, video]);
};

// ✅ Good - for objects
const updateVideo = (id, updates) => {
    setVideos(videos.map(v =>
        v.id === id ? { ...v, ...updates } : v
    ));
};
```

---

## 3. useEffect Best Practices

### **Complete Dependencies:**
```javascript
// ❌ Bad - missing dependency
useEffect(() => {
    fetchVideo(videoId);
}, []);  // videoId not in deps!

// ✅ Good - all dependencies
useEffect(() => {
    fetchVideo(videoId);
}, [videoId]);
```

### **Cleanup Side Effects:**
```javascript
// ❌ Bad - no cleanup
useEffect(() => {
    window.addEventListener('resize', handleResize);
}, []);

// ✅ Good - cleanup
useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

### **Avoid Infinite Loops:**
```javascript
// ❌ Bad - infinite loop
useEffect(() => {
    setCount(count + 1);  // Updates count
}, [count]);  // Triggers effect again!

// ✅ Good - conditional update
useEffect(() => {
    if (count < 10) {
        setCount(count + 1);
    }
}, [count]);
```

---

## 4. Performance Best Practices

### **Memoize Expensive Calculations:**
```javascript
// ❌ Bad - recalculates every render
function VideoFeed({ videos }) {
    const sortedVideos = videos.sort((a, b) => b.views - a.views);
    return <div>{/* render */}</div>;
}

// ✅ Good - only recalculates when videos change
function VideoFeed({ videos }) {
    const sortedVideos = useMemo(() => {
        return videos.sort((a, b) => b.views - a.views);
    }, [videos]);
    return <div>{/* render */}</div>;
}
```

### **Memoize Callbacks:**
```javascript
// ❌ Bad - new function every render
function VideoCard({ video }) {
    const handleLike = () => {
        likeVideo(video.id);
    };
    return <LikeButton onClick={handleLike} />;
}

// ✅ Good - same function unless video.id changes
function VideoCard({ video }) {
    const handleLike = useCallback(() => {
        likeVideo(video.id);
    }, [video.id]);
    return <LikeButton onClick={handleLike} />;
}
```

### **Use Keys in Lists:**
```javascript
// ❌ Bad - index as key (causes bugs)
{videos.map((video, index) => (
    <VideoCard key={index} video={video} />
))}

// ✅ Good - unique ID as key
{videos.map(video => (
    <VideoCard key={video.id} video={video} />
))}
```

---

## 5. Event Handling Best Practices

### **Prevent Default When Needed:**
```javascript
// Form submission
const handleSubmit = (e) => {
    e.preventDefault();  // Don't reload page
    // Handle form
};

// Link click
const handleClick = (e) => {
    e.preventDefault();  // Don't navigate
    // Custom logic
};
```

### **Stop Propagation When Needed:**
```javascript
// Nested clickable elements
<div onClick={handleVideoClick}>
    <button onClick={(e) => {
        e.stopPropagation();  // Don't trigger video click
        handleLikeClick();
    }}>
        Like
    </button>
</div>
```

**In your code:**
```javascript
// frontend/src/components/VideoCard.js
<div onClick={togglePlayPause}>
    <button
        onClick={(e) => {
            e.stopPropagation();  // Don't play/pause video
            handleLike();
        }}
    >
        Like
    </button>
</div>
```

---

## 6. Conditional Rendering Best Practices

### **Use && for Simple Conditions:**
```javascript
// ✅ Good - show if true
{isPlaying && <PauseIcon />}
{!isPlaying && <PlayIcon />}
```

### **Use Ternary for If/Else:**
```javascript
// ✅ Good - show one or the other
{isLiked ? <FilledHeart /> : <EmptyHeart />}
```

### **Use Variables for Complex Logic:**
```javascript
// ❌ Bad - complex JSX
{user && user.role === 'admin' && user.verified && (
    <AdminPanel />
)}

// ✅ Good - extract to variable
const canAccessAdmin = user?.role === 'admin' && user?.verified;

return (
    <div>
        {canAccessAdmin && <AdminPanel />}
    </div>
);
```

---

## 7. Error Handling Best Practices

### **Try/Catch for Async:**
```javascript
// ✅ Good pattern
const fetchData = async () => {
    try {
        const data = await api.getData();
        setData(data);
    } catch (error) {
        console.error('Error:', error);
        setError(error.message);
    } finally {
        setLoading(false);  // Always runs
    }
};
```

### **User-Friendly Error Messages:**
```javascript
// ❌ Bad - technical error
catch (error) {
    alert(error.message);  // "TypeError: Cannot read property..."
}

// ✅ Good - user-friendly
catch (error) {
    console.error('Technical error:', error);
    setMessage('Failed to load videos. Please try again.');
}
```

---

## 8. Accessibility Best Practices

### **Semantic HTML:**
```javascript
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

### **Alt Text for Images:**
```javascript
// ❌ Bad
<img src={video.thumbnail} />

// ✅ Good
<img src={video.thumbnail} alt={video.title} />
```

### **ARIA Labels:**
```javascript
// ✅ Good - for icon buttons
<button aria-label="Like video" onClick={handleLike}>
    ♥
</button>

<button aria-label="Mute video" onClick={toggleMute}>
    {isMuted ? '🔇' : '🔊'}
</button>
```

---

## 9. Code Organization Best Practices

### **File Structure:**
```javascript
// ✅ One component per file
// VideoCard.js
export default function VideoCard() { }

// ✅ Related components can be together
// VideoOptionsMenu.js
function VideoOptionsMenu() { }
function VideoOptionsItem() { }
export default VideoOptionsMenu;
```

### **Import Order:**
```javascript
// ✅ Good order
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal modules
import { useUser } from '../context/UserProvider';
import { useVideoPlayback } from '../hooks/useVideoPlayback';

// 3. Components
import VideoCard from './VideoCard';
import LikeButton from './LikeButton';

// 4. Styles
import './VideoFeed.css';
```

---

## 10. Common Mistakes to Avoid

### **1. Calling Hooks Conditionally:**
```javascript
// ❌ Wrong
if (condition) {
    const [state, setState] = useState(0);
}

// ✅ Right
const [state, setState] = useState(0);
if (condition) {
    // Use state here
}
```

### **2. Forgetting to Return Cleanup:**
```javascript
// ❌ Wrong
useEffect(() => {
    const timer = setInterval(() => { }, 1000);
    // Memory leak!
}, []);

// ✅ Right
useEffect(() => {
    const timer = setInterval(() => { }, 1000);
    return () => clearInterval(timer);
}, []);
```

### **3. Using Index as Key:**
```javascript
// ❌ Wrong - causes bugs when list changes
{items.map((item, index) => (
    <div key={index}>{item}</div>
))}

// ✅ Right - use unique ID
{items.map(item => (
    <div key={item.id}>{item}</div>
))}
```

### **4. Not Handling Loading/Error States:**
```javascript
// ❌ Wrong
function Component() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetchData().then(setData);
    }, []);
    
    return <div>{data.value}</div>;  // Crashes if data is null!
}

// ✅ Right
function Component() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchData()
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data</div>;
    
    return <div>{data.value}</div>;
}
```

---

## 11. Your Code's Best Practices

### **✅ What You Did Well:**

1. **Custom Hooks** - Extracted reusable logic
2. **Separation of Concerns** - Components, hooks, services
3. **useCallback** - Memoized functions in hooks
4. **Cleanup Functions** - In useEffect
5. **Error Handling** - Try/catch in async functions
6. **Event Propagation** - stopPropagation() where needed

### **🔄 Could Improve:**

1. **Loading States** - More consistent across components
2. **Error Boundaries** - Add for better error handling
3. **Accessibility** - Add more ARIA labels
4. **TypeScript** - Add type safety
5. **Testing** - Add unit tests

---

## 🎯 Key Takeaways

1. **Keep components small** and focused
2. **Use functional updates** for state
3. **Include all dependencies** in useEffect
4. **Cleanup side effects** in useEffect
5. **Memoize** expensive calculations and callbacks
6. **Use unique keys** in lists
7. **Handle loading/error states**
8. **Stop propagation** when needed
9. **Use semantic HTML** for accessibility
10. **Extract reusable logic** to custom hooks

---

## 📝 Practice Exercise

Review your code and:
1. Find examples of each best practice
2. Identify areas to improve
3. Refactor one component using these practices

---

**Next:** [Lesson 10: Next.js Comparison](./10-nextjs-comparison.md) →

# Lesson 5: React Hooks Deep Dive

Advanced hooks concepts using your StockTV custom hooks.

---

## 1. Hook Rules

### **Two Rules (MUST Follow):**

**Rule 1: Only call hooks at the top level**
```javascript
// ❌ Wrong - inside condition
function Component() {
    if (condition) {
        const [state, setState] = useState(0);  // Error!
    }
}

// ✅ Right - at top level
function Component() {
    const [state, setState] = useState(0);
    
    if (condition) {
        // Use state here
    }
}
```

**Rule 2: Only call hooks in React functions**
```javascript
// ❌ Wrong - regular function
function helper() {
    const [state, setState] = useState(0);  // Error!
}

// ✅ Right - React component
function Component() {
    const [state, setState] = useState(0);  // OK
}

// ✅ Right - custom hook
function useCustomHook() {
    const [state, setState] = useState(0);  // OK
}
```

---

## 2. useCallback

### **What is useCallback?**
Memoize functions to prevent unnecessary re-creations.

```javascript
import { useCallback } from 'react';

function VideoCard({ video, currentUser }) {
    // Without useCallback - new function every render
    const toggleLike = () => {
        likeVideo(video.id, currentUser.id);
    };
    
    // With useCallback - same function unless dependencies change
    const toggleLike = useCallback(() => {
        likeVideo(video.id, currentUser.id);
    }, [video.id, currentUser.id]);  // Only recreate if these change
}
```

### **When to use:**
- ✅ Passing functions to child components
- ✅ Functions used in useEffect dependencies
- ❌ Simple event handlers (overkill)

**In your code:** `frontend/src/hooks/useVideoInteractions.js`
```javascript
const recordView = useCallback(async (isPlaying) => {
    if (isPlaying && currentUser && !viewRecorded) {
        try {
            await interactionsApi.recordVideoView(video.id, currentUser.id);
            setViewRecorded(true);
        } catch (error) {
            console.error('Error recording view:', error);
        }
    }
}, [video.id, currentUser, viewRecorded]);
// Only recreate if video.id, currentUser, or viewRecorded changes
```

---

## 3. useMemo

### **What is useMemo?**
Memoize expensive calculations.

```javascript
import { useMemo } from 'react';

function VideoFeed({ videos }) {
    // Without useMemo - recalculates every render
    const sortedVideos = videos.sort((a, b) => b.views - a.views);
    
    // With useMemo - only recalculates when videos changes
    const sortedVideos = useMemo(() => {
        return videos.sort((a, b) => b.views - a.views);
    }, [videos]);
}
```

### **When to use:**
- ✅ Expensive calculations
- ✅ Filtering/sorting large arrays
- ❌ Simple operations (overkill)

---

## 4. useContext

### **What is useContext?**
Access context values without prop drilling.

```javascript
import { createContext, useContext } from 'react';

// Create context
const UserContext = createContext(null);

// Provider (top level)
function App() {
    const [user, setUser] = useState(null);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <FeedScreen />
        </UserContext.Provider>
    );
}

// Consumer (any level deep)
function VideoCard() {
    const { user, setUser } = useContext(UserContext);
    return <div>User: {user?.name}</div>;
}
```

**In your code:** `frontend/src/context/UserProvider.js`
```javascript
// Create context
const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    return (
        <UserContext.Provider value={{
            currentUser,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to use context
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
```

**Usage:**
```javascript
// Any component can access user
function VideoCard() {
    const { currentUser, isAuthenticated } = useUser();
    
    return (
        <div>
            {isAuthenticated ? (
                <p>Welcome, {currentUser.name}</p>
            ) : (
                <p>Please login</p>
            )}
        </div>
    );
}
```

---

## 5. Custom Hooks

### **What are Custom Hooks?**
Reusable logic extracted into functions starting with "use".

```javascript
// Custom hook
function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);
    
    const increment = () => setCount(c => c + 1);
    const decrement = () => setCount(c => c - 1);
    const reset = () => setCount(initialValue);
    
    return { count, increment, decrement, reset };
}

// Usage
function Component() {
    const { count, increment, decrement, reset } = useCounter(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
```

**In your code:** `frontend/src/hooks/useVideoPlayback.js`
```javascript
export function useVideoPlayback(isFirst) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const togglePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };
    
    const play = () => {
        videoRef.current?.play();
        setIsPlaying(true);
    };
    
    const pause = () => {
        videoRef.current?.pause();
        setIsPlaying(false);
    };
    
    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video) {
            const progress = (video.currentTime / video.duration) * 100;
            setProgress(progress);
        }
    };
    
    return {
        videoRef,
        containerRef,
        isPlaying,
        progress,
        togglePlayPause,
        play,
        pause,
        handleTimeUpdate
    };
}
```

**Usage in VideoCard:**
```javascript
function VideoCard({ video, isFirst }) {
    const {
        videoRef,
        isPlaying,
        progress,
        togglePlayPause,
        handleTimeUpdate
    } = useVideoPlayback(isFirst);
    
    return (
        <div onClick={togglePlayPause}>
            <video
                ref={videoRef}
                src={video.file_path}
                onTimeUpdate={handleTimeUpdate}
            />
            <div className="progress" style={{ width: `${progress}%` }} />
        </div>
    );
}
```

---

## 6. Your Custom Hooks Explained

### **useSwipe** - Gesture detection
```javascript
// frontend/src/hooks/useSwipe.js
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold }) {
    const [touchStart, setTouchStart] = useState(null);
    
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };
    
    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;
        
        if (Math.abs(distance) > threshold) {
            if (distance > 0) {
                onSwipeLeft?.();
            } else {
                onSwipeRight?.();
            }
        }
        
        setTouchStart(null);
    };
    
    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd
    };
}
```

### **useVideoInteractions** - Likes and views
```javascript
// frontend/src/hooks/useVideoInteractions.js
export function useVideoInteractions(video, currentUser) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            const likes = await api.getVideoLikes(video.id);
            setLikeCount(likes.count);
            
            if (currentUser) {
                const userLikes = await api.getUserLikes(currentUser.id);
                setIsLiked(userLikes.includes(video.id));
            }
        };
        fetchData();
    }, [video.id, currentUser]);
    
    // Toggle like
    const toggleLike = useCallback(async () => {
        if (!currentUser) return { requiresLogin: true };
        
        setIsLoading(true);
        try {
            if (isLiked) {
                await api.unlikeVideo(video.id, currentUser.id);
                setLikeCount(c => c - 1);
                setIsLiked(false);
            } else {
                await api.likeVideo(video.id, currentUser.id);
                setLikeCount(c => c + 1);
                setIsLiked(true);
            }
            return { success: true };
        } catch (error) {
            return { success: false, error };
        } finally {
            setIsLoading(false);
        }
    }, [video.id, currentUser, isLiked]);
    
    return { likeCount, isLiked, isLoading, toggleLike };
}
```

---

## 7. Hook Dependencies

### **Understanding the Dependency Array:**

```javascript
// Run once on mount
useEffect(() => {
    console.log('Mounted');
}, []);

// Run when video changes
useEffect(() => {
    console.log('Video changed');
}, [video]);

// Run when video OR user changes
useEffect(() => {
    console.log('Video or user changed');
}, [video, user]);

// Run on every render (usually wrong!)
useEffect(() => {
    console.log('Every render');
});  // No dependency array
```

### **Common Mistakes:**

**Missing dependencies:**
```javascript
// ❌ Wrong - missing video.id dependency
useEffect(() => {
    fetchVideo(video.id);
}, []);  // Should include video.id

// ✅ Right
useEffect(() => {
    fetchVideo(video.id);
}, [video.id]);
```

**Object/Array dependencies:**
```javascript
// ❌ Wrong - new object every render
const config = { id: video.id };
useEffect(() => {
    fetch(config);
}, [config]);  // config is always "different"

// ✅ Right - use primitive values
useEffect(() => {
    fetch({ id: video.id });
}, [video.id]);  // Only re-run when id changes
```

---

## 8. Cleanup Functions

```javascript
useEffect(() => {
    // Setup
    const subscription = subscribeToVideo(video.id);
    
    // Cleanup (runs before next effect or unmount)
    return () => {
        subscription.unsubscribe();
    };
}, [video.id]);
```

### **When cleanup runs:**
1. Before the effect runs again (when dependencies change)
2. When component unmounts

**Example - Event listeners:**
```javascript
useEffect(() => {
    const handleResize = () => {
        console.log('Resized');
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup - remove listener
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

**In your code:** `frontend/src/hooks/useVideoPlayback.js`
```javascript
useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            play();
        } else {
            pause();
        }
    });
    
    observer.observe(video);
    
    // Cleanup - disconnect observer
    return () => {
        observer.disconnect();
    };
}, []);
```

---

## 🎯 Key Takeaways

1. **useCallback** memoizes functions (prevent re-creation)
2. **useMemo** memoizes values (expensive calculations)
3. **useContext** accesses context without prop drilling
4. **Custom hooks** extract reusable logic (must start with "use")
5. **Dependencies** determine when effects re-run
6. **Cleanup functions** run before next effect or unmount
7. **Hook rules**: Top level only, React functions only

---

## 📝 Practice Exercise

Look at your custom hooks in `frontend/src/hooks/`:
1. Identify all built-in hooks used (useState, useEffect, etc.)
2. Find all useCallback and understand why they're used
3. Find all cleanup functions in useEffect
4. Trace how hooks are used in components

---

**Next:** [Lesson 6: Custom Hooks](./06-custom-hooks.md) →

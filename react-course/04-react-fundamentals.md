# Lesson 4: React Fundamentals

Learn React core concepts using your StockTV components as examples.

---

## 1. What is React?

**React** is a JavaScript library for building user interfaces using **components**.

### **Key Concepts:**
- **Components** - Reusable UI pieces (like LEGO blocks)
- **JSX** - HTML-like syntax in JavaScript
- **State** - Data that changes over time
- **Props** - Data passed between components
- **Virtual DOM** - React's efficient rendering system

---

## 2. Components

### **What is a Component?**
A function that returns JSX (UI).

```javascript
// Simple component
function Welcome() {
    return <h1>Hello, World!</h1>;
}

// Component with logic
function VideoCard() {
    const title = "Market News";
    const isPlaying = true;
    
    return (
        <div>
            <h1>{title}</h1>
            {isPlaying && <p>Playing...</p>}
        </div>
    );
}
```

### **Functional vs Class Components:**

**Functional (Modern - what you use):**
```javascript
function VideoCard({ video }) {
    return <div>{video.title}</div>;
}
```

**Class (Old - avoid):**
```javascript
class VideoCard extends React.Component {
    render() {
        return <div>{this.props.video.title}</div>;
    }
}
```

**In your code:** `frontend/src/components/VideoCard.js`
```javascript
function VideoCard({ video, isFirst = false }) {
    // Component logic here
    
    return (
        <div className="video-card">
            {/* JSX here */}
        </div>
    );
}

export default VideoCard;
```

---

## 3. JSX (JavaScript XML)

### **What is JSX?**
HTML-like syntax that gets converted to JavaScript.

```javascript
// JSX (what you write)
const element = <h1>Hello, {name}!</h1>;

// JavaScript (what it becomes)
const element = React.createElement('h1', null, 'Hello, ', name, '!');
```

### **JSX Rules:**

**1. Must return single parent element:**
```javascript
// Wrong
function Component() {
    return (
        <h1>Title</h1>
        <p>Text</p>
    );
}

// Right - wrap in div
function Component() {
    return (
        <div>
            <h1>Title</h1>
            <p>Text</p>
        </div>
    );
}

// Right - use Fragment
function Component() {
    return (
        <>
            <h1>Title</h1>
            <p>Text</p>
        </>
    );
}
```

**2. Use `{}` for JavaScript expressions:**
```javascript
function VideoCard({ video }) {
    const duration = 45;
    
    return (
        <div>
            <h1>{video.title}</h1>
            <p>Duration: {duration} seconds</p>
            <p>Double: {duration * 2}</p>
            <p>Formatted: {`${duration}s`}</p>
        </div>
    );
}
```

**3. `className` instead of `class`:**
```javascript
// Wrong
<div class="video-card">

// Right
<div className="video-card">
```

**4. Self-closing tags need `/`:**
```javascript
<img src="image.jpg" />
<input type="text" />
<br />
```

**In your code:** `frontend/src/components/VideoCard.js`
```javascript
return (
    <div className={`video-card aspect-${aspectRatio}`}>
        <video
            ref={videoRef}
            src={video.file_path}
            playsInline
            muted={isMuted}
        />
        
        {!isPlaying && (
            <div className="play-icon-overlay">▶</div>
        )}
    </div>
);
```

---

## 4. Props (Properties)

### **What are Props?**
Data passed from parent to child component (like function parameters).

```javascript
// Parent component
function FeedScreen() {
    const video = { id: 'vid_001', title: 'Market News' };
    
    return <VideoCard video={video} isFirst={true} />;
}

// Child component
function VideoCard({ video, isFirst }) {
    return (
        <div>
            <h1>{video.title}</h1>
            {isFirst && <p>First video!</p>}
        </div>
    );
}
```

### **Props are Read-Only:**
```javascript
function VideoCard({ video }) {
    // Wrong - can't modify props
    video.title = "New Title";  // ❌
    
    // Right - props are immutable
    const newTitle = video.title.toUpperCase();  // ✅
}
```

### **Default Props:**
```javascript
function VideoCard({ video, isFirst = false, autoPlay = true }) {
    // isFirst defaults to false if not provided
    // autoPlay defaults to true if not provided
}
```

### **Destructuring Props:**
```javascript
// Without destructuring
function VideoCard(props) {
    return <h1>{props.video.title}</h1>;
}

// With destructuring (cleaner)
function VideoCard({ video, isFirst }) {
    return <h1>{video.title}</h1>;
}
```

**In your code:** `frontend/src/components/VideoCard.js`
```javascript
// Props passed from FeedScreen
function VideoCard({ video, isFirst = false }) {
    // video = { id, title, file_path, company_id, ... }
    // isFirst = true/false
    
    return (
        <div>
            <video src={video.file_path} />
            <h1>{video.title}</h1>
        </div>
    );
}
```

---

## 5. State (useState)

### **What is State?**
Data that changes over time and triggers re-renders.

```javascript
import { useState } from 'react';

function Counter() {
    // [currentValue, functionToUpdate] = useState(initialValue)
    const [count, setCount] = useState(0);
    
    const increment = () => {
        setCount(count + 1);  // Updates state, triggers re-render
    };
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+1</button>
        </div>
    );
}
```

### **Multiple State Variables:**
```javascript
function VideoCard() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    
    return (
        <div>
            <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
            <p>Muted: {isMuted ? 'Yes' : 'No'}</p>
            <p>Progress: {progress}%</p>
        </div>
    );
}
```

### **State Updates are Async:**
```javascript
const [count, setCount] = useState(0);

function increment() {
    setCount(count + 1);
    console.log(count);  // Still 0! (not updated yet)
    
    // Use functional update for correct value
    setCount(prevCount => prevCount + 1);
}
```

**In your code:** `frontend/src/hooks/useVideoPlayback.js`
```javascript
export function useVideoPlayback(isFirst) {
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
        setIsPlaying(true);  // Update state
    };
    
    return { isPlaying, progress, togglePlayPause, play };
}
```

---

## 6. Effects (useEffect)

### **What is useEffect?**
Run code when component mounts, updates, or unmounts (side effects).

```javascript
import { useEffect } from 'react';

function VideoCard({ video }) {
    useEffect(() => {
        console.log('Component mounted or video changed');
        
        // Cleanup function (runs before next effect or unmount)
        return () => {
            console.log('Cleanup');
        };
    }, [video]);  // Dependencies - re-run when video changes
}
```

### **Dependency Array:**

```javascript
// Run once on mount
useEffect(() => {
    console.log('Mounted');
}, []);  // Empty array

// Run on every render
useEffect(() => {
    console.log('Every render');
});  // No array

// Run when dependencies change
useEffect(() => {
    console.log('video or user changed');
}, [video, user]);  // Re-run when video or user changes
```

### **Common Use Cases:**

**1. Fetch data on mount:**
```javascript
useEffect(() => {
    const fetchVideos = async () => {
        const data = await api.getVideos();
        setVideos(data);
    };
    fetchVideos();
}, []);  // Run once
```

**2. Subscribe to events:**
```javascript
useEffect(() => {
    const handleResize = () => {
        console.log('Window resized');
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

**3. Sync with props:**
```javascript
useEffect(() => {
    if (isPlaying) {
        videoRef.current?.play();
    } else {
        videoRef.current?.pause();
    }
}, [isPlaying]);  // Run when isPlaying changes
```

**In your code:** `frontend/src/hooks/useVideoInteractions.js`
```javascript
useEffect(() => {
    const fetchLikeData = async () => {
        try {
            // Fetch user's liked videos
            const userLikes = await interactionsApi.getUserLikedVideos(currentUser.id);
            setIsLiked(userLikes.includes(video.id));
            
            // Fetch video like count
            const likeData = await interactionsApi.getVideoLikes(video.id);
            setLikeCount(likeData.likeCount);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    fetchLikeData();
}, [video.id, currentUser]);  // Re-fetch when video or user changes
```

---

## 7. Refs (useRef)

### **What is useRef?**
Access DOM elements directly or store mutable values that don't trigger re-renders.

```javascript
import { useRef } from 'react';

function VideoPlayer() {
    const videoRef = useRef(null);
    
    const play = () => {
        videoRef.current.play();  // Access video element
    };
    
    return (
        <div>
            <video ref={videoRef} src="video.mp4" />
            <button onClick={play}>Play</button>
        </div>
    );
}
```

### **Ref vs State:**

| useRef | useState |
|--------|----------|
| Doesn't trigger re-render | Triggers re-render |
| Mutable (.current) | Immutable |
| Access DOM elements | Store component data |
| Persist across renders | Persist across renders |

**In your code:** `frontend/src/hooks/useVideoPlayback.js`
```javascript
export function useVideoPlayback() {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    
    const play = () => {
        videoRef.current?.play();  // Access video DOM element
    };
    
    const pause = () => {
        videoRef.current?.pause();
    };
    
    return { videoRef, containerRef, play, pause };
}
```

---

## 8. Event Handling

```javascript
function VideoCard() {
    // Event handler function
    const handleClick = () => {
        console.log('Clicked!');
    };
    
    const handleClickWithParam = (videoId) => {
        console.log('Clicked video:', videoId);
    };
    
    return (
        <div>
            {/* Method 1: Reference function */}
            <button onClick={handleClick}>Click</button>
            
            {/* Method 2: Inline arrow function */}
            <button onClick={() => console.log('Clicked')}>Click</button>
            
            {/* Method 3: With parameters */}
            <button onClick={() => handleClickWithParam('vid_001')}>Click</button>
            
            {/* Method 4: Event object */}
            <button onClick={(e) => {
                e.stopPropagation();  // Stop event bubbling
                handleClick();
            }}>Click</button>
        </div>
    );
}
```

**In your code:** `frontend/src/components/VideoCard.js`
```javascript
<div
    className="video-container"
    onClick={togglePlayPause}  // Click to play/pause
>
    <video ref={videoRef} src={video.file_path} />
    
    <button
        className="like-button"
        onClick={(e) => {
            e.stopPropagation();  // Don't trigger video click
            handleLike();
        }}
    >
        {isLiked ? '♥' : '♡'}
    </button>
</div>
```

---

## 9. Conditional Rendering

```javascript
function VideoCard({ isPlaying, isLiked, likeCount }) {
    return (
        <div>
            {/* Method 1: && operator */}
            {!isPlaying && <div className="play-icon">▶</div>}
            
            {/* Method 2: Ternary operator */}
            <button>
                {isLiked ? '♥' : '♡'}
            </button>
            
            {/* Method 3: Variable */}
            {(() => {
                if (likeCount === 0) return <p>No likes</p>;
                if (likeCount === 1) return <p>1 like</p>;
                return <p>{likeCount} likes</p>;
            })()}
            
            {/* Method 4: Early return */}
            {isLoading && <div>Loading...</div>}
        </div>
    );
}
```

**In your code:** `frontend/src/components/VideoCard.js`
```javascript
return (
    <div className="video-card">
        {/* Show play icon when paused */}
        {!isPlaying && (
            <div className="play-icon-overlay">▶</div>
        )}
        
        {/* Show info view or video */}
        {showInfo ? (
            <VideoInfoView video={video} />
        ) : (
            <video src={video.file_path} />
        )}
        
        {/* Show options menu if open */}
        {showOptions && (
            <VideoOptionsMenu video={video} onClose={() => setShowOptions(false)} />
        )}
    </div>
);
```

---

## 10. Lists & Keys

```javascript
function VideoFeed({ videos }) {
    return (
        <div>
            {videos.map((video) => (
                <VideoCard
                    key={video.id}  // Unique key required!
                    video={video}
                />
            ))}
        </div>
    );
}
```

### **Why Keys Matter:**
```javascript
// Without keys - React can't track which item is which
{videos.map(video => <VideoCard video={video} />)}  // ❌

// With keys - React knows which item changed
{videos.map(video => <VideoCard key={video.id} video={video} />)}  // ✅
```

**In your code:** `frontend/src/screens/FeedScreen.js`
```javascript
{videos.map((video, index) => (
    <VideoCard
        key={video.id}  // Unique identifier
        video={video}
        isFirst={index === 0}
    />
))}
```

---

## 🎯 Key Takeaways

1. **Components** are functions that return JSX
2. **Props** pass data from parent to child (read-only)
3. **State** (useState) stores data that changes and triggers re-renders
4. **Effects** (useEffect) run side effects (API calls, subscriptions)
5. **Refs** (useRef) access DOM elements without re-rendering
6. **JSX** uses `{}` for JavaScript, `className` for CSS classes
7. **Conditional rendering** uses `&&`, ternary, or variables
8. **Lists** need unique `key` props

---

## 📝 Practice Exercise

Look at your `frontend/src/components/VideoCard.js`:
1. Identify all props being passed in
2. Find all useState calls
3. Find all useEffect calls
4. Find all useRef calls
5. Find all event handlers (onClick, etc.)
6. Find all conditional rendering

---

**Next:** [Lesson 5: React Hooks](./05-react-hooks.md) →

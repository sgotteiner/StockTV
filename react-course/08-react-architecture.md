# Lesson 8: React Architecture

Understanding how your StockTV app is structured.

---

## 1. Project Structure

```
frontend/src/
├── App.js                  # Root component
├── index.js                # Entry point
├── components/             # Reusable UI components
│   ├── VideoCard.js
│   ├── VideoOptionsMenu.js
│   ├── ProfileView.js
│   └── ...
├── screens/                # Page-level components
│   ├── FeedScreen.js
│   └── ProfileScreen.js
├── hooks/                  # Custom hooks (reusable logic)
│   ├── useVideoPlayback.js
│   ├── useSwipe.js
│   └── ...
├── context/                # Global state (Context API)
│   ├── UserProvider.js
│   ├── MediaContext.js
│   └── NavigationContext.js
├── services/               # API calls (backend communication)
│   ├── api.js
│   ├── authApi.js
│   └── interactionsApi.js
├── styles/                 # CSS files
│   ├── videoStyles.css
│   └── profileStyles.css
└── config/                 # Configuration
    └── features.js         # Feature flags
```

---

## 2. Component Hierarchy

```
App
└── UserProvider
    └── MediaProvider
        └── NavigationProvider
            └── TabNavigator
                ├── FeedScreen
                │   └── VideoCard (multiple)
                │       ├── VideoInfoView
                │       └── VideoOptionsMenu
                └── ProfileScreen
                    ├── AuthForm (if not logged in)
                    └── UserProfile (if logged in)
                        ├── ProfileView
                        ├── ProfileEdit
                        ├── UploadScreen
                        ├── AdminPanel
                        └── CompanyPanel
```

---

## 3. Data Flow

### **Unidirectional Data Flow:**
```
Parent Component
    │
    ├─ Props ──→ Child Component
    │
    └─ Callback ←── Child Component
```

### **Example:**
```javascript
// Parent (FeedScreen)
function FeedScreen() {
    const [videos, setVideos] = useState([]);
    
    const handleVideoLike = (videoId) => {
        // Update videos array
    };
    
    return videos.map(video => (
        <VideoCard
            video={video}              // Data flows down
            onLike={handleVideoLike}   // Events flow up
        />
    ));
}

// Child (VideoCard)
function VideoCard({ video, onLike }) {
    return (
        <button onClick={() => onLike(video.id)}>
            Like
        </button>
    );
}
```

---

## 4. Separation of Concerns

### **Presentation vs Logic:**

**❌ Bad - Mixed:**
```javascript
function VideoCard({ video }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const videoRef = useRef(null);
    
    useEffect(() => {
        // Fetch likes
        fetch(`/api/likes/${video.id}`)
            .then(res => res.json())
            .then(data => setLikeCount(data.count));
    }, [video.id]);
    
    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    return (
        <div onClick={togglePlay}>
            <video ref={videoRef} src={video.file_path} />
            <button>{likeCount} likes</button>
        </div>
    );
}
```

**✅ Good - Separated:**
```javascript
// Custom hooks (logic)
function useVideoPlayback() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    
    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    
    return { videoRef, isPlaying, togglePlay };
}

function useVideoLikes(videoId) {
    const [likeCount, setLikeCount] = useState(0);
    
    useEffect(() => {
        fetch(`/api/likes/${videoId}`)
            .then(res => res.json())
            .then(data => setLikeCount(data.count));
    }, [videoId]);
    
    return { likeCount };
}

// Component (presentation)
function VideoCard({ video }) {
    const { videoRef, isPlaying, togglePlay } = useVideoPlayback();
    const { likeCount } = useVideoLikes(video.id);
    
    return (
        <div onClick={togglePlay}>
            <video ref={videoRef} src={video.file_path} />
            <button>{likeCount} likes</button>
        </div>
    );
}
```

---

## 5. API Abstraction Layer

### **Why Abstract APIs:**
```
Components → Services → Backend

Components don't know:
- API URLs
- Request format
- Error handling
- Response parsing
```

### **Your API Layer:**
```javascript
// services/interactionsApi.js
const API_URL = 'http://localhost:5000/api/interactions';

export const likeVideo = async (videoId, userId) => {
    const response = await fetch(`${API_URL}/videos/${videoId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
        throw new Error('Failed to like video');
    }
    
    return await response.json();
};

// Component just calls:
const result = await interactionsApi.likeVideo(video.id, user.id);
```

### **Benefits:**
- ✅ Change API without touching components
- ✅ Centralized error handling
- ✅ Easy to mock for testing
- ✅ Type safety (with TypeScript)

---

## 6. State Management Strategy

### **Local State (useState):**
```javascript
// Use for: Component-specific data
function VideoCard() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
}
```

### **Context (useContext):**
```javascript
// Use for: Global app state
function App() {
    return (
        <UserProvider>  {/* User auth state */}
            <MediaProvider>  {/* Mute state */}
                <App />
            </MediaProvider>
        </UserProvider>
    );
}
```

### **Custom Hooks:**
```javascript
// Use for: Reusable logic
function VideoCard() {
    const { isPlaying, togglePlay } = useVideoPlayback();
    const { likeCount, toggleLike } = useVideoInteractions();
}
```

### **Decision Tree:**
```
Is it used by multiple components?
├─ No → Local state (useState)
└─ Yes → Is it global (user, theme)?
    ├─ Yes → Context
    └─ No → Lift state up or custom hook
```

---

## 7. Component Patterns

### **Container/Presentational Pattern:**

**Container (Logic):**
```javascript
function FeedScreenContainer() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchVideos().then(setVideos).finally(() => setLoading(false));
    }, []);
    
    return <FeedScreenView videos={videos} loading={loading} />;
}
```

**Presentational (UI):**
```javascript
function FeedScreenView({ videos, loading }) {
    if (loading) return <div>Loading...</div>;
    
    return (
        <div>
            {videos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
```

### **Compound Components Pattern:**
```javascript
// Parent manages state, children use it
function VideoOptionsMenu({ video }) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div>
            <VideoOptionsMenu.Trigger onClick={() => setIsOpen(true)} />
            {isOpen && (
                <VideoOptionsMenu.Content>
                    <VideoOptionsMenu.Item>Save</VideoOptionsMenu.Item>
                    <VideoOptionsMenu.Item>Share</VideoOptionsMenu.Item>
                </VideoOptionsMenu.Content>
            )}
        </div>
    );
}
```

---

## 8. Error Boundaries

### **What are Error Boundaries?**
Catch JavaScript errors in component tree.

```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('Error:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        
        return this.props.children;
    }
}

// Usage
<ErrorBoundary>
    <FeedScreen />
</ErrorBoundary>
```

**Note:** Your app doesn't have error boundaries yet - good to add!

---

## 9. Code Organization Principles

### **1. Single Responsibility:**
```javascript
// ❌ Bad - does too much
function VideoCard() {
    // Handles playback
    // Handles likes
    // Handles saves
    // Handles follows
    // Handles UI
}

// ✅ Good - focused
function VideoCard() {
    const playback = useVideoPlayback();
    const interactions = useVideoInteractions();
    
    return <VideoCardUI {...playback} {...interactions} />;
}
```

### **2. DRY (Don't Repeat Yourself):**
```javascript
// ❌ Bad - repeated logic
function VideoCard1() {
    const [isPlaying, setIsPlaying] = useState(false);
    const play = () => { /* ... */ };
}

function VideoCard2() {
    const [isPlaying, setIsPlaying] = useState(false);
    const play = () => { /* ... */ };
}

// ✅ Good - extracted to hook
function useVideoPlayback() {
    const [isPlaying, setIsPlaying] = useState(false);
    const play = () => { /* ... */ };
    return { isPlaying, play };
}
```

### **3. Composition over Inheritance:**
```javascript
// ✅ React way - composition
function VideoCard({ video }) {
    return (
        <Card>
            <VideoPlayer video={video} />
            <LikeButton videoId={video.id} />
        </Card>
    );
}
```

---

## 10. Your App's Architecture Strengths

### **✅ What You Did Well:**

1. **Separation of Concerns**
   - Components (UI)
   - Hooks (logic)
   - Services (API)
   - Context (global state)

2. **Custom Hooks**
   - Reusable logic
   - Clean components
   - Easy to test

3. **API Abstraction**
   - Services layer
   - Easy to change backend
   - Centralized error handling

4. **Context for Global State**
   - User auth
   - Media state
   - Navigation

5. **Feature Flags**
   - Easy to hide features
   - A/B testing ready

### **🔄 What Could Be Better:**

1. **Error Boundaries** - Add for better error handling
2. **Loading States** - More consistent loading UI
3. **TypeScript** - Type safety (Next.js makes this easy)
4. **Testing** - Add unit/integration tests
5. **Code Splitting** - Lazy load components

---

## 🎯 Key Takeaways

1. **Separate concerns** - UI, logic, data
2. **Custom hooks** for reusable logic
3. **Context** for global state
4. **Services** abstract API calls
5. **Unidirectional data flow** - props down, events up
6. **Composition** over inheritance
7. **Single responsibility** per component/hook

---

## 📝 Practice Exercise

1. Draw your app's component tree
2. Identify data flow (where does each piece of state live?)
3. Find examples of each pattern in your code
4. Think about what you'd improve

---

**Next:** [Lesson 9: React Best Practices](./09-react-best-practices.md) →

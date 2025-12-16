# Lesson 6: Your Custom Hooks Explained

Deep dive into each of your StockTV custom hooks.

---

## 1. useSwipe - Touch Gesture Detection

**File:** `frontend/src/hooks/useSwipe.js`

### **Purpose:**
Detect swipe left/right gestures for navigating between video and info view.

### **How it works:**
```javascript
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    
    // 1. Record where touch started
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    
    // 2. Track touch movement
    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    
    // 3. Determine swipe direction when touch ends
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > threshold;
        const isRightSwipe = distance < -threshold;
        
        if (isLeftSwipe) {
            onSwipeLeft?.();
        }
        if (isRightSwipe) {
            onSwipeRight?.();
        }
    };
    
    return {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
    };
}
```

### **Usage in VideoCard:**
```javascript
const swipeHandlers = useSwipe({
    onSwipeLeft: () => setShowInfo(false),   // Hide info
    onSwipeRight: () => setShowInfo(true),   // Show info
    threshold: 100  // Minimum swipe distance
});

return (
    <div {...swipeHandlers}>
        {/* Video content */}
    </div>
);
```

---

## 2. useVideoPlayback - Video Player Control

**File:** `frontend/src/hooks/useVideoPlayback.js`

### **Purpose:**
Manage video playback state and controls.

### **What it manages:**
- Video ref (DOM access)
- Playing state
- Progress tracking
- Play/pause/seek controls
- Auto-play on scroll

### **Key parts:**
```javascript
export function useVideoPlayback(isFirst) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    
    // Auto-play first video
    useEffect(() => {
        if (isFirst && videoRef.current) {
            play();
        }
    }, [isFirst]);
    
    // Intersection Observer - play when in view
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    play();
                } else {
                    pause();
                }
            },
            { threshold: 0.5 }  // 50% visible
        );
        
        observer.observe(video);
        
        return () => observer.disconnect();
    }, []);
    
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
        isPlaying,
        progress,
        togglePlayPause: () => isPlaying ? pause() : play(),
        play,
        pause,
        handleTimeUpdate
    };
}
```

---

## 3. useVideoInteractions - Likes & Views

**File:** `frontend/src/hooks/useVideoInteractions.js`

### **Purpose:**
Handle video likes and view tracking.

### **State management:**
```javascript
export function useVideoInteractions(video, currentUser) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewRecorded, setViewRecorded] = useState(false);
    
    // Fetch initial like data
    useEffect(() => {
        const fetchLikeData = async () => {
            try {
                // Get total likes
                const likeData = await interactionsApi.getVideoLikes(video.id);
                setLikeCount(likeData.likeCount);
                
                // Check if user liked
                if (currentUser) {
                    const userLikes = await interactionsApi.getUserLikedVideos(currentUser.id);
                    const userLikedVideoIds = userLikes.likedVideos.map(item => item.videoId);
                    setIsLiked(userLikedVideoIds.includes(video.id));
                }
            } catch (error) {
                console.error('Error fetching like data:', error);
            }
        };
        fetchLikeData();
    }, [video.id, currentUser]);
    
    // Record view when playing
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
    
    // Toggle like
    const toggleLike = useCallback(async () => {
        if (!currentUser || isLoading) {
            return { requiresLogin: !currentUser };
        }
        
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
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, [video.id, currentUser, isLiked, isLoading]);
    
    return {
        likeCount,
        isLiked,
        isLoading,
        recordView,
        toggleLike
    };
}
```

---

## 4. useVideoSave - Save/Bookmark Videos

**File:** `frontend/src/hooks/useVideoSave.js`

### **Purpose:**
Handle saving/unsaving videos.

### **Pattern:**
```javascript
export function useVideoSave(video, currentUser) {
    const [isSaved, setIsSaved] = useState(false);
    const [message, setMessage] = useState('');
    
    // Check if video is saved
    useEffect(() => {
        const checkSaved = async () => {
            if (!currentUser) return;
            
            const savedVideos = await api.getUserSavedVideos(currentUser.id);
            setIsSaved(savedVideos.includes(video.id));
        };
        checkSaved();
    }, [video.id, currentUser]);
    
    // Toggle save
    const toggleSave = async () => {
        if (!currentUser) {
            setMessage('Please login to save videos');
            return;
        }
        
        try {
            if (isSaved) {
                await api.unsaveVideo(video.id, currentUser.id);
                setIsSaved(false);
                setMessage('Video unsaved');
            } else {
                await api.saveVideo(video.id, currentUser.id);
                setIsSaved(true);
                setMessage('Video saved');
            }
        } catch (error) {
            setMessage('Error saving video');
        }
    };
    
    return { isSaved, toggleSave, message };
}
```

---

## 5. useCompanyFollow - Follow Companies

**File:** `frontend/src/hooks/useCompanyFollow.js`

### **Purpose:**
Handle following/unfollowing companies and company data.

### **Multiple responsibilities:**
```javascript
export function useCompanyFollow(companyId, currentUser) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // Fetch company data
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const company = await companyApi.getCompanyById(companyId);
                setCompanyName(company.name);
                setCompanyWebsite(company.website);
                
                if (currentUser) {
                    const following = await companyFollowApi.isFollowing(
                        currentUser.id,
                        companyId
                    );
                    setIsFollowing(following);
                }
            } catch (error) {
                console.error('Error fetching company:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanyData();
    }, [companyId, currentUser]);
    
    // Toggle follow
    const toggleFollow = async () => {
        if (!currentUser) {
            setMessage('Please login to follow companies');
            return;
        }
        
        try {
            if (isFollowing) {
                await companyFollowApi.unfollowCompany(currentUser.id, companyId);
                setIsFollowing(false);
                setMessage(`Unfollowed ${companyName}`);
            } else {
                await companyFollowApi.followCompany(currentUser.id, companyId);
                setIsFollowing(true);
                setMessage(`Following ${companyName}`);
            }
        } catch (error) {
            setMessage('Error updating follow status');
        }
    };
    
    // Go to website
    const goToWebsite = () => {
        if (companyWebsite) {
            window.open(companyWebsite, '_blank');
            return { success: true };
        }
        return { success: false };
    };
    
    return {
        isFollowing,
        toggleFollow,
        goToWebsite,
        companyName,
        companyWebsite,
        loading,
        message
    };
}
```

---

## 6. useProfileStats - User Statistics

**File:** `frontend/src/hooks/useProfileStats.js`

### **Purpose:**
Fetch and display user statistics (videos watched, saved, following).

### **Aggregating data:**
```javascript
export function useProfileStats(userId, user) {
    const [stats, setStats] = useState({
        videosWatched: 0,
        videosSaved: 0,
        companiesFollowing: 0
    });
    
    useEffect(() => {
        const fetchStats = async () => {
            if (!userId) return;
            
            try {
                // Fetch all stats in parallel
                const [watched, saved, following] = await Promise.all([
                    userProfileApi.getVideosWatchedCount(userId),
                    userProfileApi.getVideosSavedCount(userId),
                    userProfileApi.getCompaniesFollowingCount(userId)
                ]);
                
                setStats({
                    videosWatched: watched.count,
                    videosSaved: saved.count,
                    companiesFollowing: following.count
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        
        fetchStats();
    }, [userId, user]);  // Refetch when user changes
    
    return { stats };
}
```

---

## 7. useVideoAspectRatio - Adaptive Layout

**File:** `frontend/src/hooks/useVideoAspectRatio.js`

### **Purpose:**
Detect video aspect ratio for adaptive layout.

### **Dynamic detection:**
```javascript
export function useVideoAspectRatio(videoPath) {
    const [aspectRatio, setAspectRatio] = useState('9-16');  // Default vertical
    
    useEffect(() => {
        const video = document.createElement('video');
        video.src = videoPath;
        
        video.addEventListener('loadedmetadata', () => {
            const ratio = video.videoWidth / video.videoHeight;
            
            if (ratio > 1.5) {
                setAspectRatio('16-9');  // Horizontal
            } else if (ratio < 0.7) {
                setAspectRatio('9-16');  // Vertical
            } else {
                setAspectRatio('1-1');   // Square
            }
        });
        
        return () => {
            video.remove();
        };
    }, [videoPath]);
    
    return { aspectRatio };
}
```

---

## 8. Common Patterns in Your Hooks

### **Pattern 1: Fetch on mount, refetch on dependency change**
```javascript
useEffect(() => {
    fetchData();
}, [dependency]);
```

### **Pattern 2: Optimistic updates**
```javascript
const toggleLike = async () => {
    // Update UI immediately
    setIsLiked(!isLiked);
    setLikeCount(c => isLiked ? c - 1 : c + 1);
    
    try {
        // Sync with server
        await api.toggleLike();
    } catch (error) {
        // Revert on error
        setIsLiked(isLiked);
        setLikeCount(c => isLiked ? c + 1 : c - 1);
    }
};
```

### **Pattern 3: Loading states**
```javascript
const [isLoading, setIsLoading] = useState(false);

const doAction = async () => {
    setIsLoading(true);
    try {
        await api.action();
    } finally {
        setIsLoading(false);  // Always reset
    }
};
```

### **Pattern 4: Error handling with messages**
```javascript
const [message, setMessage] = useState('');

const doAction = async () => {
    try {
        await api.action();
        setMessage('Success!');
    } catch (error) {
        setMessage('Error: ' + error.message);
    }
};
```

---

## 🎯 Key Takeaways

1. **Custom hooks** encapsulate reusable logic
2. **Name hooks** starting with "use" (convention + linter)
3. **Return objects** for multiple values `{ state, actions }`
4. **Use useCallback** for functions returned from hooks
5. **Handle loading/error states** in hooks
6. **Cleanup** in useEffect when needed
7. **Dependencies** must be complete and correct

---

## 📝 Practice Exercise

1. Pick one of your custom hooks
2. Trace through the code line by line
3. Identify all built-in hooks used
4. Understand what each useEffect does
5. See how it's used in a component

---

**Next:** [Lesson 7: Context & State Management](./07-context-state.md) →

# Lesson 7: Context & State Management

Understanding how your app manages global state.

---

## 1. The Problem: Prop Drilling

**Without Context:**
```javascript
// App (top level)
function App() {
    const [user, setUser] = useState(null);
    
    return <FeedScreen user={user} setUser={setUser} />;
}

// FeedScreen (middle)
function FeedScreen({ user, setUser }) {
    return <VideoCard user={user} setUser={setUser} />;
}

// VideoCard (bottom) - finally uses it!
function VideoCard({ user, setUser }) {
    return <div>{user?.name}</div>;
}
```

**Problem:** Passing props through components that don't use them.

---

## 2. The Solution: Context

**With Context:**
```javascript
// App (top level)
function App() {
    return (
        <UserProvider>
            <FeedScreen />
        </UserProvider>
    );
}

// VideoCard (any level) - direct access!
function VideoCard() {
    const { user } = useUser();
    return <div>{user?.name}</div>;
}
```

---

## 3. Your UserProvider

**File:** `frontend/src/context/UserProvider.js`

### **Creating Context:**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create context
const UserContext = createContext(undefined);

// 2. Provider component
export function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);
    
    // Login function
    const login = async (email, password) => {
        try {
            const user = await authApi.login(email, password);
            setCurrentUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    
    // Logout function
    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
    };
    
    // Register function
    const register = async (email, password, name) => {
        try {
            const user = await authApi.register(email, password, name);
            setCurrentUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    
    // Update profile
    const updateProfile = async (updates) => {
        try {
            const updatedUser = await userApi.updateUser(currentUser.id, updates);
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };
    
    // Value provided to consumers
    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        updateProfile
    };
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// 3. Custom hook to use context
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
```

### **Usage in App:**
```javascript
// frontend/src/App.js
function App() {
    return (
        <UserProvider>
            <MediaProvider>
                <NavigationProvider>
                    <TabNavigator />
                </NavigationProvider>
            </MediaProvider>
        </UserProvider>
    );
}
```

### **Usage in Components:**
```javascript
// Any component can access user
function VideoCard() {
    const { currentUser, isAuthenticated, logout } = useUser();
    
    return (
        <div>
            {isAuthenticated ? (
                <>
                    <p>Welcome, {currentUser.name}</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <p>Please login</p>
            )}
        </div>
    );
}
```

---

## 4. Your MediaContext

**File:** `frontend/src/context/MediaContext.js`

### **Purpose:**
Global mute state for all videos.

```javascript
const MediaContext = createContext();

export function MediaProvider({ children }) {
    const [isMuted, setIsMuted] = useState(true);  // Start muted
    
    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };
    
    return (
        <MediaContext.Provider value={{ isMuted, toggleMute }}>
            {children}
        </MediaContext.Provider>
    );
}

export function useMedia() {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within MediaProvider');
    }
    return context;
}
```

### **Usage:**
```javascript
function VideoCard() {
    const { isMuted, toggleMute } = useMedia();
    
    return (
        <div>
            <video muted={isMuted} />
            <button onClick={toggleMute}>
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
}
```

---

## 5. Your NavigationContext

**File:** `frontend/src/context/NavigationContext.js`

### **Purpose:**
Manage which tab is active (Feed or Profile).

```javascript
const NavigationContext = createContext();

export function NavigationProvider({ children }) {
    const [activeTab, setActiveTab] = useState('feed');
    
    return (
        <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
}
```

### **Usage:**
```javascript
// TabNavigator
function TabNavigator() {
    const { activeTab, setActiveTab } = useNavigation();
    
    return (
        <div>
            <button onClick={() => setActiveTab('feed')}>Feed</button>
            <button onClick={() => setActiveTab('profile')}>Profile</button>
            
            {activeTab === 'feed' ? <FeedScreen /> : <ProfileScreen />}
        </div>
    );
}

// VideoCard - navigate to profile
function VideoCard() {
    const { setActiveTab } = useNavigation();
    
    const handleLikeRequiresLogin = () => {
        if (confirm('Login required. Go to profile?')) {
            setActiveTab('profile');
        }
    };
}
```

---

## 6. Context Best Practices

### **1. Separate contexts by concern:**
```javascript
// ✅ Good - separate contexts
<UserProvider>
    <MediaProvider>
        <NavigationProvider>
            <App />
        </NavigationProvider>
    </MediaProvider>
</UserProvider>

// ❌ Bad - one giant context
<AppProvider>  // Everything in one
    <App />
</AppProvider>
```

### **2. Custom hooks for each context:**
```javascript
// ✅ Good - custom hook
export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('...');
    return context;
}

// Usage
const { user } = useUser();

// ❌ Bad - use context directly
const { user } = useContext(UserContext);
```

### **3. Only provide what's needed:**
```javascript
// ✅ Good - minimal value
const value = {
    user,
    login,
    logout
};

// ❌ Bad - exposing internals
const value = {
    user,
    setUser,  // Don't expose setState
    _internalState,  // Don't expose private state
    login,
    logout
};
```

---

## 7. When to Use Context

### **✅ Use Context for:**
- User authentication state
- Theme (dark/light mode)
- Language/locale
- Global UI state (modals, toasts)
- Media state (mute/unmute)

### **❌ Don't Use Context for:**
- Frequently changing data (causes re-renders)
- Data that's only used in one place
- Server state (use React Query instead)
- Form state (use local state)

---

## 8. Context Performance

### **Problem: Unnecessary re-renders**
```javascript
// Every component using context re-renders when ANY value changes
const value = {
    user,
    theme,
    language,
    settings
};

// If theme changes, ALL consumers re-render!
```

### **Solution 1: Split contexts**
```javascript
// Separate frequently-changing data
<UserProvider>
    <ThemeProvider>  // Theme changes often
        <App />
    </ThemeProvider>
</UserProvider>
```

### **Solution 2: useMemo for value**
```javascript
const value = useMemo(() => ({
    user,
    login,
    logout
}), [user]);  // Only recreate when user changes
```

---

## 9. Your App's State Flow

```
┌─────────────────────────────────────┐
│  UserProvider (Global)              │
│  - currentUser                      │
│  - isAuthenticated                  │
│  - login/logout/register            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  MediaProvider (Global)             │
│  - isMuted                          │
│  - toggleMute                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  NavigationProvider (Global)        │
│  - activeTab                        │
│  - setActiveTab                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Components (Local State)           │
│  - VideoCard: isPlaying, progress   │
│  - FeedScreen: videos, loading      │
│  - ProfileScreen: isEditing         │
└─────────────────────────────────────┘
```

---

## 🎯 Key Takeaways

1. **Context** solves prop drilling
2. **Provider** wraps components that need access
3. **useContext** hook accesses context values
4. **Custom hooks** (useUser, useMedia) are best practice
5. **Separate contexts** by concern
6. **useMemo** for performance
7. **Don't overuse** - local state is often better

---

## 📝 Practice Exercise

Look at your context files:
1. Identify all contexts (User, Media, Navigation)
2. See what each provides
3. Find where they're used in components
4. Understand the provider hierarchy in App.js

---

**Next:** [Lesson 8: React Architecture](./08-react-architecture.md) →

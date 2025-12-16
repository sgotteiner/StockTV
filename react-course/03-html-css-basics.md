# Lesson 3: HTML & CSS Basics

Learn how HTML structures content and CSS styles it, and how React uses JSX to combine them.

---

## 1. HTML Basics

### **What is HTML?**
HTML (HyperText Markup Language) structures web content using **tags**.

```html
<tagname>Content</tagname>

<!-- Common tags -->
<div>Container</div>
<h1>Heading</h1>
<p>Paragraph</p>
<button>Click me</button>
<img src="image.jpg" alt="Description" />
<video src="video.mp4"></video>
```

### **HTML Structure:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="app.js"></script>
  </body>
</html>
```

**In your app:** `frontend/public/index.html`
```html
<div id="root"></div>
<!-- React renders your entire app here -->
```

---

## 2. Common HTML Elements

### **Containers:**
```html
<div>Block container (full width)</div>
<span>Inline container (fits content)</span>
```

### **Text:**
```html
<h1>Heading 1 (largest)</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<p>Paragraph text</p>
<strong>Bold text</strong>
<em>Italic text</em>
```

### **Interactive:**
```html
<button>Click me</button>
<input type="text" placeholder="Enter text" />
<input type="file" accept="video/*" />
```

### **Media:**
```html
<img src="image.jpg" alt="Description" />
<video src="video.mp4" controls></video>
<audio src="audio.mp3" controls></audio>
```

---

## 3. HTML Attributes

```html
<!-- id - unique identifier -->
<div id="video-player"></div>

<!-- class - for styling (can have multiple) -->
<div class="video-card active"></div>

<!-- src - source for media -->
<img src="/images/logo.png" />
<video src="/videos/vid_001.mp4" />

<!-- href - link destination -->
<a href="https://example.com">Visit site</a>

<!-- style - inline CSS -->
<div style="color: red; font-size: 20px;">Text</div>

<!-- data attributes - custom data -->
<div data-video-id="vid_001">Video</div>
```

**In your code:** React components return HTML-like JSX
```javascript
// frontend/src/components/VideoCard.js
<div className="video-card">
  <video
    ref={videoRef}
    src={video.file_path}
    playsInline
    muted={isMuted}
    className="video-player"
  />
</div>
```

---

## 4. CSS Basics

### **What is CSS?**
CSS (Cascading Style Sheets) styles HTML elements.

```css
/* Selector { property: value; } */
.video-card {
    width: 100%;
    height: 100vh;
    background-color: black;
}
```

### **Three Ways to Add CSS:**

**1. Inline (in HTML):**
```html
<div style="color: red; font-size: 20px;">Text</div>
```

**2. Internal (in `<style>` tag):**
```html
<style>
  .video-card { width: 100%; }
</style>
```

**3. External (separate file) - BEST:**
```html
<link rel="stylesheet" href="styles.css">
```

---

## 5. CSS Selectors

```css
/* Element selector */
div {
    color: blue;
}

/* Class selector (most common) */
.video-card {
    width: 100%;
}

/* ID selector */
#root {
    height: 100vh;
}

/* Descendant selector */
.video-card button {
    position: absolute;
}

/* Multiple classes */
.video-card.active {
    border: 2px solid red;
}

/* Pseudo-classes */
button:hover {
    background-color: #333;
}

button:active {
    transform: scale(0.95);
}
```

**In your code:** `frontend/src/styles/videoStyles.css`
```css
.video-card {
    position: relative;
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
}

.video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

---

## 6. CSS Properties

### **Layout:**
```css
.container {
    /* Display type */
    display: block;        /* Full width */
    display: inline;       /* Fits content */
    display: flex;         /* Flexbox */
    display: grid;         /* Grid */
    
    /* Positioning */
    position: relative;    /* Normal flow */
    position: absolute;    /* Remove from flow */
    position: fixed;       /* Fixed to viewport */
    position: sticky;      /* Sticky scroll */
    
    /* Size */
    width: 100%;
    height: 100vh;         /* 100% viewport height */
    max-width: 500px;
    min-height: 200px;
}
```

### **Spacing:**
```css
.element {
    /* Margin (outside) */
    margin: 10px;
    margin-top: 20px;
    margin: 10px 20px;     /* top/bottom left/right */
    
    /* Padding (inside) */
    padding: 15px;
    padding-left: 30px;
}
```

### **Colors & Text:**
```css
.text {
    color: #ffffff;        /* Text color */
    background-color: rgba(0, 0, 0, 0.5);  /* Background */
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}
```

### **Borders & Shadows:**
```css
.card {
    border: 1px solid #ccc;
    border-radius: 8px;    /* Rounded corners */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**In your code:** `frontend/src/styles/videoStyles.css`
```css
.like-button {
    position: absolute;
    bottom: 120px;
    right: 20px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    padding: 12px 16px;
    font-size: 24px;
    cursor: pointer;
    transition: transform 0.2s;
}

.like-button:hover {
    transform: scale(1.1);
}
```

---

## 7. Flexbox (Modern Layout)

```css
.container {
    display: flex;
    
    /* Direction */
    flex-direction: row;       /* Horizontal (default) */
    flex-direction: column;    /* Vertical */
    
    /* Alignment */
    justify-content: center;   /* Main axis */
    align-items: center;       /* Cross axis */
    
    /* Spacing */
    gap: 10px;                 /* Space between items */
}
```

**Example:**
```css
/* Center content vertically and horizontally */
.centered {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
```

**In your code:** `frontend/src/styles/profileStyles.css`
```css
.profile-stats {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    background: #f5f5f5;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

---

## 8. Responsive Design

### **Media Queries:**
```css
/* Mobile first (default styles for mobile) */
.video-card {
    width: 100%;
}

/* Tablet and up */
@media (min-width: 768px) {
    .video-card {
        width: 50%;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .video-card {
        width: 33.33%;
    }
}
```

### **Viewport Units:**
```css
.full-screen {
    width: 100vw;   /* 100% of viewport width */
    height: 100vh;  /* 100% of viewport height */
}
```

**In your code:** `frontend/src/styles/adaptiveVideoStyles.css`
```css
.video-card.aspect-9-16 {
    width: min(100vw, calc(100vh * 9 / 16));
    height: 100vh;
}

.video-card.aspect-16-9 {
    width: 100vw;
    height: min(100vh, calc(100vw * 9 / 16));
}
```

---

## 9. CSS Transitions & Animations

### **Transitions (smooth changes):**
```css
.button {
    background-color: blue;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: darkblue;
    /* Smoothly transitions over 0.3s */
}
```

### **Animations (keyframes):**
```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.element {
    animation: fadeIn 0.5s ease-in;
}
```

**In your code:** `frontend/src/styles/videoStyles.css`
```css
.like-button {
    transition: transform 0.2s;
}

.like-button:hover {
    transform: scale(1.1);
}

.like-button.liked {
    color: #ff0000;
    animation: pulse 0.3s ease;
}
```

---

## 10. How React Uses HTML/CSS (JSX)

### **JSX = JavaScript + XML (HTML-like)**

**HTML:**
```html
<div class="video-card">
    <video src="/video.mp4"></video>
    <button onclick="handleClick()">Like</button>
</div>
```

**React JSX:**
```javascript
<div className="video-card">
    <video src={video.file_path} />
    <button onClick={handleClick}>Like</button>
</div>
```

### **Key Differences:**

| HTML | JSX (React) |
|------|-------------|
| `class` | `className` |
| `onclick` | `onClick` |
| `for` | `htmlFor` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| Lowercase events | camelCase events |

### **Dynamic Values in JSX:**
```javascript
// Variables in {}
<div className="video-card">
    <h1>{video.title}</h1>
    <p>Duration: {video.duration} seconds</p>
    <img src={video.thumbnail} alt={video.title} />
</div>

// Conditional rendering
{isLiked ? <span>♥</span> : <span>♡</span>}

// Conditional classes
<button className={`like-button ${isLiked ? 'liked' : ''}`}>
    Like
</button>

// Inline styles (object)
<div style={{
    backgroundColor: 'black',
    color: 'white',
    padding: '20px'
}}>
    Content
</div>
```

**In your code:** `frontend/src/components/VideoCard.js`
```javascript
<div className={`video-card aspect-${aspectRatio} ${showInfo ? 'info-view' : 'video-view'}`}>
    <video
        ref={videoRef}
        src={video.file_path}
        playsInline
        muted={isMuted}
        className="video-player"
    />
    
    {!isPlaying && (
        <div className="play-icon-overlay">▶</div>
    )}
    
    <button
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={(e) => { e.stopPropagation(); handleLike(); }}
    >
        {isLiked ? '♥' : '♡'} {likeCount}
    </button>
</div>
```

---

## 11. CSS Modules (Scoped Styles)

**Problem:** CSS is global (can conflict)
```css
/* styles.css */
.button { color: red; }  /* Affects ALL buttons */
```

**Solution:** CSS Modules (scoped to component)
```css
/* Button.module.css */
.button { color: red; }  /* Only affects this component */
```

```javascript
// Button.js
import styles from './Button.module.css';

function Button() {
    return <button className={styles.button}>Click</button>;
}
```

**Your app uses global CSS**, but Next.js supports CSS Modules by default.

---

## 🎯 Key Takeaways

1. **HTML** structures content with tags
2. **CSS** styles content with selectors and properties
3. **JSX** combines HTML and JavaScript (use `className`, `onClick`, etc.)
4. **Flexbox** is the modern way to layout elements
5. **Responsive design** uses media queries and viewport units
6. **React** uses `{}` to embed JavaScript in JSX
7. **Inline styles** in React are objects: `style={{ color: 'red' }}`

---

## 📝 Practice Exercise

Look at your `frontend/src/components/VideoCard.js` and `frontend/src/styles/videoStyles.css`:
1. Identify all JSX elements (div, button, video, etc.)
2. Find all className attributes
3. Find all conditional rendering (`{condition && <element>}`)
4. Look at the CSS and identify: selectors, properties, flexbox, positioning

---

**Next:** [Lesson 4: React Fundamentals](./04-react-fundamentals.md) →

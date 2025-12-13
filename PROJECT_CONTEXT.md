# StockTV - Project Context & Development Plan

## Project Overview

**StockTV** is a TikTok-like TV channel application with vertical video feed. It's NOT a social network - just a curated TV channel experience with user engagement features (likes).

### Target Platforms
- **Primary**: Mobile apps (Android & iOS)
- **Current**: Web app (React) - will be wrapped for mobile later
- **Technology**: React (Create React App) + Express backend
- **Note**: Currently using React (web), NOT React Native. Will use Capacitor/PWA or migrate to React Native later.

---

## MVP Features (Core Functionality)

### ✅ Completed Features
1. **Video Feed** - TikTok-like vertical scrolling feed
2. **User System** with role-based permissions:
   - `user` - Can only watch and like videos
   - `company` - Can upload videos for their own company
   - `admin` - Can upload videos for any company, upgrade user accounts to company accounts
   - `master_admin` - Full control (developer only), can assign admin permissions
3. **Like System** - Users can like/unlike videos
4. **Upload Functionality** - Role-based video upload from YouTube URLs
5. **Profile Page** - User profile and authentication
6. **Admin Panel** - For managing users and permissions

### 🎯 MVP Definition
MVP = **Minimum Viable Product** (core features only, no chat, no advanced social features)
- Focus: Get the core experience working perfectly
- NOT production-ready yet (no real users until proper security, auth, database, and cloud storage are implemented)
- Goal: Validate the concept and UX before investing in production infrastructure

---

## Code Architecture & Standards

### ✅ What's Done Well

#### **Backend Structure**
```
backend/
├── app.js                 # Main Express server
├── config/                # App configuration
├── controllers/           # Request handlers
├── routes/                # API route definitions
├── services/              # Business logic layer
├── storage/               # Data access layer (currently JSON files)
└── utils/                 # Helper functions
```

#### **Frontend Structure**
```
frontend/src/
├── App.js                 # Main app entry
├── components/            # Reusable UI components
├── screens/               # Page-level components
├── services/              # API abstraction layer
├── context/               # React Context providers (UserProvider, MediaProvider, NavigationContext)
├── hooks/                 # Custom React hooks (useSwipe, useVideoPlayback)
└── styles/                # CSS files
```

#### **Key Architectural Strengths**
1. **Separation of Concerns** - Clean layers: UI → Services → Controllers → Storage
2. **API Abstraction** - Frontend doesn't know backend implementation details
3. **Custom Hooks** - Reusable logic (useSwipe, useVideoPlayback)
4. **Context Providers** - Proper state management
5. **Swappable Components** - Easy to replace storage/auth/cloud services later

### 📋 Code Standards
- **Modularity** - Each component/service does ONE thing
- **Reusability** - Don't repeat code, create hooks/utilities
- **Scalability** - Write code that's easy to extend
- **Clean Architecture** - Changes to one layer shouldn't break others
- **Short Files** - Keep files concise and focused (easier to work with AI assistants)
- **No Summary Files** - Don't create refactoring summaries, migration docs, or similar documentation files unless explicitly requested (saves tokens)

---

## Current Technical Stack

### **Frontend**
- React 19.2.1 (Create React App)
- Custom hooks for video playback and swipe gestures
- Context API for state management
- CSS for styling

### **Backend**
- Node.js + Express
- ES6 Modules (type: "module")
- JSON file storage (temporary, for MVP only)
- Video processing: yt-dlp, ytdl-core, fluent-ffmpeg

### **Current Limitations (By Design)**
- ❌ No real authentication (just localStorage)
- ❌ No database (using JSON files)
- ❌ No cloud storage (local file system)
- ❌ No input validation/sanitization
- ❌ No security headers
- ❌ No HTTPS
- ⚠️ **These are intentional for MVP speed - will be fixed before production**

---

## Technical Debt (To Fix Before Production)

### 🔒 Security (Critical)
- [ ] Implement real authentication (Firebase Auth, Auth0, or Supabase)
- [ ] Add password hashing (bcrypt)
- [ ] Add input validation & sanitization
- [ ] Add security headers (helmet.js)
- [ ] Add rate limiting
- [ ] Enforce HTTPS
- [ ] Add CORS configuration for production
- [ ] Validate file uploads

### 🗄️ Data Storage
- [ ] Migrate from JSON files to PostgreSQL or MongoDB
- [ ] Implement proper transactions
- [ ] Add data integrity constraints
- [ ] Set up database backups

### ☁️ Cloud Infrastructure
- [ ] Move video storage to cloud (AWS S3, Cloudflare R2, or Supabase Storage)
- [ ] Add CDN for video delivery
- [ ] Implement video transcoding pipeline
- [ ] Add thumbnail generation

### 📱 Mobile Strategy (Choose One)
- [ ] **Option A**: Make it a Progressive Web App (PWA) - quickest
- [ ] **Option B**: Use Capacitor to wrap React app as native app - easy
- [ ] **Option C**: Migrate to React Native - best UX, most work

### 🛠️ DevOps
- [ ] Set up proper error logging (Sentry, LogRocket)
- [ ] Add monitoring (Datadog, New Relic)
- [ ] Set up CI/CD pipeline
- [ ] Add automated testing
- [ ] Set up staging environment

---

## Development Plan

### **Phase 1: MVP Development** (Current Phase)
**Goal**: Build and validate core features with clean architecture

**Focus**:
- ✅ Complete core features (mostly done)
- 🔄 Test on mobile browsers
- 🔄 Refine UX based on testing
- 🔄 Document API and architecture

**NOT doing yet**:
- ❌ Production security
- ❌ Cloud infrastructure
- ❌ Advanced features (chat, etc.)
- ❌ Real user onboarding

### **Phase 2: Production Preparation** (Future)
**Goal**: Make it secure and scalable

**Tasks**:
1. Add authentication system
2. Migrate to database
3. Move to cloud storage
4. Add security measures
5. Set up monitoring & logging
6. Deploy to production infrastructure

### **Phase 3: Mobile Deployment** (Future)
**Goal**: Get into app stores

**Tasks**:
1. Decide on mobile strategy (PWA/Capacitor/React Native)
2. Implement chosen approach
3. Test on real devices
4. Submit to app stores

### **Phase 4: Feature Expansion** (Future)
**Goal**: Add advanced features

**Potential Features**:
- Chat/comments
- User profiles with portfolios
- Advanced analytics
- Push notifications
- Content moderation tools
- Monetization features

---

## Recent Changes (Qwen AI Session)

### What Qwen Changed
1. **Simplified company selection** in `UploadScreen.js`:
   - Changed from dropdown (fetching companies from API) to free-text input
   - Admins now manually type company name instead of selecting from list
   - Removed dependency on `fetchUsers` API call
   - Reduced code complexity (~30 lines removed)

### Previous Work (Gemini AI Session)
- Implemented user permissions system
- Added upload page and functionality
- Built role-based access control

---

## Key Decisions & Rationale

### Why React instead of Next.js?
- **React**: More flexible, easier to learn, separate frontend/backend
- **Next.js**: Better SEO, built-in security, but steeper learning curve
- **Decision**: React is fine for this use case (video feed doesn't need SEO)
- **Note**: Next.js also can't create native mobile apps (same limitation)

### Why JSON files instead of database?
- **Speed**: Faster to prototype
- **Simplicity**: No setup required
- **Swappable**: Architecture makes migration easy later
- **Risk**: Acceptable for MVP (no real users yet)

### Why local storage instead of cloud?
- **Cost**: Free for development
- **Speed**: Faster iteration
- **Swappable**: Storage layer is abstracted
- **Risk**: Acceptable for MVP

---

## Important Notes for Future AI Sessions

1. **This is the developer's FIRST JavaScript project** - they're learning while building
2. **Architecture is intentionally clean** - makes future upgrades easy
3. **Current stack is React (web), NOT React Native** - mobile strategy TBD
4. **Security gaps are intentional** - will be fixed before production
5. **No real users yet** - this is development/testing only
6. **Focus on finishing MVP features** - don't over-engineer yet

---

## Questions to Ask When Resuming Development

1. What MVP features are still incomplete?
2. Have you tested on mobile browsers yet?
3. What's blocking you right now?
4. Are you ready to start Phase 2 (production prep)?
5. Do you need help with any specific component/feature?

---

## Useful Commands

```bash
# Start backend
npm start              # Production mode
npm run dev           # Development mode (nodemon)

# Start frontend
cd frontend
npm start             # Development server

# Run both (in separate terminals)
npm start             # Terminal 1: Backend
npm run frontend      # Terminal 2: Frontend (from root)
```

---

**Last Updated**: 2025-12-12  
**Current Status**: MVP Development Phase  
**Next Milestone**: Complete core features, test on mobile browsers

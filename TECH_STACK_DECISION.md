# Tech Stack Decision: Next.js + Supabase

## Why This Stack?

**Chosen Stack:** Next.js (Frontend) + Supabase (Backend) + Capacitor (Mobile)

---

## The Problem

Building StockTV requires:
1. **Security** - XSS/CSRF prevention, auth, HTTPS
2. **Cross-platform** - Web + iOS + Android from one codebase
3. **Backend** - Database, file storage, authentication
4. **Cost** - Free for MVP, affordable when scaling

---

## Why Next.js?

### Built-in Security (Critical for You)
- ✅ **XSS Prevention** - Automatic output escaping
- ✅ **CSRF Protection** - Built-in token handling
- ✅ **Security Headers** - CSP, X-Frame-Options, etc. (automatic)
- ✅ **HTTPS** - Enforced on Vercel deployment
- ✅ **Input Sanitization** - Helper functions included

**Compare to React (CRA):**
- ❌ No built-in security
- ❌ You'd have to implement everything yourself
- ❌ Easy to make mistakes

### Other Benefits
- ✅ **SEO** - Server-side rendering (good for marketing pages)
- ✅ **Performance** - Automatic code splitting, image optimization
- ✅ **API Routes** - Backend endpoints without separate server
- ✅ **File-based routing** - Simpler than React Router
- ✅ **TypeScript** - Catch errors before runtime

---

## Why Supabase?

### All-in-One Backend
- ✅ **PostgreSQL** - Industry-standard database (not proprietary)
- ✅ **Storage** - S3-compatible file storage (videos, thumbnails)
- ✅ **Auth** - Login/signup with JWT, password hashing, email verification
- ✅ **REST API** - Auto-generated from your database schema
- ✅ **Row Level Security** - Database-enforced permissions
- ✅ **Realtime** - WebSocket subscriptions (future features)

**Compare to Building Yourself:**
- ❌ You'd need: Postgres + S3/MinIO + Auth0/Clerk + Express API
- ❌ More services to manage
- ❌ More code to write
- ❌ More security risks

### Open Source (Not Locked In)
- ✅ Can run locally (Docker)
- ✅ Can self-host later
- ✅ Can migrate to other Postgres hosting
- ✅ Standard SQL (portable)
- ✅ S3-compatible storage (portable)

**Compare to Firebase:**
- ❌ Firebase = Proprietary NoSQL (hard to migrate)
- ❌ Vendor lock-in
- ✅ Supabase = Standard PostgreSQL (easy to migrate)

---

## Why NOT Other Options?

### React Native + Expo
- ✅ True native apps (best performance)
- ❌ Complete rewrite of your code
- ❌ Steeper learning curve
- ❌ No built-in security (you'd still need to code it)
- ❌ More complex deployment

### Self-Managed (Postgres + MinIO + Auth0)
- ✅ Maximum control
- ✅ No vendor dependency
- ❌ You manage security yourself
- ❌ You manage backups yourself
- ❌ You manage scaling yourself
- ❌ More services to configure

**Verdict:** Too complex for MVP, can migrate later

### WordPress/PHP
- ✅ Your hosting (SherlockHost) supports it
- ❌ Not suitable for video feed app
- ❌ Poor performance for real-time features
- ❌ Not modern tech stack

**Verdict:** Wrong tool for the job

---

## Cost Comparison

### Next.js + Supabase (Chosen)
```
Development:     $0 (local)
MVP (0-1k users): $0 (free tiers)
Growth (10k):    $25/month
Scale (100k):    $100/month
```

### React Native + Firebase
```
Development:     $0
MVP:             $0 (free tier)
Growth:          $25-50/month
Scale:           $200+/month (Firebase expensive at scale)
```

### Self-Managed VPS
```
Development:     $0 (local)
MVP:             $5-20/month (VPS)
Growth:          $20-50/month
Scale:           $100-500/month (need to manage yourself)
```

---

## Mobile Strategy

### Next.js + Capacitor
- ✅ Wraps web app as native apps
- ✅ One codebase (Next.js)
- ✅ Access to native features (camera, push notifications)
- ✅ Easy to maintain
- ⚠️ Not "true native" (but good enough for video feed)

**Compare to React Native:**
- React Native = True native (better performance)
- Capacitor = Hybrid (easier, one codebase)

**For a video feed app:** Capacitor is sufficient

---

## Testing Strategy

### Local Development
```
supabase start  → Local Postgres + Storage + Auth (Docker)
npm run dev     → Next.js dev server
```
- ✅ Test everything locally for FREE
- ✅ Same environment as production
- ✅ No internet required

### Production
```
Vercel          → Next.js hosting (FREE tier)
Supabase Cloud  → Backend (FREE tier)
```
- ✅ Same code, different config
- ✅ Deploy in minutes
- ✅ Automatic HTTPS, CDN, deployments

---

## Legal Compliance (Stock Advice Liability)

### Feature Hiding System
- ✅ Hide social features (likes, profiles, follows)
- ✅ Show only: Video feed + "Go to Website" button
- ✅ Avoid "social network" classification
- ✅ Reduce liability for stock advice

**Later:** Re-enable features when ready (just flip flags)

---

## Bottom Line

**Next.js + Supabase gives you:**
1. Security without coding it yourself
2. Backend without managing servers
3. Free for MVP
4. Can test locally
5. Not locked in (open source)
6. Easy to add mobile apps later
7. Scales when you need it

**Perfect for:** need security, want to ship fast

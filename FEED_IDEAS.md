# Smart Feed - Core Ideas

## The Problem
Users see the same videos repeatedly. Feed needs to be smart and performant.

## ✅ Current Implementation (v1.0)

### Smart Feed Algorithm - IMPLEMENTED
**Priority-based scoring system:**

```
Total Score = (View Score × 1000) + (Recency Score × 100) + (Follow Score × 10)
```

**View Score (Highest Priority):**
- Never viewed: 1000 pts
- Viewed >7 days ago: 700 pts
- Viewed >3 days ago: 500 pts
- Viewed >1 day ago: 300 pts
- Viewed today: 100 pts

**Recency Score (Medium Priority):**
- Posted today: 100 pts
- Posted this week: 70 pts
- Posted this month: 40 pts
- Older: 10 pts

**Follow Score (Lowest Priority):**
- Followed company: 10 pts
- Not followed: 0 pts

**Implementation:**
- SQL function: `get_smart_feed()` in Supabase
- Service: `videoService.getVideos()` uses RPC call
- Pagination: 4 videos per page (configurable)
- Infinite scroll: Auto-loads next page near end

## 🚀 Future Enhancements

### 1. Watch Percentage Tracking
Track how much of each video users watch:
- Add `watch_percentage` to `user_video_interactions`
- Videos watched >80% = higher engagement score
- Videos skipped quickly = lower score
- Use in algorithm: `Engagement Score × 50`

### 2. Advanced Engagement Metrics
- **Likes weight:** Liked videos boost similar content
- **Shares:** Shared videos = high quality signal
- **Saves:** Saved for later = interested but not ready
- **Replays:** Watched multiple times = very engaging

### 3. Company Follow Priority Adjustment
Current: Follow score is lowest priority (10 pts)
Options:
- **Medium priority:** `Follow Score × 500` (between view and recency)
- **High priority:** `Follow Score × 1000` (equal to recency)
- **User preference:** Let users choose priority level

### 4. Time-of-Day Personalization
- Track when users typically watch
- Boost content types popular at current time
- Morning: News/updates, Evening: Entertainment

### 5. Content Similarity
- Tag videos by topic/category
- If user watches tech videos, boost similar content
- Collaborative filtering: "Users who watched X also watched Y"

### 6. Freshness Decay
- Older videos gradually lose recency score
- Prevents stale content from dominating
- Balance discovery with freshness

### 7. Diversity Injection
- Ensure feed isn't all from same company
- Mix of followed and discovery content
- Prevent echo chamber effect

### 8. AI/ML Recommendation Model (Long-term)
**Current:** Rule-based scoring system (fast, deterministic, good enough)

**Future:** Machine learning model that learns user preferences:
- **Collaborative filtering:** "Users like you also watched..."
- **Content embeddings:** Understand video similarity beyond tags
- **Deep learning:** Neural network predicts engagement probability
- **A/B testing:** Compare ML model vs rule-based
- **Hybrid approach:** ML + rules for best of both worlds

**Why later?**
- Need more data (user interactions, watch patterns)
- Current rule-based system is fast and transparent
- ML adds complexity - only worth it at scale
- Can iterate on rules first, then add ML layer

**When to switch:**
- 10,000+ users with diverse viewing patterns
- Enough data to train meaningful models
- Performance bottlenecks with current approach
- Need for hyper-personalization

## Data Structure

```
users.json                        ✅ Implemented
companies.json                    ✅ Implemented
videos.json                       ✅ Implemented (with company_id)
user_video_interactions.json      ✅ Implemented (views, likes, saves)
user_company_interactions.json    ✅ Implemented (follows)
```

**Future additions:**
- `watch_percentage` column
- `engagement_score` column
- `video_categories` table
- `user_preferences` table

## Key Insights

### Current (v1.0)
✅ One `user_video_interactions` table tracks everything
✅ Scoring system prioritizes fresh, unwatched content
✅ Prevents seeing same videos on app restart
✅ Simple, efficient, single SQL query

### Future
🚀 Add engagement metrics for better personalization
🚀 Balance discovery with personalization
🚀 User control over algorithm priorities
🚀 Content diversity and freshness

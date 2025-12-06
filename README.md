# StockTV MVP – Minimal Flexible Architecture

## Overview

StockTV MVP shows a vertical feed of local short videos with metadata (title, company, date).

No likes, saving, chat, or portfolio yet.

Everything is modular and abstracted so you can later add:

- Services that process jobs from a queue
- Real storage / cloud / auth
- Additional tabs

## Core Principles for Flexibility

### Service Layer for Future Jobs
Every "service" you add in the future just pulls a job from a queue and uses an existing tool.
Tools are stateless: they operate on input/output, without worrying about where it came from.

### Storage Abstraction
- Now: local videos/ folder
- Later: cloud storage
- Frontend only calls getVideos() from a service layer → implementation can change without touching frontend

### API Abstraction
- Frontend calls a single service function like api.getVideos()
- Backend can swap the internal logic without affecting the UI

### Component Modularity
- Each screen/component does one thing
- Adding new features doesn't require rewriting existing code

## Project Structure

```
stocktv/
├─ frontend/
│  ├─ components/
│  │  └─ VideoCard.js          # Shows mp4 + metadata
│  ├─ screens/
│  │  └─ FeedScreen.js         # Vertical feed
│  ├─ services/
│  │  └─ api.js                # Calls backend getVideos
│  └─ App.js
├─ backend/
│  ├─ controllers/
│  │  └─ videoController.js    # Only GET /videos
│  ├─ services/
│  │  └─ videoService.js       # Abstraction: getVideos() reads local folder
│  ├─ storage/
│  │  └─ localStorage.js       # Tool to load mp4 paths + metadata
│  └─ app.js
├─ videos/
│  └─ example.mp4
└─ README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Place your video files in the `videos/` directory (MP4 format recommended)

3. Start the backend server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

4. Start the frontend separately (in a different terminal):
   ```bash
   cd frontend
   # If you're using Create React App:
   npm install
   npm start
   ```

## Frontend Components

### FeedScreen.js
- Fetches videos using api.getVideos()
- Renders vertical feed of VideoCard components
- Autoplay on scroll

### VideoCard.js
- Plays mp4 videos
- Displays title, company, date
- Handles video playback controls

### api.js
- Abstracts the API call to the backend
- Easy to swap for cloud storage or DB calls later

## Backend Components

### app.js
Main Express server that serves the API and static video files

### videoController.js
Handles HTTP requests and responses for the /videos endpoint

### videoService.js
Provides business logic abstraction layer

### localStorage.js
Scans the local 'videos/' folder and returns metadata for each video file

## Adding Future Services

You can create new tools (stateless processors) like VideoTranscoder or ThumbnailGenerator.

Create a service that:
1. Reads a job from a queue
2. Passes the input to the tool
3. Saves the result (local or cloud)

Because tools are separate from services, adding new services is just wiring a new queue job → tool → storage pipeline.

## Architecture Flow
```
[Start App] --> [Frontend calls api.getVideos()]
[Frontend calls api.getVideos()] --> [Backend videoController.fetchVideos()]
[Backend videoController.fetchVideos()] --> [videoService.getVideos()]
[videoService.getVideos()] --> [localStorage.listVideos() reads local folder]
[localStorage.listVideos() reads local folder] --> [Return metadata to frontend]
[Return metadata to frontend] --> [FeedScreen renders VideoCard list]
[FeedScreen renders VideoCard list] --> {User scrolls?}
{User scrolls?} -- Yes --> [Autoplay visible video]
{User scrolls?} -- No --> End
```

All other features (likes, chat, portfolio, cloud storage) plug into this flow without touching existing code.

This setup is:
✅ Ultra simple (just feed + video playback)
✅ Fully flexible (abstracted storage and services)
✅ Future-ready (can add queues, tools, cloud, auth later)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store likes data
const likesFilePath = path.join(__dirname, '../data/likes.json');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize likes data file if it doesn't exist
if (!fs.existsSync(likesFilePath)) {
  fs.writeFileSync(likesFilePath, JSON.stringify({}));
}

export function getLikes() {
  try {
    const data = fs.readFileSync(likesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading likes data:', error);
    return {};
  }
}

export function saveLikes(likesData) {
  try {
    // Convert Sets to Arrays for JSON serialization
    const serializableData = {};
    for (const [videoId, likers] of Object.entries(likesData)) {
      serializableData[videoId] = Array.from(likers);
    }
    fs.writeFileSync(likesFilePath, JSON.stringify(serializableData, null, 2));
  } catch (error) {
    console.error('Error saving likes data:', error);
  }
}

export function addLike(videoId, userId) {
  const likesData = getLikes();
  if (!likesData[videoId]) {
    likesData[videoId] = [];
  }
  if (!likesData[videoId].includes(userId)) {
    likesData[videoId].push(userId);
    saveLikes(likesData);
  }
}

export function removeLike(videoId, userId) {
  const likesData = getLikes();
  if (likesData[videoId]) {
    likesData[videoId] = likesData[videoId].filter(id => id !== userId);
    if (likesData[videoId].length === 0) {
      delete likesData[videoId];
    }
    saveLikes(likesData);
  }
}

export function getLikers(videoId) {
  const likesData = getLikes();
  return new Set(likesData[videoId] || []);
}

export function getUserLikedVideos(userId) {
  const likesData = getLikes();
  const likedVideos = [];

  for (const [videoId, likers] of Object.entries(likesData)) {
    if (likers.includes(userId)) {
      const likeCount = likers.length;
      likedVideos.push({
        videoId,
        likeCount
      });
    }
  }

  return likedVideos;
}
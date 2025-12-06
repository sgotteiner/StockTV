// LikeController.js - Business logic for like operations

import { getLikers, addLike, removeLike, getUserLikedVideos, getLikes } from '../storage/likeStorage.js';

// Get like count for a video
export async function getVideoLikeCount(videoId) {
  const likers = getLikers(videoId);
  return { videoId, likeCount: likers.size, likedByCurrentUser: false };
}

// Like a video
export async function likeVideo(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  addLike(videoId, userId);

  const likers = getLikers(videoId);
  return {
    videoId,
    userId,
    likeCount: likers.size,
    success: true
  };
}

// Unlike a video
export async function unlikeVideo(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  removeLike(videoId, userId);

  const likers = getLikers(videoId);
  return {
    videoId,
    userId,
    likeCount: likers.size,
    success: true
  };
}

// Get user's liked videos
export async function getUserLikedVideosList(userId) {
  const likedVideos = getUserLikedVideos(userId);
  return { userId, likedVideos };
}
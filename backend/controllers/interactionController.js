// InteractionController.js - Business logic for user-video interactions
// Handles likes, views, and other interaction operations
// Uses consolidated user_video_interactions storage

import * as interactionStorage from '../storage/interactionStorage.js';

// Get like count for a video
export async function getVideoLikeCount(videoId) {
  const likeCount = interactionStorage.getVideoLikeCount(videoId);
  return { videoId, likeCount, likedByCurrentUser: false };
}

// Like a video
export async function likeVideo(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  interactionStorage.likeVideo(userId, videoId);
  const likeCount = interactionStorage.getVideoLikeCount(videoId);

  return {
    videoId,
    userId,
    likeCount,
    success: true
  };
}

// Unlike a video
export async function unlikeVideo(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  interactionStorage.unlikeVideo(userId, videoId);
  const likeCount = interactionStorage.getVideoLikeCount(videoId);

  return {
    videoId,
    userId,
    likeCount,
    success: true
  };
}

// Get user's liked videos
export async function getUserLikedVideosList(userId) {
  const likedVideos = interactionStorage.getUserLikedVideos(userId);
  return { userId, likedVideos };
}

// Record video view
export async function recordVideoView(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const interaction = await interactionStorage.recordView(userId, videoId, { watch_percentage: 100 }); // Simplified
  return {
    videoId,
    userId,
    success: true
  };
}
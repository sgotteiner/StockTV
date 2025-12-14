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
  // userId can be null for guest users
  if (!userId) {
    return { message: 'View not recorded (guest user)' };
  }

  interactionStorage.recordView(userId, videoId);
  return { message: 'View recorded successfully' };
}

// Save a video
export async function saveVideo(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  interactionStorage.saveVideo(userId, videoId);
  return { message: 'Video saved successfully', saved: true };
}

// Unsave a video
export async function unsaveVideo(videoId, userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  interactionStorage.unsaveVideo(userId, videoId);
  return { message: 'Video unsaved successfully', saved: false };
}

// Get user's saved videos
export async function getUserSavedVideos(userId) {
  const savedVideos = interactionStorage.getUserSavedVideos(userId);
  return { savedVideos };
}
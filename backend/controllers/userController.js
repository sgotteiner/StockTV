// UserController.js - Business logic for user operations

import {
  getUsers,
  addUser,
  getUserById,
  getUserByEmail,
  getUserByName,
  updateUser as updateUserInStorage,
  removeUser,
  getAllUsers
} from '../storage/userStorage.js';

/**
 * Register a new user
 */
export async function registerUser(userData) {
  const { email, password, name } = userData;

  if (!email || !password || !name) {
    throw new Error('Email, password, and name are required');
  }

  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const existingName = getUserByName(name);
  if (existingName) {
    throw new Error('User with this name already exists');
  }

  // Create new user
  const userId = Date.now().toString(); // Simple ID generation
  // Check if this is the first user or specific email to make master_admin
  const isMasterAdmin = email.toLowerCase() === 'stocktv@gmail.com';

  const newUser = {
    id: userId,
    email,
    name,
    password, // In a real app, this should be hashed
    role: isMasterAdmin ? 'master_admin' : 'user', // Default role
    createdAt: new Date().toISOString(),
    watchHistory: [],
    savedVideos: [],
    likedVideos: [] // Track liked videos on the user
  };

  addUser(newUser);

  // Return the user object (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Login user
 */
export async function loginUser(credentials) {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Find user by email
  const foundUser = getUserByEmail(email);

  if (!foundUser || foundUser.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Return the user object (without password)
  const { password: _, ...userWithoutPassword } = foundUser;
  return userWithoutPassword;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId) {
  const user = getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Return the user object (without password)
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, profileData) {
  const { name, email } = profileData;

  const user = getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Update fields if provided
  const updatedUser = { ...user };

  if (name && name !== user.name) {
    const existingName = getUserByName(name);
    if (existingName) {
      throw new Error('Username is already taken');
    }
    updatedUser.name = name;
  }

  if (email && email !== user.email) {
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email is already taken by another user');
    }
    updatedUser.email = email;
  }

  const savedUser = updateUserInStorage(userId, updatedUser);

  // Return the updated user object (without password)
  const { password: _, ...userWithoutPassword } = savedUser;
  return userWithoutPassword;
}

/**
 * List all users (Admin only)
 */
export function listAllUsers() {
  return getAllUsers().map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
}

/**
 * Update user role (Admin only)
 */
export function updateUserRole(userId, newRole) {
  const validRoles = ['master_admin', 'admin', 'company', 'user'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }

  const user = getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = updateUserInStorage(userId, { role: newRole });
  const { password, ...safeUser } = updatedUser;
  return safeUser;
}
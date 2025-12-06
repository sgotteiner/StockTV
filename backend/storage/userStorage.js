import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store users data
const usersFilePath = path.join(__dirname, '../data/users.json');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users data file if it doesn't exist
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify({}));
}

export function getUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users data:', error);
    return {};
  }
}

export function saveUsers(usersData) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

export function addUser(user) {
  const usersData = getUsers();
  usersData[user.id] = user;
  saveUsers(usersData);
}

export function getUserById(userId) {
  const usersData = getUsers();
  return usersData[userId] || null;
}

export function getUserByEmail(email) {
  const usersData = getUsers();
  for (const userId in usersData) {
    if (usersData[userId].email === email) {
      return usersData[userId];
    }
  }
  return null;
}

export function updateUser(userId, updatedUser) {
  const usersData = getUsers();
  if (usersData[userId]) {
    // Preserve the password if not provided in the update
    const currentPassword = usersData[userId].password;
    if (!updatedUser.password) {
      updatedUser.password = currentPassword;
    }
    usersData[userId] = { ...usersData[userId], ...updatedUser };
    saveUsers(usersData);
    return usersData[userId];
  }
  return null;
}

export function removeUser(userId) {
  const usersData = getUsers();
  if (usersData[userId]) {
    delete usersData[userId];
    saveUsers(usersData);
  }
}
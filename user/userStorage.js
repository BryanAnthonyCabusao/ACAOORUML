import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'user_data';
const LOGGED_IN_USER_KEY = 'logged_in_user';

// Save user (identifier + password)
export const saveUser = async (identifier, password) => {
  if (!identifier || !password) {
    console.error('saveUser: identifier or password missing');
    return false;
  }
  try {
    const users = await getAllUsers();
    users[identifier] = password;
    await AsyncStorage.multiSet([
      [USERS_KEY, JSON.stringify(users)],
      [LOGGED_IN_USER_KEY, identifier], // Automatically log in after registering
    ]);
    console.log(`User saved: ${identifier}`);
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

// Get user password by identifier (username or email)
export const getUser = async (identifier) => {
  if (!identifier) {
    console.error('getUser: identifier missing');
    return null;
  }
  try {
    const users = await getAllUsers();
    const password = users[identifier] || null;
    console.log(`getUser: ${identifier} found?`, password !== null);
    return password;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Get all users (private helper)
const getAllUsers = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_KEY);
    const users = jsonValue ? JSON.parse(jsonValue) : {};
    console.log('getAllUsers:', users);
    return users;
  } catch (error) {
    console.error('Error reading users:', error);
    return {};
  }
};

// Set current logged-in user explicitly
export const setLoggedInUser = async (identifier) => {
  if (!identifier) {
    console.error('setLoggedInUser: identifier missing');
    return false;
  }
  try {
    await AsyncStorage.setItem(LOGGED_IN_USER_KEY, identifier);
    console.log(`Logged in user set: ${identifier}`);
    return true;
  } catch (error) {
    console.error('Error setting logged-in user:', error);
    return false;
  }
};

// Get current logged-in user
export const getLoggedInUser = async () => {
  try {
    const identifier = await AsyncStorage.getItem(LOGGED_IN_USER_KEY);
    console.log('getLoggedInUser:', identifier);
    return identifier;
  } catch (error) {
    console.error('Error getting logged-in user:', error);
    return null;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(LOGGED_IN_USER_KEY);
    console.log('User logged out');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

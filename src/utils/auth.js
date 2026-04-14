import { getUsers, addUser } from './storage.js';

const SESSION_KEY = 'writespace_session';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION = {
  userId: 'admin',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

/**
 * Get the current session from localStorage.
 * @returns {Object|null} The session object or null if not logged in
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to read session from localStorage:', e);
    return null;
  }
}

/**
 * Set the session in localStorage.
 * @param {Object} session - The session object to store
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to write session to localStorage:', e);
  }
}

/**
 * Clear the session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session from localStorage:', e);
  }
}

/**
 * Attempt to log in with the given credentials.
 * Checks hard-coded admin credentials first, then localStorage users.
 * @param {string} username - The username to log in with
 * @param {string} password - The password to log in with
 * @returns {Object|null} The session object on success, or null on failure
 */
export function login(username, password) {
  try {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
      setSession(ADMIN_SESSION);
      return ADMIN_SESSION;
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    );

    if (user) {
      const session = {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      };
      setSession(session);
      return session;
    }

    return null;
  } catch (e) {
    console.error('Login failed:', e);
    return null;
  }
}

/**
 * Register a new user. Validates username uniqueness against existing users and admin.
 * @param {Object} user - The user registration data
 * @param {string} user.displayName - The display name
 * @param {string} user.username - The desired username
 * @param {string} user.password - The password
 * @returns {Object|null} The session object on success, or null on failure
 */
export function register(user) {
  try {
    const trimmedUsername = user.username.trim();
    const trimmedDisplayName = user.displayName.trim();
    const trimmedPassword = user.password.trim();

    if (!trimmedUsername || !trimmedDisplayName || !trimmedPassword) {
      return null;
    }

    if (trimmedUsername === ADMIN_USERNAME) {
      return null;
    }

    const users = getUsers();
    const exists = users.some((u) => u.username === trimmedUsername);
    if (exists) {
      return null;
    }

    const newUser = addUser({
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: 'user',
    });

    if (!newUser) {
      return null;
    }

    const session = {
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
    };
    setSession(session);
    return session;
  } catch (e) {
    console.error('Registration failed:', e);
    return null;
  }
}

/**
 * Log out the current user by clearing the session.
 */
export function logout() {
  clearSession();
}
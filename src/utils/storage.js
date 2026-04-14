const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Get all posts from localStorage.
 * @returns {Array<Object>} Array of post objects
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read posts from localStorage:', e);
    return [];
  }
}

/**
 * Set the entire posts array in localStorage.
 * @param {Array<Object>} posts - Array of post objects
 */
export function setPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to write posts to localStorage:', e);
  }
}

/**
 * Add a new post to localStorage.
 * @param {Object} post - Post object (id, title, content, createdAt, authorId, authorName will be set)
 */
export function addPost(post) {
  try {
    const posts = getPosts();
    const newPost = {
      id: crypto.randomUUID(),
      title: post.title,
      content: post.content,
      createdAt: new Date().toISOString(),
      authorId: post.authorId,
      authorName: post.authorName,
    };
    posts.push(newPost);
    setPosts(posts);
    return newPost;
  } catch (e) {
    console.error('Failed to add post to localStorage:', e);
    return null;
  }
}

/**
 * Update an existing post in localStorage.
 * @param {Object} post - Post object with id, title, and content
 */
export function updatePost(post) {
  try {
    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      return null;
    }
    posts[index] = { ...posts[index], title: post.title, content: post.content };
    setPosts(posts);
    return posts[index];
  } catch (e) {
    console.error('Failed to update post in localStorage:', e);
    return null;
  }
}

/**
 * Remove a post by ID from localStorage.
 * @param {string} postId - The ID of the post to remove
 */
export function removePost(postId) {
  try {
    const posts = getPosts();
    const filtered = posts.filter((p) => p.id !== postId);
    setPosts(filtered);
  } catch (e) {
    console.error('Failed to remove post from localStorage:', e);
  }
}

/**
 * Get all users from localStorage.
 * @returns {Array<Object>} Array of user objects
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read users from localStorage:', e);
    return [];
  }
}

/**
 * Set the entire users array in localStorage.
 * @param {Array<Object>} users - Array of user objects
 */
export function setUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to write users to localStorage:', e);
  }
}

/**
 * Add a new user to localStorage.
 * @param {Object} user - User object (displayName, username, password, role)
 * @returns {Object|null} The created user or null on failure
 */
export function addUser(user) {
  try {
    const users = getUsers();
    const newUser = {
      id: crypto.randomUUID(),
      displayName: user.displayName,
      username: user.username,
      password: user.password,
      role: user.role || 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setUsers(users);
    return newUser;
  } catch (e) {
    console.error('Failed to add user to localStorage:', e);
    return null;
  }
}

/**
 * Remove a user by ID from localStorage.
 * @param {string} userId - The ID of the user to remove
 */
export function removeUser(userId) {
  try {
    const users = getUsers();
    const filtered = users.filter((u) => u.id !== userId);
    setUsers(filtered);
  } catch (e) {
    console.error('Failed to remove user from localStorage:', e);
  }
}
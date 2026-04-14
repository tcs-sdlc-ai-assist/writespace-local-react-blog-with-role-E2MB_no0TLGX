import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPosts,
  setPosts,
  addPost,
  updatePost,
  removePost,
  getUsers,
  setUsers,
  addUser,
  removeUser,
} from './storage';

const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getPosts', () => {
  it('returns an empty array when no posts exist in localStorage', () => {
    const result = getPosts();
    expect(result).toEqual([]);
  });

  it('returns parsed posts from localStorage', () => {
    const posts = [
      { id: '1', title: 'Post 1', content: 'Content 1', authorId: 'u1', authorName: 'User 1', createdAt: '2025-01-01T00:00:00.000Z' },
      { id: '2', title: 'Post 2', content: 'Content 2', authorId: 'u2', authorName: 'User 2', createdAt: '2025-01-02T00:00:00.000Z' },
    ];
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    const result = getPosts();
    expect(result).toEqual(posts);
  });

  it('returns an empty array when localStorage contains corrupted JSON', () => {
    localStorage.setItem(POSTS_KEY, '{not valid json!!!');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = getPosts();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('setPosts', () => {
  it('stores posts array in localStorage', () => {
    const posts = [{ id: '1', title: 'Test' }];
    setPosts(posts);
    const stored = JSON.parse(localStorage.getItem(POSTS_KEY));
    expect(stored).toEqual(posts);
  });

  it('handles localStorage write failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    setPosts([{ id: '1' }]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to write posts to localStorage:',
      expect.any(Error)
    );
  });
});

describe('addPost', () => {
  it('adds a new post with generated id and createdAt', () => {
    const mockId = 'test-uuid-1234';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockId);

    const post = {
      title: 'New Post',
      content: 'New Content',
      authorId: 'author-1',
      authorName: 'Author One',
    };

    const result = addPost(post);

    expect(result).not.toBeNull();
    expect(result.id).toBe(mockId);
    expect(result.title).toBe('New Post');
    expect(result.content).toBe('New Content');
    expect(result.authorId).toBe('author-1');
    expect(result.authorName).toBe('Author One');
    expect(result.createdAt).toBeDefined();
    expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);

    const stored = getPosts();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(mockId);
  });

  it('appends to existing posts', () => {
    const existing = [{ id: 'existing-1', title: 'Existing', content: 'Content', authorId: 'a1', authorName: 'A1', createdAt: '2025-01-01T00:00:00.000Z' }];
    setPosts(existing);

    vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-uuid');

    addPost({ title: 'Second', content: 'Second Content', authorId: 'a2', authorName: 'A2' });

    const stored = getPosts();
    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe('existing-1');
    expect(stored[1].id).toBe('new-uuid');
  });

  it('returns null when localStorage write fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    const result = addPost({ title: 'Fail', content: 'Fail', authorId: 'a1', authorName: 'A1' });
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('updatePost', () => {
  it('updates an existing post by id', () => {
    const posts = [
      { id: 'p1', title: 'Original', content: 'Original Content', authorId: 'a1', authorName: 'A1', createdAt: '2025-01-01T00:00:00.000Z' },
    ];
    setPosts(posts);

    const result = updatePost({ id: 'p1', title: 'Updated', content: 'Updated Content' });

    expect(result).not.toBeNull();
    expect(result.title).toBe('Updated');
    expect(result.content).toBe('Updated Content');
    expect(result.authorId).toBe('a1');
    expect(result.createdAt).toBe('2025-01-01T00:00:00.000Z');

    const stored = getPosts();
    expect(stored[0].title).toBe('Updated');
  });

  it('returns null when post id is not found', () => {
    setPosts([{ id: 'p1', title: 'Existing', content: 'Content' }]);

    const result = updatePost({ id: 'nonexistent', title: 'Nope', content: 'Nope' });
    expect(result).toBeNull();
  });

  it('returns null when localStorage read fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    const result = updatePost({ id: 'p1', title: 'Fail', content: 'Fail' });
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('removePost', () => {
  it('removes a post by id', () => {
    const posts = [
      { id: 'p1', title: 'Post 1' },
      { id: 'p2', title: 'Post 2' },
    ];
    setPosts(posts);

    removePost('p1');

    const stored = getPosts();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('p2');
  });

  it('does nothing when post id does not exist', () => {
    const posts = [{ id: 'p1', title: 'Post 1' }];
    setPosts(posts);

    removePost('nonexistent');

    const stored = getPosts();
    expect(stored).toHaveLength(1);
  });

  it('handles localStorage failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    removePost('p1');
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('getUsers', () => {
  it('returns an empty array when no users exist in localStorage', () => {
    const result = getUsers();
    expect(result).toEqual([]);
  });

  it('returns parsed users from localStorage', () => {
    const users = [
      { id: 'u1', displayName: 'User 1', username: 'user1', password: 'pass1', role: 'user', createdAt: '2025-01-01T00:00:00.000Z' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const result = getUsers();
    expect(result).toEqual(users);
  });

  it('returns an empty array when localStorage contains corrupted JSON', () => {
    localStorage.setItem(USERS_KEY, 'corrupted{{{');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = getUsers();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('setUsers', () => {
  it('stores users array in localStorage', () => {
    const users = [{ id: 'u1', username: 'test' }];
    setUsers(users);
    const stored = JSON.parse(localStorage.getItem(USERS_KEY));
    expect(stored).toEqual(users);
  });

  it('handles localStorage write failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    setUsers([{ id: 'u1' }]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to write users to localStorage:',
      expect.any(Error)
    );
  });
});

describe('addUser', () => {
  it('adds a new user with generated id, createdAt, and default role', () => {
    const mockId = 'user-uuid-5678';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockId);

    const user = {
      displayName: 'Test User',
      username: 'testuser',
      password: 'securepass',
    };

    const result = addUser(user);

    expect(result).not.toBeNull();
    expect(result.id).toBe(mockId);
    expect(result.displayName).toBe('Test User');
    expect(result.username).toBe('testuser');
    expect(result.password).toBe('securepass');
    expect(result.role).toBe('user');
    expect(result.createdAt).toBeDefined();
    expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);

    const stored = getUsers();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(mockId);
  });

  it('respects a provided role', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('admin-uuid');

    const user = {
      displayName: 'Admin User',
      username: 'adminuser',
      password: 'adminpass',
      role: 'admin',
    };

    const result = addUser(user);
    expect(result.role).toBe('admin');
  });

  it('appends to existing users', () => {
    const existing = [{ id: 'u-existing', displayName: 'Existing', username: 'existing', password: 'pass', role: 'user', createdAt: '2025-01-01T00:00:00.000Z' }];
    setUsers(existing);

    vi.spyOn(crypto, 'randomUUID').mockReturnValue('u-new');

    addUser({ displayName: 'New', username: 'newuser', password: 'newpass' });

    const stored = getUsers();
    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe('u-existing');
    expect(stored[1].id).toBe('u-new');
  });

  it('returns null when localStorage fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    const result = addUser({ displayName: 'Fail', username: 'fail', password: 'fail' });
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('removeUser', () => {
  it('removes a user by id', () => {
    const users = [
      { id: 'u1', username: 'user1' },
      { id: 'u2', username: 'user2' },
    ];
    setUsers(users);

    removeUser('u1');

    const stored = getUsers();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('u2');
  });

  it('does nothing when user id does not exist', () => {
    const users = [{ id: 'u1', username: 'user1' }];
    setUsers(users);

    removeUser('nonexistent');

    const stored = getUsers();
    expect(stored).toHaveLength(1);
  });

  it('handles localStorage failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    removeUser('u1');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
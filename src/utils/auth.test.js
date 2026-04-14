import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSession,
  setSession,
  clearSession,
  login,
  register,
  logout,
} from './auth';

const SESSION_KEY = 'writespace_session';
const USERS_KEY = 'writespace_users';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getSession', () => {
  it('returns null when no session exists in localStorage', () => {
    const result = getSession();
    expect(result).toBeNull();
  });

  it('returns parsed session object from localStorage', () => {
    const session = {
      userId: 'u1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    const result = getSession();
    expect(result).toEqual(session);
  });

  it('returns null when localStorage contains corrupted JSON', () => {
    localStorage.setItem(SESSION_KEY, '{not valid json!!!');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = getSession();
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('setSession', () => {
  it('stores session object in localStorage', () => {
    const session = {
      userId: 'u1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    };
    setSession(session);
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
    expect(stored).toEqual(session);
  });

  it('handles localStorage write failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    setSession({ userId: 'u1' });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to write session to localStorage:',
      expect.any(Error)
    );
  });
});

describe('clearSession', () => {
  it('removes session from localStorage', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: 'u1' }));
    clearSession();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('does not throw when no session exists', () => {
    expect(() => clearSession()).not.toThrow();
  });

  it('handles localStorage failure gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('storage error');
    });
    clearSession();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to clear session from localStorage:',
      expect.any(Error)
    );
  });
});

describe('login', () => {
  it('logs in with hard-coded admin credentials', () => {
    const result = login('admin', 'admin123');
    expect(result).not.toBeNull();
    expect(result.userId).toBe('admin');
    expect(result.username).toBe('admin');
    expect(result.displayName).toBe('Admin');
    expect(result.role).toBe('admin');

    const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
    expect(stored).toEqual(result);
  });

  it('logs in with hard-coded admin credentials with whitespace trimmed', () => {
    const result = login('  admin  ', '  admin123  ');
    expect(result).not.toBeNull();
    expect(result.userId).toBe('admin');
    expect(result.role).toBe('admin');
  });

  it('returns null for incorrect admin password', () => {
    const result = login('admin', 'wrongpassword');
    expect(result).toBeNull();
  });

  it('logs in with a localStorage user', () => {
    const users = [
      {
        id: 'u1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'testpass',
        role: 'user',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const result = login('testuser', 'testpass');
    expect(result).not.toBeNull();
    expect(result.userId).toBe('u1');
    expect(result.username).toBe('testuser');
    expect(result.displayName).toBe('Test User');
    expect(result.role).toBe('user');

    const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
    expect(stored).toEqual(result);
  });

  it('returns null for non-existent user', () => {
    const result = login('nonexistent', 'password');
    expect(result).toBeNull();
  });

  it('returns null for correct username but wrong password', () => {
    const users = [
      {
        id: 'u1',
        displayName: 'Test User',
        username: 'testuser',
        password: 'testpass',
        role: 'user',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const result = login('testuser', 'wrongpass');
    expect(result).toBeNull();
  });

  it('returns null when localStorage read fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    const result = login('testuser', 'testpass');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('register', () => {
  it('registers a new user and returns a session', () => {
    const mockId = 'new-user-uuid';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockId);

    const result = register({
      displayName: 'New User',
      username: 'newuser',
      password: 'newpass',
    });

    expect(result).not.toBeNull();
    expect(result.userId).toBe(mockId);
    expect(result.username).toBe('newuser');
    expect(result.displayName).toBe('New User');
    expect(result.role).toBe('user');

    const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
    expect(stored).toEqual(result);

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe(mockId);
    expect(users[0].username).toBe('newuser');
  });

  it('returns null when username is "admin"', () => {
    const result = register({
      displayName: 'Sneaky Admin',
      username: 'admin',
      password: 'password',
    });
    expect(result).toBeNull();
  });

  it('returns null when username already exists', () => {
    const users = [
      {
        id: 'u1',
        displayName: 'Existing',
        username: 'existinguser',
        password: 'pass',
        role: 'user',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const result = register({
      displayName: 'Duplicate',
      username: 'existinguser',
      password: 'newpass',
    });
    expect(result).toBeNull();
  });

  it('returns null when displayName is empty', () => {
    const result = register({
      displayName: '   ',
      username: 'validuser',
      password: 'validpass',
    });
    expect(result).toBeNull();
  });

  it('returns null when username is empty', () => {
    const result = register({
      displayName: 'Valid Name',
      username: '   ',
      password: 'validpass',
    });
    expect(result).toBeNull();
  });

  it('returns null when password is empty', () => {
    const result = register({
      displayName: 'Valid Name',
      username: 'validuser',
      password: '   ',
    });
    expect(result).toBeNull();
  });

  it('trims whitespace from registration fields', () => {
    const mockId = 'trimmed-uuid';
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockId);

    const result = register({
      displayName: '  Trimmed User  ',
      username: '  trimmeduser  ',
      password: '  trimmedpass  ',
    });

    expect(result).not.toBeNull();
    expect(result.username).toBe('trimmeduser');
    expect(result.displayName).toBe('Trimmed User');

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    expect(users[0].username).toBe('trimmeduser');
    expect(users[0].displayName).toBe('Trimmed User');
    expect(users[0].password).toBe('trimmedpass');
  });

  it('returns null when localStorage fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('read error');
    });

    const result = register({
      displayName: 'Fail User',
      username: 'failuser',
      password: 'failpass',
    });
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('logout', () => {
  it('clears the session from localStorage', () => {
    const session = {
      userId: 'u1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    logout();

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('does not throw when no session exists', () => {
    expect(() => logout()).not.toThrow();
  });
});
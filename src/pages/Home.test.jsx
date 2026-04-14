import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

vi.mock('../utils/storage', () => ({
  getPosts: vi.fn(),
}));

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
}));

import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  getPosts.mockReturnValue([]);
  getSession.mockReturnValue(null);
});

describe('Home', () => {
  describe('empty state', () => {
    it('renders empty state message when there are no posts', () => {
      getPosts.mockReturnValue([]);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(/It looks like there are no blog posts to show/)
      ).toBeInTheDocument();
    });

    it('renders a "Write your first post" link in empty state', () => {
      getPosts.mockReturnValue([]);
      getSession.mockReturnValue(null);

      renderHome();

      const writeLink = screen.getByRole('link', { name: /write your first post/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveAttribute('href', '/write');
    });
  });

  describe('rendering blog cards', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'First Post',
        content: 'Content of the first post',
        createdAt: '2025-01-10T00:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p2',
        title: 'Second Post',
        content: 'Content of the second post',
        createdAt: '2025-01-12T00:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      },
    ];

    it('renders blog cards for each post', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('displays the correct post count', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByText('2 posts published')).toBeInTheDocument();
    });

    it('displays singular "post" when there is exactly one post', () => {
      getPosts.mockReturnValue([mockPosts[0]]);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByText('1 post published')).toBeInTheDocument();
    });

    it('renders author names on blog cards', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  describe('sorting newest first', () => {
    it('displays posts sorted by createdAt descending (newest first)', () => {
      const olderPost = {
        id: 'p-old',
        title: 'Older Post',
        content: 'Old content',
        createdAt: '2025-01-01T00:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      };
      const newerPost = {
        id: 'p-new',
        title: 'Newer Post',
        content: 'New content',
        createdAt: '2025-01-15T00:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      };

      getPosts.mockReturnValue([olderPost, newerPost]);
      getSession.mockReturnValue(null);

      renderHome();

      const postTitles = screen.getAllByRole('heading', { level: 2 });
      expect(postTitles[0]).toHaveTextContent('Newer Post');
      expect(postTitles[1]).toHaveTextContent('Older Post');
    });
  });

  describe('New Post button visibility', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'A Post',
        content: 'Some content',
        createdAt: '2025-01-10T00:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
    ];

    it('does not show "New Post" button when user is not logged in', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.queryByRole('link', { name: /new post/i })).not.toBeInTheDocument();
    });

    it('shows "New Post" button when user is logged in', () => {
      getPosts.mockReturnValue(mockPosts);
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderHome();

      const newPostLink = screen.getByRole('link', { name: /new post/i });
      expect(newPostLink).toBeInTheDocument();
      expect(newPostLink).toHaveAttribute('href', '/write');
    });
  });

  describe('edit icon visibility based on role/ownership', () => {
    const postByUser1 = {
      id: 'p1',
      title: 'User1 Post',
      content: 'Content by user 1',
      createdAt: '2025-01-10T00:00:00.000Z',
      authorId: 'u1',
      authorName: 'Alice',
    };

    const postByUser2 = {
      id: 'p2',
      title: 'User2 Post',
      content: 'Content by user 2',
      createdAt: '2025-01-11T00:00:00.000Z',
      authorId: 'u2',
      authorName: 'Bob',
    };

    it('shows edit icon on own post for logged-in user', () => {
      getPosts.mockReturnValue([postByUser1]);
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderHome();

      const editLink = screen.getByRole('link', { name: /edit user1 post/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/blog/p1/edit');
    });

    it('does not show edit icon on another user post for regular user', () => {
      getPosts.mockReturnValue([postByUser2]);
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderHome();

      expect(screen.queryByRole('link', { name: /edit user2 post/i })).not.toBeInTheDocument();
    });

    it('shows edit icon on all posts for admin user', () => {
      getPosts.mockReturnValue([postByUser1, postByUser2]);
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderHome();

      expect(screen.getByRole('link', { name: /edit user1 post/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /edit user2 post/i })).toBeInTheDocument();
    });

    it('does not show edit icons when user is not logged in', () => {
      getPosts.mockReturnValue([postByUser1, postByUser2]);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.queryByRole('link', { name: /edit user1 post/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /edit user2 post/i })).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('renders empty state when getPosts throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      getPosts.mockImplementation(() => {
        throw new Error('localStorage failure');
      });
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('page heading', () => {
    it('renders "All Posts" heading when posts exist', () => {
      getPosts.mockReturnValue([
        {
          id: 'p1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2025-01-10T00:00:00.000Z',
          authorId: 'u1',
          authorName: 'Alice',
        },
      ]);
      getSession.mockReturnValue(null);

      renderHome();

      expect(screen.getByRole('heading', { level: 1, name: /all posts/i })).toBeInTheDocument();
    });
  });
});
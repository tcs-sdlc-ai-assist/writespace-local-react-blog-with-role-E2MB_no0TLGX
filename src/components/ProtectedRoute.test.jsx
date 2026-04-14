import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
}));

import { getSession } from '../utils/auth';

beforeEach(() => {
  vi.restoreAllMocks();
});

function renderWithRouter(initialRoute, element) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/protected" element={element} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    getSession.mockReturnValue(null);

    renderWithRouter(
      '/protected',
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and no role is required', () => {
    getSession.mockReturnValue({
      userId: 'u1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    });

    renderWithRouter(
      '/protected',
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders children when user has the required role', () => {
    getSession.mockReturnValue({
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    });

    renderWithRouter(
      '/protected',
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
  });

  it('redirects to /blogs when user does not have the required role', () => {
    getSession.mockReturnValue({
      userId: 'u1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    });

    renderWithRouter(
      '/protected',
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login even when requiredRole is set', () => {
    getSession.mockReturnValue(null);

    renderWithRouter(
      '/protected',
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
  });

  it('renders Outlet when no children are provided and user is authenticated', () => {
    getSession.mockReturnValue({
      userId: 'u1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    });

    render(
      <MemoryRouter initialEntries={['/protected/child']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute />}>
            <Route path="child" element={<div>Outlet Child</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/blogs" element={<div>Blogs Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Outlet Child')).toBeInTheDocument();
  });

  it('renders children for admin user accessing a route with no required role', () => {
    getSession.mockReturnValue({
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    });

    renderWithRouter(
      '/protected',
      <ProtectedRoute>
        <div>General Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('General Content')).toBeInTheDocument();
  });
});
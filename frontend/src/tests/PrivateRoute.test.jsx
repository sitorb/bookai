import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

const ProtectedPage = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

function renderWithRoute(initialPath, token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/nooks"
          element={
            <PrivateRoute>
              <ProtectedPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('PrivateRoute — authentication guard', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('redirects unauthenticated user away from /nooks to /login', () => {
    renderWithRoute('/nooks', null);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content when token is present', () => {
    renderWithRoute('/nooks', 'valid-test-token-123');
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});

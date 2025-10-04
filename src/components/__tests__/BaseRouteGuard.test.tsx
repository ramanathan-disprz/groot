import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseRouteGuard from '../BaseRouteGuard';
import { AuthCookie } from '../../utils/AuthCookie';
import { 
  navigationHistory, 
  resetNavigationHistory, 
  setMockLocation, 
  useLocation 
} from '../../__mocks__/react-router-dom';

// Tell Jest to use our manual mock
jest.mock('react-router-dom');

// Mock AuthCookie
jest.mock('../../utils/AuthCookie', () => ({
  AuthCookie: {
    isAuthenticated: jest.fn(),
  },
}));

describe('BaseRouteGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetNavigationHistory();
    // Set default location
    setMockLocation({ pathname: '/dashboard' });
  });

  describe('When user is authenticated', () => {
    beforeEach(() => {
      (AuthCookie.isAuthenticated as jest.Mock).mockReturnValue(true);
    });

    it('should render children when user is authenticated', () => {
      render(
        <BaseRouteGuard>
          <div>Protected Dashboard Content</div>
        </BaseRouteGuard>
      );

      expect(screen.getByText('Protected Dashboard Content')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
      expect(navigationHistory).toHaveLength(0);
    });

    it('should render multiple children', () => {
      render(
        <BaseRouteGuard>
          <div>First Child</div>
          <div>Second Child</div>
        </BaseRouteGuard>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(navigationHistory).toHaveLength(0);
    });
  });

  describe('When user is not authenticated', () => {
    beforeEach(() => {
      (AuthCookie.isAuthenticated as jest.Mock).mockReturnValue(false);
    });

    it('should redirect to login with current path', () => {
      setMockLocation({ pathname: '/dashboard' });

      render(
        <BaseRouteGuard>
          <div>Protected Content</div>
        </BaseRouteGuard>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByTestId('mock-navigate')).toBeInTheDocument();
      expect(navigationHistory).toHaveLength(1);
      expect(navigationHistory[0]).toEqual({
        to: '/login?redirectTo=/dashboard',
        replace: true,
      });
    });

    it('should handle different paths', () => {
      const paths = ['/profile', '/settings', '/admin/users'];

      paths.forEach((path) => {
        resetNavigationHistory();
        setMockLocation({ pathname: path });

        const { unmount } = render(
          <BaseRouteGuard>
            <div>Protected</div>
          </BaseRouteGuard>
        );

        expect(navigationHistory[0].to).toBe(`/login?redirectTo=${path}`);
        unmount();
      });
    });
  });

  // Add more test cases...
});

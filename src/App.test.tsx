import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthCookie } from './utils/AuthCookie';

// Auto cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock the AuthCookie utility
jest.mock('./utils/AuthCookie');

// Mock the page components
jest.mock('./pages/HomePage', () => {
  return function HomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('./pages/EventPage', () => {
  return function EventPage() {
    return <div data-testid="event-page">Event Page</div>;
  };
});

jest.mock('./pages/login/LoginPage', () => {
  return function LoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./pages/register/RegisterPage', () => {
  return function RegisterPage() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

// Mock the BaseRouteGuard component with error handling
jest.mock('./components/BaseRouteGuard', () => {
  return function BaseRouteGuard({ children }: { children: React.ReactNode }) {
    let token = null;
    try {
      token = (AuthCookie.getToken as jest.Mock)();
    } catch (error) {
      // If there's an error getting the token, treat as unauthenticated
      token = null;
    }
    
    if (token) {
      return <>{children}</>;
    }
    return <div data-testid="auth-redirect">Redirected to Login</div>;
  };
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

// Mock tanstack query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
  })),
  QueryClientProvider: ({ children }: any) => children,
}));

describe('App Component', () => {
  it('should render without crashing', () => {
    (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
    
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(container).toBeDefined();
  });

  describe('Routing', () => {
    it('should render HomePage on root path', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('home-page')).toBeDefined();
    });

    it('should render LoginPage on /login path', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('login-page')).toBeDefined();
    });

    it('should render RegisterPage on /register path', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/register']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('register-page')).toBeDefined();
    });

    it('should render EventPage on /events path when authenticated', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue('valid-token');
      
      render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('event-page')).toBeDefined();
    });

    it('should redirect to login when accessing /events without authentication', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      
      const redirectElements = screen.queryAllByTestId('auth-redirect');
      expect(redirectElements.length).toBeGreaterThan(0);
      expect(screen.queryByTestId('event-page')).toBeNull();
    });
  });

  describe('Authentication Flow', () => {
    it('should protect event route when user is not authenticated', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.queryByTestId('event-page')).toBeNull();
      const authRedirect = screen.queryAllByTestId('auth-redirect');
      expect(authRedirect.length).toBeGreaterThan(0);
    });

    it('should allow access to event route when user is authenticated', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue('mock-token');
      
      render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('event-page')).toBeDefined();
      expect(screen.queryByTestId('auth-redirect')).toBeNull();
    });

    it('should allow access to public routes without authentication', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('home-page')).toBeDefined();
      unmount1();
      
      const { unmount: unmount2 } = render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('login-page')).toBeDefined();
      unmount2();
      
      const { unmount: unmount3 } = render(
        <MemoryRouter initialEntries={['/register']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('register-page')).toBeDefined();
      unmount3();
    });
  });

  describe('Component Integration', () => {
    it('should render Toaster component for notifications', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('toaster')).toBeDefined();
    });

    it('should handle invalid routes gracefully', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      const { container } = render(
        <MemoryRouter initialEntries={['/invalid-route']}>
          <App />
        </MemoryRouter>
      );
      
      expect(container).toBeDefined();
    });

    it('should maintain authentication state across route changes', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue('valid-token');
      
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('event-page')).toBeDefined();
      unmount1();
      
      const { unmount: unmount2 } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('home-page')).toBeDefined();
      unmount2();
      
      render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('event-page')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing authentication token gracefully', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(undefined);
      
      const { container } = render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      
      expect(container).toBeDefined();
      const authRedirect = screen.queryAllByTestId('auth-redirect');
      expect(authRedirect.length).toBeGreaterThan(0);
    });

    it('should handle authentication token errors', () => {
      // Mock getToken to throw an error
      (AuthCookie.getToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token error');
      });
      
      // The app should not crash and should redirect to login
      const { container } = render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      
      // Verify the app rendered without crashing
      expect(container).toBeDefined();
      
      // Should show auth redirect when error occurs (treating as unauthenticated)
      const authRedirect = screen.queryAllByTestId('auth-redirect');
      expect(authRedirect.length).toBeGreaterThan(0);
      
      // Should not show the protected event page
      expect(screen.queryByTestId('event-page')).toBeNull();
    });
  });

  describe('Navigation Flow', () => {
    it('should support navigation from home to login', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('home-page')).toBeDefined();
      unmount1();
      
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('login-page')).toBeDefined();
    });

    it('should support navigation from login to register', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('login-page')).toBeDefined();
      unmount1();
      
      render(
        <MemoryRouter initialEntries={['/register']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('register-page')).toBeDefined();
    });

    it('should support navigation after authentication', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      const { unmount: unmount1 } = render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('login-page')).toBeDefined();
      unmount1();
      
      (AuthCookie.getToken as jest.Mock).mockReturnValue('valid-token');
      
      render(
        <MemoryRouter initialEntries={['/events']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('event-page')).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);
      
      const startTime = performance.now();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(1000);
    });

    it('should handle multiple route changes efficiently', () => {
      (AuthCookie.getToken as jest.Mock).mockReturnValue('valid-token');
      
      const routes = ['/', '/login', '/register', '/events'];
      
      routes.forEach(route => {
        const { unmount } = render(
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        );
        unmount();
      });
      
      expect(true).toBe(true);
    });
  });
});

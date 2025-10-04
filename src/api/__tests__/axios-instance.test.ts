import axios from 'axios';
import axiosInstance from '../axios-instance';
import { URLConstants } from '../../utils/constants';
import { AuthCookie } from '../../utils/AuthCookie';

// Mock dependencies
jest.mock('axios');
jest.mock('../../utils/constants', () => ({
  URLConstants: {
    API_BASE_URL: 'http://localhost:3000/api',
  },
}));
jest.mock('../../utils/AuthCookie', () => ({
  AuthCookie: {
    getToken: jest.fn(),
    clearToken: jest.fn(),
    setToken: jest.fn(),
  },
}));

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('axios-instance', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  let mockRequestInterceptor: any;
  let mockResponseInterceptor: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.create to capture interceptors
    mockedAxios.create = jest.fn().mockImplementation(() => {
      const instance: any = {
        interceptors: {
          request: {
            use: jest.fn((onFulfilled, onRejected) => {
              mockRequestInterceptor = { onFulfilled, onRejected };
              return 1;
            }),
            eject: jest.fn(),
          },
          response: {
            use: jest.fn((onFulfilled, onRejected) => {
              mockResponseInterceptor = { onFulfilled, onRejected };
              return 1;
            }),
            eject: jest.fn(),
          },
        },
        defaults: {
          headers: {
            common: {},
          },
        },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      };
      return instance;
    });
  });

  describe('Instance Creation', () => {
    it('should create axios instance with correct base URL', () => {
      // Re-import to trigger creation
      jest.isolateModules(() => {
        require('../axios-instance');
      });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: URLConstants.API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Request Interceptor', () => {
    beforeEach(() => {
      // Re-import to get fresh instance
      jest.isolateModules(() => {
        require('../axios-instance');
      });
    });

    it('should add access token to request headers when token exists and endpoint is not excluded', async () => {
      const mockToken = 'test-access-token';
      const mockConfig = {
        headers: {},
        url: '/api/users',
      };

      (AuthCookie.getToken as jest.Mock).mockReturnValue(mockToken);

      const result = await mockRequestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
      expect(AuthCookie.getToken).toHaveBeenCalled();
    });

    it('should not add token for login endpoint', async () => {
      const mockToken = 'test-access-token';
      const mockConfig = {
        headers: {},
        url: '/api/login',
      };

      (AuthCookie.getToken as jest.Mock).mockReturnValue(mockToken);

      const result = await mockRequestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
      expect(AuthCookie.getToken).not.toHaveBeenCalled();
    });

    it('should not add token for register endpoint', async () => {
      const mockToken = 'test-access-token';
      const mockConfig = {
        headers: {},
        url: '/api/register',
      };

      (AuthCookie.getToken as jest.Mock).mockReturnValue(mockToken);

      const result = await mockRequestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
      expect(AuthCookie.getToken).not.toHaveBeenCalled();
    });

    it('should not add Authorization header when no token exists', async () => {
      const mockConfig = {
        headers: {},
        url: '/api/users',
      };

      (AuthCookie.getToken as jest.Mock).mockReturnValue(null);

      const result = await mockRequestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
      expect(AuthCookie.getToken).toHaveBeenCalled();
    });

    it('should handle request interceptor errors', async () => {
      const mockError = new Error('Request interceptor error');

      const result = mockRequestInterceptor.onRejected(mockError);

      await expect(result).rejects.toEqual(mockError);
    });

    it('should handle config without url', async () => {
      const mockToken = 'test-access-token';
      const mockConfig = {
        headers: {},
        // no url property
      };

      (AuthCookie.getToken as jest.Mock).mockReturnValue(mockToken);

      const result = await mockRequestInterceptor.onFulfilled(mockConfig);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
      expect(AuthCookie.getToken).toHaveBeenCalled();
    });
  });

  describe('Response Interceptor', () => {
    beforeEach(() => {
      // Re-import to get fresh instance
      jest.isolateModules(() => {
        require('../axios-instance');
      });
    });

    it('should return response on successful request', () => {
      const mockResponse = {
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const result = mockResponseInterceptor.onFulfilled(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('should handle 401 unauthorized error and clear token', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        config: {},
      };

      await expect(mockResponseInterceptor.onRejected(mockError)).rejects.toEqual(mockError);
      expect(AuthCookie.clearToken).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("API Error:", mockError.response.data);
    });

    it('should handle 403 forbidden error and clear token', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
        config: {},
      };

      await expect(mockResponseInterceptor.onRejected(mockError)).rejects.toEqual(mockError);
      expect(AuthCookie.clearToken).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("API Error:", mockError.response.data);
    });

    it('should handle network errors without response', async () => {
      const mockError = {
        message: 'Network Error',
        config: {},
      };

      await expect(mockResponseInterceptor.onRejected(mockError)).rejects.toEqual(mockError);
      expect(AuthCookie.clearToken).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("API Error:", mockError.message);
    });

    it('should handle 500 server error without clearing token', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
        config: {},
      };

      await expect(mockResponseInterceptor.onRejected(mockError)).rejects.toEqual(mockError);
      expect(AuthCookie.clearToken).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("API Error:", mockError.response.data);
    });

    it('should handle 404 not found error without clearing token', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not Found' },
        },
        config: {},
      };

      await expect(mockResponseInterceptor.onRejected(mockError)).rejects.toEqual(mockError);
      expect(AuthCookie.clearToken).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("API Error:", mockError.response.data);
    });
  });

  describe('Axios Instance Methods', () => {
    let instance: any;

    beforeEach(() => {
      jest.isolateModules(() => {
        instance = require('../axios-instance').default;
      });
    });

    it('should have all HTTP methods available', () => {
      expect(instance.get).toBeDefined();
      expect(instance.post).toBeDefined();
      expect(instance.put).toBeDefined();
      expect(instance.delete).toBeDefined();
    });
  });
});

import { ApiService } from '../api-service';

// Mock the entire axios-instance module
jest.mock('../axios-instance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Import the mocked axios instance
import axiosInstance from '../axios-instance';

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should fetch data with GET method', async () => {
      const mockData = { data: 'test data' };
      (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await ApiService.get('/test-url');
      
      expect(result).toEqual(mockData);
      expect(axiosInstance.get).toHaveBeenCalledWith('/test-url');
      expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should handle GET errors', async () => {
      const errorMessage = 'Network Error';
      (axiosInstance.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(ApiService.get('/test-url')).rejects.toThrow(errorMessage);
    });
  });

  describe('post', () => {
    it('should send data with POST method', async () => {
      const mockResponse = { success: true };
      const postData = { name: 'test' };
      (axiosInstance.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await ApiService.post('/test-url', postData);
      
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.post).toHaveBeenCalledWith('/test-url', postData);
      expect(axiosInstance.post).toHaveBeenCalledTimes(1);
    });

    it('should handle POST errors', async () => {
      const errorMessage = 'Bad Request';
      const postData = { name: 'test' };
      (axiosInstance.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(ApiService.post('/test-url', postData)).rejects.toThrow(errorMessage);
    });
  });

  describe('put', () => {
    it('should update data with PUT method', async () => {
      const mockResponse = { updated: true };
      const putData = { name: 'updated name' };
      (axiosInstance.put as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await ApiService.put('/test-url', putData);
      
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.put).toHaveBeenCalledWith('/test-url', putData);
      expect(axiosInstance.put).toHaveBeenCalledTimes(1);
    });

    it('should handle PUT errors', async () => {
      const errorMessage = 'Forbidden';
      const putData = { name: 'updated name' };
      (axiosInstance.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(ApiService.put('/test-url', putData)).rejects.toThrow(errorMessage);
    });
  });

  describe('delete', () => {
    it('should delete data with DELETE method', async () => {
      (axiosInstance.delete as jest.Mock).mockResolvedValue({});

      await ApiService.delete('/test-url');
      
      expect(axiosInstance.delete).toHaveBeenCalledWith('/test-url');
      expect(axiosInstance.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle DELETE errors', async () => {
      const errorMessage = 'Not Found';
      (axiosInstance.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(ApiService.delete('/test-url')).rejects.toThrow(errorMessage);
    });
  });
});

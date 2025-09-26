import { AuthService } from '../auth.service';
import { ApiService } from '../../../../api';
import { AuthCookie } from '../../../../utils/AuthCookie';
import { LoginRequest, RegisterRequest } from '../../dtos';

// Mock dependencies
jest.mock('../../../../api', () => ({
    ApiService: {
        post: jest.fn(),
    },
}));

jest.mock('../../../../utils/AuthCookie', () => ({
    AuthCookie: {
        clearToken: jest.fn(),
    },
}));

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should call ApiService.post with correct parameters', async () => {
            const mockLoginRequest: LoginRequest = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockLoginResponse = {
                token: 'mock-token',
                expiresAt: '2024-12-31T23:59:59Z',
            };

            (ApiService.post as jest.Mock).mockResolvedValue(mockLoginResponse);

            const result = await AuthService.login(mockLoginRequest);

            expect(ApiService.post).toHaveBeenCalledWith(
                'http://localhost:5220/v1/auth/login',
                mockLoginRequest
            );
            expect(result).toEqual(mockLoginResponse);
        });

        it('should handle login error', async () => {
            const mockLoginRequest: LoginRequest = {
                email: 'test@example.com',
                password: 'wrong-password',
            };

            const mockError = new Error('Invalid credentials');
            (ApiService.post as jest.Mock).mockRejectedValue(mockError);

            await expect(AuthService.login(mockLoginRequest)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('register', () => {
        it('should call ApiService.post with correct parameters', async () => {
            const mockRegisterRequest: RegisterRequest = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            const mockRegisterResponse = {
                name: 'Test User',
                email: 'test@example.com',
            };

            (ApiService.post as jest.Mock).mockResolvedValue(mockRegisterResponse);

            const result = await AuthService.register(mockRegisterRequest);

            expect(ApiService.post).toHaveBeenCalledWith(
                'http://localhost:5220/v1/auth/register',
                mockRegisterRequest
            );
            expect(result).toEqual(mockRegisterResponse);
        });

        it('should handle registration error', async () => {
            const mockRegisterRequest: RegisterRequest = {
                name: 'Test User',
                email: 'existing@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            };

            const mockError = new Error('Email already exists');
            (ApiService.post as jest.Mock).mockRejectedValue(mockError);

            await expect(AuthService.register(mockRegisterRequest)).rejects.toThrow('Email already exists');
        });
    });

    describe('logout', () => {
        it('should clear token when logout is called', async () => {
            await AuthService.logout();

            expect(AuthCookie.clearToken).toHaveBeenCalledTimes(1);
        });

        it('should complete successfully', async () => {
            const result = await AuthService.logout();

            expect(result).toBeUndefined();
        });
    });
});

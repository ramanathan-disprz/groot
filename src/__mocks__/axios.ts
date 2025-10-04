const mockAxios: any = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    head: jest.fn(() => Promise.resolve({ data: {} })),
    options: jest.fn(() => Promise.resolve({ data: {} })),
    request: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(() => mockAxios), // Return mockAxios instead of using 'this'
    defaults: {
        headers: {
            common: {},
            delete: {},
            get: {},
            head: {},
            post: {},
            put: {},
            patch: {},
        },
        baseURL: '',
        timeout: 0,
        withCredentials: false,
    },
    interceptors: {
        request: {
            use: jest.fn(),
            eject: jest.fn(),
            clear: jest.fn(),
        },
        response: {
            use: jest.fn(),
            eject: jest.fn(),
            clear: jest.fn(),
        },
    },
    getUri: jest.fn(),
    isAxiosError: jest.fn(() => false),
    all: jest.fn((promises: Array<Promise<any>>) => Promise.all(promises)),
    spread: jest.fn((callback: (...args: any[]) => any) => (arr: any[]) => callback(...arr)),
    isCancel: jest.fn(() => false),
    CancelToken: {
        source: jest.fn(() => ({
            token: {},
            cancel: jest.fn(),
        })),
    },
};

export default mockAxios;

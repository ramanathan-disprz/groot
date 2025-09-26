import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
    const mockHandlers = {
        s: jest.fn(),
        m: jest.fn(),
        l: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call handler for "s" key', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        fireEvent.keyDown(window, { key: 's' });

        expect(mockHandlers.s).toHaveBeenCalledTimes(1);
        expect(mockHandlers.m).not.toHaveBeenCalled();
        expect(mockHandlers.l).not.toHaveBeenCalled();
    });

    it('should call handler for "m" key', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        fireEvent.keyDown(window, { key: 'm' });

        expect(mockHandlers.m).toHaveBeenCalledTimes(1);
        expect(mockHandlers.s).not.toHaveBeenCalled();
        expect(mockHandlers.l).not.toHaveBeenCalled();
    });

    it('should call handler for "l" key', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        fireEvent.keyDown(window, { key: 'l' });

        expect(mockHandlers.l).toHaveBeenCalledTimes(1);
        expect(mockHandlers.s).not.toHaveBeenCalled();
        expect(mockHandlers.m).not.toHaveBeenCalled();
    });

    it('should handle uppercase keys', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        fireEvent.keyDown(window, { key: 'S' });
        fireEvent.keyDown(window, { key: 'M' });
        fireEvent.keyDown(window, { key: 'L' });

        expect(mockHandlers.s).toHaveBeenCalledTimes(1);
        expect(mockHandlers.m).toHaveBeenCalledTimes(1);
        expect(mockHandlers.l).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when typing in input field', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();

        fireEvent.keyDown(input, { key: 's' });

        expect(mockHandlers.s).not.toHaveBeenCalled();

        document.body.removeChild(input);
    });

    it('should not call handler when typing in textarea', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.focus();

        fireEvent.keyDown(textarea, { key: 'm' });

        expect(mockHandlers.m).not.toHaveBeenCalled();

        document.body.removeChild(textarea);
    });

    it('should handle missing handlers gracefully', () => {
        const partialHandlers = { s: jest.fn() };
        renderHook(() => useKeyboardShortcuts(partialHandlers));

        // Should not throw error for missing handlers
        fireEvent.keyDown(window, { key: 'm' });
        fireEvent.keyDown(window, { key: 'l' });

        expect(partialHandlers.s).not.toHaveBeenCalled();
    });

    it('should ignore other keys', () => {
        renderHook(() => useKeyboardShortcuts(mockHandlers));

        fireEvent.keyDown(window, { key: 'a' });
        fireEvent.keyDown(window, { key: 'Enter' });
        fireEvent.keyDown(window, { key: ' ' });

        expect(mockHandlers.s).not.toHaveBeenCalled();
        expect(mockHandlers.m).not.toHaveBeenCalled();
        expect(mockHandlers.l).not.toHaveBeenCalled();
    });

    it('should cleanup event listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        
        const { unmount } = renderHook(() => useKeyboardShortcuts(mockHandlers));
        
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        
        removeEventListenerSpy.mockRestore();
    });

    it('should update handlers when they change', () => {
        const { rerender } = renderHook(
            ({ handlers }) => useKeyboardShortcuts(handlers),
            { initialProps: { handlers: mockHandlers } }
        );

        fireEvent.keyDown(window, { key: 's' });
        expect(mockHandlers.s).toHaveBeenCalledTimes(1);

        const newHandlers = {
            s: jest.fn(),
            m: jest.fn(),
            l: jest.fn(),
        };

        rerender({ handlers: newHandlers });

        fireEvent.keyDown(window, { key: 's' });
        expect(newHandlers.s).toHaveBeenCalledTimes(1);
        expect(mockHandlers.s).toHaveBeenCalledTimes(1); // Still only 1 from before
    });
});

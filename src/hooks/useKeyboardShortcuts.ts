import {useEffect} from "react";

type ShortcutHandler = {
    s?: () => void;
    m?: () => void;
    l?: () => void;
};

export const useKeyboardShortcuts = (handlers: ShortcutHandler) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case "s":
                    handlers.s?.();
                    break;
                case "m":
                    handlers.m?.();
                    break;
                case "l":
                    handlers.l?.();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlers]);
};

import React, {useEffect} from 'react'

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({open, onClose, children}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (open) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [open, onClose]);
    return (
        <div className={`event-modal__backdrop ${open ? "open" : ""}`} onClick={onClose}>
            <div
                className="event-modal__content"
                onClick={(e) => e.stopPropagation()}
            >
                <section className="modal__body">
                    {children}
                </section>
            </div>
        </div>
    );
};


export default Modal;

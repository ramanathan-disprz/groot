import React from 'react'

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
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

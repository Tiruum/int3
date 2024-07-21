import React, {useEffect, useRef, useState} from "react";
import {gsap} from 'gsap';

interface Props {
    children?: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const Modal: React.FC<Props> = ({children, isOpen, onClose}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            gsap.fromTo(
                modalRef.current,
                {opacity: 0, y: -50},
                {opacity: 1, y: 0, duration: 0.3, onComplete: () => setIsAnimating(false)}
            );
        } else {
            setIsAnimating(true);
            gsap.fromTo(
                modalRef.current,
                {opacity: 1, y: 0},
                {opacity: 0, y: -50, duration: 0.3, onComplete: () => setIsAnimating(false)}
            );
        }
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;
    return (
        <div ref={modalRef}>
            <button onClick={onClose}>Close</button>
            {children}
        </div>
    )
}
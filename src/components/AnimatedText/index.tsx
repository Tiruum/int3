import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
    text: string;
    className?: string
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chars = containerRef.current?.children;
        if (chars) {
            gsap.fromTo(chars, {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.25,
                ease: 'power1.inOut',
                delay: 0,
                stagger: 0.03,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });
        }
    }, [text]);

    return (
        <div ref={containerRef} className={`${className} overflow-hidden`}>
            {text.split('').map((char, index) => (
                <span key={index} className={'inline-block'}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
};

export default AnimatedText;

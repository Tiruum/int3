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
        const chars = containerRef.current?.querySelectorAll('.char');
        if (chars) {
            gsap.fromTo(chars, {
                y: 25,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.1,
                ease: 'power1.inOut',
                delay: 0,
                stagger: {
                    each: 0.03,
                    from: 'start'
                },
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });
        }
    }, [text]);

    return (
        <div ref={containerRef} className={`${className}`}>
            {text.split(' ').map((word, index) => (
                <span key={index} className="word inline-block">
                    {word.split('').map((char, charIndex) => (
                        <span key={charIndex} className="char inline-block">
                            {char}
                        </span>
                    ))}
                    {/* Add a space after each word, but don't animate the space */}
                    <span className="char inline-block">&nbsp;</span>
                </span>
            ))}
        </div>
    );
};

export default AnimatedText;

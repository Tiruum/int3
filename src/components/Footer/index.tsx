import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

const Footer: React.FC = () => {
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const footer = footerRef.current;
        if (footer) {
            gsap.fromTo(footer, {
                opacity: 0,
            }, {
                opacity: 1,
                scrollTrigger: {
                    trigger: footer,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: true
                }
            })
        }

        return () => {
            if (footer) {
                // ScrollTrigger.kill();
            }
        }
    }, []);

    return (
        <div ref={footerRef} className='relative mx-auto mt-36'>
            <div className='flex flex-col justify-between px-16 py-8'>
                <span className='text-slate-600 mt-10 text-center'>© {new Date().getFullYear()} ММСП. Все права защищены.</span>
            </div>
        </div>
    );
};

export default Footer;

import React, {useEffect, useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ChevronRight} from "@gravity-ui/icons";

interface Element {
    id: number,
    date: Date,
    source: string,
    text: string,
    url: string
}

interface ScrollContainerProps {
    elements: Element[],
    staggerTime?: number,
    displayName: string,
    ifMask?: boolean
}

const truncate = (text: string): string => {
    const length = 90
    return text.length <= 90 ? text + '.' : text.substring(0, length) + '...'
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({elements, staggerTime, displayName, ifMask}) => {
    const displayElements = useRef(elements)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (ifMask) {
            displayElements.current = [...elements, ...elements]
        }

        const scrollInterval = setInterval((): void => {
            if (!isHovered && scrollContainer) {
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2 + 10) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 1;
                }
            }
        }, 30);

        return () => {
            clearInterval(scrollInterval);
        };
    }, [ifMask, elements, isHovered]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    useGSAP(() => {
        if (scrollContainerRef.current) {
            gsap.fromTo(scrollContainerRef.current.children,
                {
                    opacity: 0,
                }, {
                    opacity: 1,
                    duration: 0.7,
                    delay: 0,
                    ease: 'power1.inOut',
                    stagger: (staggerTime || .2) / displayElements.current.length,
                    scrollTrigger: {
                        trigger: scrollContainerRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                });
        }
    }, {scope: scrollContainerRef})

    return (
        <div ref={scrollContainerRef}
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
             className="overflow-x-auto gap-5 flex items-center hideScroll"
             style={ifMask ? {WebkitMask: "linear-gradient( to left, rgb(0, 0, 0, 0) 0%, rgb(0, 0, 0, 1) 5%, rgb(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100% )"} : {}}>
            {
                [...displayElements.current].map((element, index) => (
                    <div key={`${displayName}_${element.id}_${index}`}
                         className='flex-none w-80 h-48 backdrop-blur-xs border rounded-xl group transition-all p-5 bg-gradient-to-bl from-violet-900/50 hover:from-violet-800/50 to-violet-950/50 hover:to-violet-900/50 border-violet-800 hover:border-violet-700'>
                        <p className="text-violet-300 text-xs group-hover:text-violet-200">{element.source}</p>
                        <p className="text-base text-pretty text-slate-100 group-hover:text-violet-100">{truncate(element.text)}</p>

                        <a href={element.url} target="_blank"
                           className="text-base mt-auto font-bold text-violet-400 group-hover:text-violet-50 flex items-center">Перейти
                            к статье <ChevronRight/></a>
                    </div>
                ))
            }
        </div>
    );
}
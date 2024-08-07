import AnimatedText from "../../AnimatedText";
import {useEffect, useMemo, useRef, useState} from "react";
import cniimash from "@/assets/partners/cniimash.png"
import fpi from "@/assets/partners/fpi.png"
import stc from "@/assets/partners/stc.png"
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(ScrollTrigger)

export const Partners = () => {
    type Image = {
        id: number,
        source: string
    }
    const images: Image[] = useMemo(() => [
        {
            id: 0,
            source: cniimash,
        },
        {
            id: 1,
            source: fpi,
        },
        {
            id: 1,
            source: stc,
        }
    ], [])

    const displayImages = useRef(images)
    const [ifMask, setIfMask] = useState<boolean>(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        let scrollInterval: NodeJS.Timeout;

        if (scrollContainer) {
            if (scrollContainer.scrollWidth > window.innerWidth) {
                displayImages.current = [...images, ...images]
                setIfMask(true)
                scrollInterval = setInterval((): void => {
                    if (!isHovered) {
                        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2 + 10) {
                            scrollContainer.scrollLeft = 0;
                        } else {
                            scrollContainer.scrollLeft += 1;
                        }
                    }
                }, 20);
            }
        }

        return () => {
            clearInterval(scrollInterval);
        };
    }, [isHovered, images]);

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
                    stagger: .2/2,
                    scrollTrigger: {
                        trigger: scrollContainerRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                });
        }
    }, { scope: scrollContainerRef })

    return (
        <>
            <AnimatedText text={'Наши партнеры'} className='font-bold text-white text-5xl leading-[125%] mb-12'/>
            <div ref={scrollContainerRef}
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}
                 className={"hideScroll overflow-x-auto gap-12 flex items-center relative"}
                 style={ifMask ? {WebkitMask: "linear-gradient( to left, rgb(0, 0, 0, 0) 0%, rgb(0, 0, 0, 1) 5%, rgb(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100% )"} : {}}>
                {
                    [...displayImages.current].map((image: Image, index: number) => (
                        <img key={`${image.id}_${index}`} src={image.source} alt=''/>
                    ))
                }
            </div>
        </>
    )
}
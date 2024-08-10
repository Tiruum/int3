import AnimatedText from "../../AnimatedText";
import {useEffect, useMemo, useRef, useState} from "react";
import cniimash from "@/assets/partners/cniimash.png"
import fifth from "@/assets/partners/fifth.svg"
import fpi from "@/assets/partners/fpi.png"
import fsr from "@/assets/partners/fsr.png"
import nsu from "@/assets/partners/nsu.svg"
import sibgu from "@/assets/partners/sibgu.svg"
import vigstar from "@/assets/partners/vigstar.png"
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";

gsap.registerPlugin(ScrollTrigger)

export const Partners = () => {
    type Image = {
        name: string,
        source: string
    }
    const images: Image[] = useMemo(() => [
        {
            name: 'ЦНИИмаш',
            source: cniimash,
        },
        {
            name: 'ОКБ Пятое поколение',
            source: fifth,
        },
        {
            name: 'Фонд перспективных исследований',
            source: fpi,
        },
        {
            name: 'ФКИ',
            source: fsr
        },
        {
            name: 'НГУ',
            source: nsu
        },
        {
            name: 'СибГУ',
            source: sibgu
        },
        {
            name: 'Вигстар',
            source: vigstar
        }
    ].sort(), [])

    const displayImages = useRef(images)
    const [ifMaskImage, setIfMaskImage] = useState<boolean>(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        let scrollInterval: NodeJS.Timeout;

        if (scrollContainer) {
            if (scrollContainer.scrollWidth > window.innerWidth) {
                displayImages.current = [...images, ...images]
                setIfMaskImage(true)
                scrollInterval = setInterval((): void => {
                    if (!isHovered) {
                        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2 + 24) {
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
                    stagger: .2/displayImages.current.length,
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
                 style={ifMaskImage ? {WebkitMask: "linear-gradient( to left, rgb(0, 0, 0, 0) 0%, rgb(0, 0, 0, 1) 5%, rgb(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100% )"} : {}}>
                {
                    [...displayImages.current].map((image: Image, index: number) => (
                        <div key={`${image.name}_${index}`} className={'flex-none'}>
                            <img src={image.source} alt='' className={'h-32'} title={image.name}/>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
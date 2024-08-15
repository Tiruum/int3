import React, {useEffect, useRef, useState} from "react";
import AnimatedText from "../../AnimatedText";
import {ArrowUpRightFromSquare, Xmark} from "@gravity-ui/icons";
import gsap from "gsap";
import {PeriodicallyWatch} from "@/components/Views/Scenarios/periodicallyWatch.tsx";
import {Abonent} from "@/components/Views/Scenarios/abonent.tsx";
import {MergedGroup} from "@/components/Views/Scenarios/mergedGroup.tsx";

interface ScenariosProps {
}

interface Scenario {
    id: number;
    Icon?: React.ComponentType<{ className: string }>;
    title: string;
    shortDescription: string;
    mainImageSrc?: string;
    slideshow?: string[];
}

const Scenarios: React.FC<ScenariosProps> = () => {
    const [showOverlay, setShowOverlay] = useState<number>(0)

    const data: Scenario[] = [
        {
            id: 1,
            title: 'Периодичность наблюдения',
            mainImageSrc: '/scenarios/periodicallyWatch/main.png',
            shortDescription: 'Основной сценарий для проектирования систем ДЗЗ',
        },
        {
            id: 2,
            mainImageSrc: '/scenarios/abonent/main.png',
            title: 'Абонентская связь',
            shortDescription: 'Основной сценарий для проектирования систем связи',
        },
        {
            id: 3,
            mainImageSrc: '/scenarios/mergedGroup/main.png',
            title: 'Объединенная группировка',
            shortDescription: 'Совместное функционирование группировки ДЗЗ и связи',
        }
    ];

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        if (showOverlay !== 0) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        }

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [showOverlay]);

    const scenariosRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scenariosRef.current) {
            gsap.fromTo(scenariosRef.current.children,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: .4,
                    delay: 0,
                    stagger: {
                        each: 0.2,
                    },
                    scrollTrigger: {
                        trigger: scenariosRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                });
        }
    }, []);

    const handleClose = () => {
        if (modalRef.current) {
            gsap.to(modalRef.current, {
                opacity: 0,
                duration: 0.25,
                onComplete: () => setShowOverlay(0),
            })
        }
    }

    return (
        <div>
            <AnimatedText text={'Сценарии'} className='font-bold text-white lg:text-5xl text-3xl leading-[125%] mb-12'/>
            {
                showOverlay !== 0 &&
                <div className={`fixed top-0 left-0 right-0 h-screen lg:px-24 lg:py-6 p-0 z-50`} ref={modalRef}>
                    <div className="absolute w-[200vw] h-[200vh] backdrop-blur-sm -translate-x-1/2 -translate-y-1/2"
                         onClick={() => handleClose()}/>
                    <div
                        className={`bg-gray-950/80 hideScroll backdrop-blur-2xl lg:border border-gray-700 lg:rounded-3xl lg:p-12 lg:px-20 p-6 overflow-y-auto h-full`}>
                        <Xmark
                            className={`absolute lg:right-12 right-6 lg:top-12 top-6 text-red-300 w-8 h-8 flex-none cursor-pointer`}
                            onClick={() => handleClose()}/>
                        {showOverlay === 1 && <PeriodicallyWatch/>}
                        {showOverlay === 2 && <Abonent/>}
                        {showOverlay === 3 && <MergedGroup/>}

                    </div>
                </div>
            }
            <div className="grid md:grid-cols-3 grid-cols-1 gap-8" ref={scenariosRef}>
                {data.map((obj) => {
                    const {Icon, id, title, shortDescription, mainImageSrc} = obj;
                    return (
                        <div key={id} className={`
                            group flex flex-col justify-center gap-4 rounded-xl p-6
                            bg-gradient-to-br border from-purple-800/50 to-purple-950/50
                            border-purple-800 duration-300 ease-in-out
                            hover:from-purple-700/50 hover:to-purple-900/50 hover:border-purple-700
                            cursor-pointer transition-all backdrop-blur-xs`}
                             onClick={() => setShowOverlay(id)}>
                            {Icon && <Icon
                                className="text-purple-400 group-hover:text-purple-300 w-8 h-8 flex-none cursor-pointer"/>}
                            {mainImageSrc && <img src={mainImageSrc} alt='' className={'rounded-xl mix-blend-screen'}/>}
                            <h3 className="text-purple-50 group-hover:text-white text-2xl font-semibold cursor-pointer">{title}</h3>
                            <p className="text-purple-200 group-hover:text-purple-50 cursor-pointer">{shortDescription}</p>
                            <button
                                className={`bg-purple-700 flex items-center gap-2 group-hover:bg-purple-600 w-fit px-4 py-1 rounded-lg font-semibold text-purple-200 group-hover:text-purple-50 cursor-pointer`}>Посмотреть <ArrowUpRightFromSquare/>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Scenarios;

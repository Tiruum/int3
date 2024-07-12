import React, {useEffect, useRef, useState} from "react";
import AnimatedText from "../../AnimatedText";
import {ArrowUpRightFromSquare, Rocket, Xmark} from "@gravity-ui/icons";
import gsap from "gsap";
// import ReactMarkdown from 'react-markdown'
// import gfm from 'remark-gfm'

interface ScenariosProps {}

interface Step {
    title: string;
    subtitle: string;
    description: string;
}

interface Scenario {
    id: number;
    Icon?: React.ComponentType<{ className: string }>;
    title: string;
    description: string;
    steps: Step[]
}

const Scenarios: React.FC<ScenariosProps> = () => {
    const [showOverlay, setShowOverlay] = useState<number>(0)

    const data: Scenario[] = [
        {
            id: 1,
            Icon: Rocket,
            title: 'Название сценария',
            description: 'Долгое-долгое описание сценария, которое в основных чертах отражает содержимое',
            steps: [
                {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }, {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }, {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }
            ]
        },
        {
            id: 2,
            Icon: Rocket,
            title: 'Название сценария',
            description: 'Долгое-долгое описание сценария, которое в основных чертах отражает содержимое',
            steps: [
                {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }, {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }, {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }
            ]
        },
        {
            id: 3,
            Icon: Rocket,
            title: 'Название сценария',
            description: 'Долгое-долгое описание сценария, которое в основных чертах отражает содержимое',
            steps: [
                {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }, {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }, {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага'
                }
            ]
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
            <AnimatedText text={'Сценарии'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
            {
                showOverlay !== 0 &&
                <div className={`fixed top-0 left-0 right-0 h-screen lg:p-24 p-0 z-50`} ref={modalRef}>
                    <div className={`bg-gray-950/80 backdrop-blur-2xl lg:border border-gray-700 lg:rounded-3xl lg:p-12 p-6 overflow-y-auto h-full`}>
                        <Xmark
                            className={`absolute lg:right-12 right-6 lg:top-12 top-6 text-red-300 w-8 h-8 flex-none cursor-pointer`}
                            onClick={() => handleClose()}/>
                        <h1 className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'>{data[showOverlay - 1].title}</h1>
                        <p className="text-gray-100">{data[showOverlay-1].description}</p>

                        <ol className="relative mt-8 border-s-2 border-gray-700 space-y-10">
                            {
                                data[showOverlay-1].steps.map((step, index) => (
                                    <li className="ps-8" key={`${data[showOverlay - 1]}_${index}`}>
                                        {/*<span className="absolute flex items-center justify-center w-6 h-6 bg-purle-900 rounded-full -start-3 ring-8 ring-purple-900/25">*/}
                                        {/*    <CircleCheckFill className="w-6 h-6 text-purple-300" aria-hidden="true" />*/}
                                        {/*</span>*/}
                                        <h3 className="relative flex items-center mb-1 text-xl font-semibold text-gray-200 tracking-tight">
                                            <span
                                                className="absolute block -left-8 rounded-tr-full rounded-br-full top-0 h-full bg-gray-700 w-2"></span>
                                            <p>{step.title}</p>
                                        </h3>
                                        <time
                                            className="block mb-2 text-sm font-normal leading-none text-gray-300">{step.subtitle}</time>
                                        <p className="mb-4 text-base font-normal text-gray-200">{step.description}</p>
                                    </li>
                                ))
                            }
                        </ol>
                    </div>
                </div>
            }
            <div className="grid md:grid-cols-3 grid-cols-1 gap-8" ref={scenariosRef}>
                {data.map((obj) => {
                    const {Icon, id, title, description} = obj;
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
                            <h3 className="text-purple-50 group-hover:text-white text-2xl font-semibold cursor-pointer">{title}</h3>
                            <p className="text-purple-200 group-hover:text-purple-50 cursor-pointer">{description}</p>
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

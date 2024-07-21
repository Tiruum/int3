import React, {useEffect, useRef, useState} from "react";
import AnimatedText from "../../AnimatedText";
import {ArrowUpRightFromSquare, Eye, Rocket, Xmark} from "@gravity-ui/icons";
import gsap from "gsap";
// import ReactMarkdown from 'react-markdown'
// import gfm from 'remark-gfm'

interface ScenariosProps {
}

interface Step {
    title: string;
    subtitle: string;
    description: string;
    images?: string[]
}

interface Scenario {
    id: number;
    Icon?: React.ComponentType<{ className: string }>;
    title: string;
    description: string[];
    shortDescription: string,
    steps: Step[]
}

const Scenarios: React.FC<ScenariosProps> = () => {
    const [showOverlay, setShowOverlay] = useState<number>(0)

    const data: Scenario[] = [
        {
            id: 1,
            Icon: Eye,
            title: 'Периодичность наблюдения',
            description: ['Цель: произвести съёмку точечных целей на различных широтах и определить зависимость средней периодичности наблюдения цели от широты.',
                'Входные данные: параметры оптической камеры ДЗЗ, конструкции КА, орбитального построения группировки КА, группы точечных целей ДЗЗ.'
            ],
            shortDescription: 'Произведение съёмки точечных целей на различных широтах и определение зависимости средней периодичности наблюдения цели от широты.',
            steps: [
                {
                    title: 'Задание входных данных',
                    subtitle: '',
                    description: 'Задание камеры ДЗЗ',
                    images: ['/scenarios/periodicallyWatch/00.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: 'Задание конструкции КА',
                    images: ['/scenarios/periodicallyWatch/01.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: 'Задание группировки КА',
                    images: ['/scenarios/periodicallyWatch/02.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: 'Задание точечных целей ДЗЗ',
                    images: ['/scenarios/periodicallyWatch/03.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: 'Запуск расчета',
                    images: ['/scenarios/periodicallyWatch/04.png',]
                }, {
                    title: 'Анализ результатов',
                    subtitle: '',
                    description: 'В результате вычисления дневной периодичности (с учётом длительности светлой части суток), усреднённой по долготам, в каждом широтном поясе определена зависимость средней периодичности от широты. Обнаружено, что средняя периодичность обзора зависит от широты цели линейным образом и уменьшается с увеличением широты.',
                    images: ['/scenarios/periodicallyWatch/05.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: 'Результаты по районам зондирования, таблица с параметрами съёмки',
                    images: ['/scenarios/periodicallyWatch/06.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: 'Просмотр циклограмм наблюдения каждой точки',
                    images: ['/scenarios/periodicallyWatch/07.png',]
                }, {
                    title: '',
                    subtitle: '',
                    description: '',
                    images: ['/scenarios/periodicallyWatch/08.png',]
                }
            ]
        },
        {
            id: 2,
            Icon: Rocket,
            title: 'Название сценария',
            description: ['Долгое-долгое описание сценария, которое в основных чертах отражает содержимое'],
            shortDescription: 'Краткое описание',
            steps: [
                {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага',
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
            description: ['Долгое-долгое описание сценария, которое в основных чертах отражает содержимое'],
            shortDescription: 'Краткое описание',
            steps: [
                {
                    title: 'Название шага',
                    subtitle: 'Подназвание шага',
                    description: 'Описание шага',
                    images: ['./00.png']
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
            <AnimatedText text={'Сценарии'} className='font-bold text-white text-5xl leading-[125%] mb-12'/>
            {
                showOverlay !== 0 &&
                <div className={`fixed top-0 left-0 right-0 h-screen lg:p-24 p-0 z-50`} ref={modalRef}>
                    <div className="absolute w-[200vw] h-[200vh] backdrop-blur-sm -translate-x-1/2 -translate-y-1/2"
                         onClick={() => handleClose()}>

                    </div>
                    <div
                        className={`bg-gray-950/80 hideScroll backdrop-blur-2xl lg:border border-gray-700 lg:rounded-3xl lg:p-12 p-6 overflow-y-auto h-full`}>
                        <Xmark
                            className={`absolute lg:right-12 right-6 lg:top-12 top-6 text-red-300 w-8 h-8 flex-none cursor-pointer`}
                            onClick={() => handleClose()}/>
                        <h1 className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'>{data[showOverlay - 1].title}</h1>
                        {data[showOverlay - 1].description.map((item, i) => (
                            <p key={`${data[showOverlay - 1].id}_description${i}`} className="text-gray-100">{item}</p>
                        ))}

                        <ol className="relative mt-8 border-s-2 border-gray-700 space-y-10">
                            {
                                data[showOverlay - 1].steps.map((step, index) => (
                                    <li className="ps-8" key={`${data[showOverlay - 1].id}_step${index}`}>
                                        <h3 className="relative flex items-center mb-1 text-xl font-semibold text-gray-200 tracking-tight">
                                            <span
                                                className="absolute block -left-8 rounded-tr-full rounded-br-full top-0 h-full bg-gray-700 w-2"></span>
                                            {step.title && <p className={`lg:w-1/2`}>{step.title}</p>}
                                        </h3>
                                        {step.subtitle !== '' && <time
                                            className="block mb-2 text-sm font-normal leading-none text-gray-300 lg:w-1/2">{step.subtitle}</time>}
                                        {step.description !== '' &&
                                            <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">{step.description}</p>}
                                        {
                                            step.images && step.images.map((image, i) => (
                                                <img src={image}
                                                     alt={`${data[showOverlay - 1].id}_step${index}_image${i}`}
                                                     key={`${data[showOverlay - 1].id}_step${index}_image${i}`}
                                                     className={`rounded-xl border border-neutral-500/50 my-1 lg:w-5/6 bg-white`}

                                                />
                                            ))
                                        }
                                    </li>
                                ))
                            }
                        </ol>
                    </div>
                </div>
            }
            <div className="grid md:grid-cols-3 grid-cols-1 gap-8" ref={scenariosRef}>
                {data.map((obj) => {
                    const {Icon, id, title, shortDescription} = obj;
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

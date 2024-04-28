import React, {useEffect, useRef, useState} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

interface FunctionsProps {
}

const Functions: React.FC<FunctionsProps> = () => {
    // const [functional, setFunctional] = useState(1)

    const functionalObj = [
        {
            id: 0,
            title: 'Моделирование баллистических построений',
            description: 'Пользователям доступно несколько видов интеграторов, вариативность модели среды, а также маневры поддержания орбит.'
        },
        {
            id: 1,
            title: 'Дистанционное зондирование земли',
            description: 'Определение характеристик систем ДЗЗ, оценка характеристик полезной нагрузки, формирование облика космических систем ДЗЗ.'
        },
        {
            id: 2,
            title: 'Подбор компонентов космических аппаратов',
            description: 'Программный комплекс позволяет осуществлять подбор компонентов космических аппаратов, способных удовлетворить заданным требованиям. Также можно провести диагностику полученной конструкции, моделируя ее работу.'
        },
        {
            id: 3,
            title: 'Имитационный эксперимент',
            description: 'Виртуальный эксперимент с моделированием работы всех систем космических аппаратов, проверка выполнимости заложенного полетного задания с учетом алгоритмов работы бортовых систем.'
        },
        {
            id: 4,
            title: 'Моделирование связи',
            description: 'Программный комплекс предоставляет функции расчета сеансов связи между космическими аппаратами и наземными станциями, а также позволяет учитывать межспутниковую связь и маршрутизацию данных.'
        },
        {
            id: 5,
            title: 'Мониторинг космического пространства',
            description: 'Интеграл оснащен программой наблюдения, позволяющей отслеживать космическое пространство на выявление угрозы особо опасных объектов.'
        }
    ];

    const [progressHeight, setProgressHeight] = useState<number>(1)
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const progress = progressRef.current;

        if (container && progress) {
            gsap.to(container, {
                yPercent: -100 * (functionalObj.length - 1),
                ease: "none",
                duration: 2,
                scrollTrigger: {
                    id: 'functions-scroll',
                    trigger: "#functions",
                    start: "center center",
                    pin: "#functions", // Закрепляем элемент, чтобы он не скроллился вместе с страницей
                    scrub: 1, // Плавная анимация синхронизированная со скроллом
                    end: () => "+=" + container.offsetHeight, // Окончание анимации на конце элемента
                    snap: 1 / (functionalObj.length - 1),
                    onUpdate: (self) => setProgressHeight(Number(self.progress.toFixed(2))),
                    pinSpacing: true, // Добавление дополнительного пространства для закрепления
                    // markers: true,
                }
            });

            gsap.fromTo(progressRef.current,  { height: 0 }, {
                height: progressHeight * container.offsetHeight,
                duration: 2,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#functions',
                    start: "center center",
                    end: () => "+=" + container.offsetHeight,
                    snap: 1 / (functionalObj.length - 1),
                    scrub: 1,
                }
            })

            return () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            }
        }
    }, [functionalObj.length]);

    // const progressContainer = useRef<HTMLDivElement>(null)

    return (
        <>
            <p className='font-bold text-white text-5xl leading-[125%] mb-8'>Функционал
                программного комплекса</p>
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-8">
                <div className={`border-bottom-2 flex gap-8 overflow-y-hidden h-96`}>
                    <div className={`relative w-2 h-full bg-gray-700`}>
                        <div ref={progressRef} className={`w-full bg-orange-500 absolute`}></div>
                    </div>
                    <div ref={containerRef} className={`flex flex-col`}>
                        {
                            functionalObj.map(obj => (
                                <div key={obj.id} className={`my-32`}>
                                    <h1 className={`text-3xl font-bold text-orange-500`}>{obj.title}</h1>
                                    <p className={`text-lg`}>{obj.description}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={``}>

                </div>
            </div>
        </>
    )
}

export default Functions;
import React from "react";
import { MdModelTraining, MdOutlineSpaceDashboard, MdOutlineSignalCellularAlt, MdOutlineVisibility } from 'react-icons/md';
import { IoEarthOutline } from 'react-icons/io5';
import { AiTwotoneExperiment } from "react-icons/ai";
import { IconType } from 'react-icons';import AnimatedText from "../../AnimatedText";
import Box from "../../Box";

// gsap.registerPlugin(ScrollTrigger)

interface FunctionsProps {
}

interface FunctionsObj {
    id: number;
    title: string;
    description: string;
    icon: IconType;
}

const Functions: React.FC<FunctionsProps> = () => {
    // const [functional, setFunctional] = useState(1)

    const funcObj: FunctionsObj[] = [
        {
            id: 0,
            title: 'Моделирование баллистических построений',
            description: 'Пользователям доступно несколько видов интеграторов, вариативность модели среды, а также маневры поддержания орбит.',
            icon: MdModelTraining,
        },
        {
            id: 1,
            title: 'Дистанционное зондирование земли',
            description: 'Определение характеристик систем ДЗЗ, оценка характеристик полезной нагрузки, формирование облика космических систем ДЗЗ.',
            icon: IoEarthOutline,
        },
        {
            id: 2,
            title: 'Подбор компонентов космических аппаратов',
            description: 'Программный комплекс позволяет осуществлять подбор компонентов, удовлетворяющих заданным требованиям. Также возможно провести диагностику полученной конструкции, моделируя ее работу.',
            icon: MdOutlineSpaceDashboard,
        },
        {
            id: 3,
            title: 'Имитационный эксперимент',
            description: 'Виртуальный эксперимент с моделированием работы всех систем космических аппаратов, проверка выполнимости заложенного полетного задания с учетом алгоритмов работы бортовых систем.',
            icon: AiTwotoneExperiment,
        },
        {
            id: 4,
            title: 'Моделирование связи',
            description: 'Программный комплекс предоставляет функции расчета сеансов связи между космическими аппаратами и наземными станциями, а также позволяет учитывать межспутниковую связь и маршрутизацию данных.',
            icon: MdOutlineSignalCellularAlt,
        },
        {
            id: 5,
            title: 'Мониторинг космического пространства',
            description: 'Интеграл оснащен программой наблюдения, позволяющей отслеживать космическое пространство на выявление угрозы особо опасных объектов.',
            icon: MdOutlineVisibility,
        }
    ];

    // const [progressHeight, setProgressHeight] = useState<number>(1)
    // const containerRef = useRef<HTMLDivElement>(null);
    // const progressRef = useRef<HTMLDivElement>(null);
    //
    // useEffect(() => {
    //     const container = containerRef.current;
    //     const progress = progressRef.current;
    //
    //     if (container && progress) {
    //         gsap.to(container, {
    //             yPercent: -100 * (functionalObj.length - 1),
    //             ease: "none",
    //             duration: 10,
    //             scrollTrigger: {
    //                 id: 'functions-scroll',
    //                 trigger: "#functions",
    //                 start: "center center",
    //                 pin: "#functions", // Закрепляем элемент, чтобы он не скроллился вместе с страницей
    //                 scrub: 1, // Плавная анимация синхронизированная со скроллом
    //                 end: () => "+=" + container.offsetHeight * 2, // Окончание анимации на конце элемента
    //                 // snap: 1 / (functionalObj.length - 1),
    //                 onUpdate: (self) => setProgressHeight(Number(self.progress.toFixed(2))),
    //                 pinSpacing: true, // Добавление дополнительного пространства для закрепления
    //                 // markers: true,
    //             }
    //         });
    //
    //         gsap.fromTo(progressRef.current,  { height: 0 }, {
    //             height: progressHeight * container.offsetHeight,
    //             duration: 2,
    //             ease: 'none',
    //             scrollTrigger: {
    //                 trigger: '#functions',
    //                 start: "center center",
    //                 end: () => "+=" + container.offsetHeight * 2,
    //                 // snap: 1 / (functionalObj.length - 1),
    //                 scrub: 1,
    //             }
    //         })
    //
    //         return () => {
    //             ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    //         }
    //     }
    // }, [functionalObj.length]);

    // const progressContainer = useRef<HTMLDivElement>(null)

    return (
        <>
            <AnimatedText text={'Функционал программного комплекса'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-8 gap-4'>

                {
                    funcObj.map((obj: FunctionsObj, index: number) => (
                        <Box key={`functions_${index}`} Icon={obj.icon} title={obj.title} description={obj.description} color={'blue'} col={true} />
                    ))
                }
            </div>
        </>
    )
}

export default Functions;
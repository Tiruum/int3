import React, {useEffect, useRef} from "react";
import AnimatedText from "../../AnimatedText";
import {Calculator, ChartMixed, Rocket} from '@gravity-ui/icons';
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: <Calculator className="w-10 h-10 text-blue-500" />,
        title: "Моделирование",
        description: "Проведение математических и имитационных моделирований многоспутниковых группировок, отдельных космических аппаратов (КА), а также систем КА на различных этапах жизненного цикла космической системы.",
        hoverBorderColor: "hover:border-blue-500"
    },
    {
        icon: <ChartMixed className="w-10 h-10 text-green-500" />,
        title: "Расчёт динамики",
        description: "Расчет динамики многоспутниковых группировок, выполнение ими целевых задач и предоставление математического описания функционирования космических аппаратов, входящих в состав группировок.",
        hoverBorderColor: "hover:border-green-500"
    },
    {
        icon: <Rocket className="w-10 h-10 text-red-500" />,
        title: "Оптимальные решения",
        description: "Нахождение оптимальных решений, недостижимых при проектировании с использованием экспертных и аналитических подходов. Это позволяет исключить принятие ошибочных решений и впоследствии значительно сократить затраты при создании и применении многоспутниковых систем и комплексов.",
        hoverBorderColor: "hover:border-red-500"
    }
];

const Description: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                opacity: 1,
                y: 0,
                duration: .4,
                delay: 0,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });
        }
    }, []);
    return (
        <>
            <AnimatedText text={'Описание'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
            <h1 className="text-4xl font-bold text-center mb-8 ubuntu-mono-bold">
                Первый российский программный комплекс для проектирования многоспутниковых космических систем
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8" ref={containerRef}>
                {features.map((feature, index) => (
                    <div key={`description_${index}`}
                         className={`p-6 rounded-xl lg:col-span-1 backdrop-blur-xs md:col-span-2 md:last:col-start-2 lg:last:col-start-3 transition-colors bg-gray-950/50 border ${feature.hoverBorderColor} duration-300`}>
                        <div className="flex justify-center mb-4">
                            {feature.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2">{feature.title}</h2>
                        <p className="text-gray-400 text-center">{feature.description}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Description
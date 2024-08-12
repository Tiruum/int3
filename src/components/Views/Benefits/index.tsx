import {
    ArrowsRotateLeft,
    BranchesDown,
    Calculator,
    ChartMixed,
    Folders,
    Gear,
    PencilToSquare,
    Rocket,
    Thunderbolt
} from "@gravity-ui/icons";
import React, {useEffect, useRef} from "react";
import Box from "../../Box";
import AnimatedText from "../../AnimatedText";
import gsap from "gsap";

const Benefits: React.FC = () => {

    const benefitsRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (benefitsRef.current) {
            gsap.fromTo(benefitsRef.current.children,
                {
                    opacity: 0,
                }, {
                    opacity: 1,
                    duration: .4,
                    delay: 0,
                    stagger: {
                        amount: 0.6,
                        from: 'center',
                        grid: [3, 3],
                    },
                    scrollTrigger: {
                        trigger: benefitsRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                });
        }
    }, []);

    return (
        <>
            <AnimatedText text={'Преимущества программного комплекса'} className='font-bold text-white lg:text-5xl text-3xl leading-[125%] mb-12' />
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-8 gap-4' ref={benefitsRef}>

                <Box Icon={ArrowsRotateLeft} description={'Автоматизация обработки результатов и снижение влияния человеческого фактора'} color={'blue'} />
                <Box Icon={Calculator} description={'Акцент на расчетах многоспутниковых группировок и большого числа объектов'} color={'blue'} />
                <Box Icon={ChartMixed} description={'Подробная аналитика'} color={'blue'} />
                <Box Icon={BranchesDown} description={'Клиент-серверная архитектура с возможностью организации работы команды'} color={'blue'} />
                <Box Icon={PencilToSquare} description={'Вариативность моделей и расчет сквозных задач'} color={'blue'} />
                <Box Icon={Rocket} description={'Высокая скорость и точность расчетов'} color={'blue'} />
                <Box Icon={Folders} description={'Кроссплатформенность и открытая архитектура'} color={'blue'} />
                <Box Icon={Gear} description={'Автоматизация многовариантных и оптимизационных расчетов'} color={'blue'} />
                <Box Icon={Thunderbolt} description={'Мощный инструмент визуализации результатов в трехмерном и двумерном представлении'} color={'blue'} />

            </div>
        </>
    )
}
export default Benefits
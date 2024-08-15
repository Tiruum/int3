import AnimatedText from "@/components/AnimatedText";
import Box from "@/components/Box";
import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {GoOrganization} from "react-icons/go";
import {PiBracketsCurly} from "react-icons/pi";
import {LiaUniversitySolid} from "react-icons/lia";


export const UsefulFor = () => {
    const organizations = [
        {
            icon: GoOrganization,
            title: 'Головные организации',
            description: 'Обоснование тактико-технических требований к космическим системам. Оценка эффективности и соответствия требованиям существующих и перспективных систем'
        },
        {
            icon: PiBracketsCurly,
            title: 'Разработчики космических систем и их компонентов',
            description: 'Проектирование и оптимизация системы и ее компонентов, проведение виртуальных испытаний'
        },
        {
            icon: LiaUniversitySolid,
            title: 'Университеты и научные институты',
            description: 'Обучение проектированию спутниковых систем, проведение исследований в области баллистики группового полета КА и анализа эффективности применения космических систем в задачах ДЗЗ, связи и контроля околоземного пространства'
        }
    ]
    const functionsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (functionsRef.current) {
            gsap.fromTo(functionsRef.current.children,
                {
                    opacity: 0,
                }, {
                    opacity: 1,
                    duration: 0.7,
                    delay: 0,
                    ease: 'power1.inOut',
                    stagger: .2/2,
                    scrollTrigger: {
                        trigger: functionsRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                });
        }
    }, { scope: functionsRef })
    return (
        <>
            <AnimatedText text={'Для кого полезно?'} className='font-bold text-white lg:text-5xl text-3xl leading-[125%] mb-12'/>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-8 gap-4' ref={functionsRef}>
                {
                    organizations.map((organization) => (
                        <Box key={organization.title} Icon={organization.icon} title={organization.title} description={organization.description} color={'blue'} col={true} />
                    ))
                }
            </div>
        </>
    )
}
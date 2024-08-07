import AnimatedText from "@/components/AnimatedText";
import Box from "@/components/Box";
import {MdModelTraining} from "react-icons/md";
import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";


export const UsefulFor = () => {
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
            <AnimatedText text={'Для кого полезно?'} className='font-bold text-white text-5xl leading-[125%] mb-12'/>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-8 gap-4' ref={functionsRef}>
                <Box Icon={MdModelTraining} title={'Государственные корпорации'} description={'Мы для вас полезны'} color={'green'} col={true} />
            </div>
        </>
    )
}
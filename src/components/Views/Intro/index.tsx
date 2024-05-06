import {ChevronDownWide} from "@gravity-ui/icons";
import {Path1, Path2} from "./Pathes.tsx";
import {useEffect, useRef} from "react";
import TextPlugin from 'gsap/TextPlugin';
import {gsap} from "gsap";

const Intro: React.FC<{id: string}> = ({id}) => {

    gsap.registerPlugin(TextPlugin);

    useEffect(() => {
        gsap.to('#integral', {
            duration: 1,
            delay: 3,
            text: "«ИНТЕГРАЛ»",
            ease: 'none'
        });
    }, []);

    return (
        <>
            <div id={id} className="relative w-full h-screen z-0">
                <div
                    className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                    id="title">
                    <div className="flex items-center justify-center lg:mr-52 mr-16">
                        <h1 className="lg:text-[100px] ubuntu-mono-regular text-[38px] maintext text-right leading-[0.8em] -z-10">ПРОГРАММНЫЙ<br/>КОМПЛЕКС
                        </h1>
                        {/* <div className="leading-[125%] font-light text-left lg:text-lg text-sm uppercase text-slate-400 -z-10 ml-4">Lorem ipsum dolor sit amet</div> */}
                    </div>
                    <Path1 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0' />
                    <Path2 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0' />
                    <h1 className="lg:text-[130px] ubuntu-mono-bold font-mono text-[46px] text-blue-500 lg:ml-52 ml-16 text-left leading-tight font-bold lg:-mt-6 -mt-2 -z-10" id="integral">!N736r2@|_</h1>
                </div>
                <Cross className='absolute left-1/4 top-2/3'/>
                <Cross className='absolute left-[65%] top-[10%] rotate-45 w-10'/>

                 {/*Gradient ellipses */}
                {/*<div className='absolute top-0 right-0 bg-gradient-radial-sky-500 w-full aspect-square opacity-20 translate-x-1/2 -translate-y-1/2 -z-10'></div>*/}
                {/*<div className='absolute left-0 bottom-0 bg-gradient-radial-sky-500 w-full aspect-square opacity-[15%] -translate-x-1/2 translate-y-3/4 -z-10'></div>*/}

            </div>
            <ChevronDownWide id='ChevronDownWide' className='text-slate-100 w-8 h-8 flex-none mx-auto'/>
        </>
    )
}

const Cross: React.FC<{className: string}> = ({className}) => {
    const crossRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        crossRef.current &&
        gsap.fromTo(crossRef.current, {
            y: 10
        }, {
            y: 0,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            duration: 2,
            delay: Math.random()*10
        })
    }, []);

    return (
        <svg ref={crossRef} xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none" className={`${className} cross`}>
            <rect opacity="0.7" x="30" y="32" width="2" height="30" fill="#F8FAFC"/>
            <rect opacity="0.7" x="32" y="30" width="2" height="30" transform="rotate(180 32 30)" fill="#F8FAFC"/>
            <rect opacity="0.7" x="32" y="32" width="2" height="30" transform="rotate(-90 32 32)" fill="#F8FAFC"/>
            <rect opacity="0.7" y="32" width="2" height="30" transform="rotate(-90 0 32)" fill="#F8FAFC"/>
        </svg>
    )
}

export default Intro
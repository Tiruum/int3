import {ChevronDownWide} from "@gravity-ui/icons";
import {Path1, Path2} from "./Pathes.tsx";
import React, {useEffect, useRef} from "react";
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
                    className="absolute left-1/2 top-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 select-none flex-col items-center text-xs sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                    id="title">
                    <div className="flex items-center justify-center gap-2">
                        <div
                            className="ubuntu-mono-regular maintext -z-10 text-right text-[2.25em] leading-[0.9em]">
                            ПРОГРАММНЫЙ<br/>КОМПЛЕКС
                        </div>
                        <div
                            className="-z-10 text-left text-[0.875em] font-light uppercase leading-[1.05] text-slate-400">
                            Проектирование<br/>многоспутниковых<br/>космических<br/>систем
                        </div>
                    </div>
                    <Path1 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0'/>
                    <Path2 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0'/>
                    <div className="ml-auto font-mono text-[3em] font-bold leading-none text-blue-500"
                         id="integral">!N736r2@|_
                    </div>
                </div>
                <Cross className='absolute left-1/4 top-2/3'/>
                <Cross className='absolute left-[65%] top-[10%] rotate-45 w-10'/>

                {/*Gradient ellipses */}
                <div
                    className='absolute top-0 right-0 bg-gradient-radial-sky-500 w-full aspect-square opacity-20 translate-x-1/2 -translate-y-1/2 -z-10'></div>
                <div
                    className='absolute left-0 bottom-0 bg-gradient-radial-red-500 w-full aspect-square opacity-[15%] -translate-x-1/2 translate-y-1/2 -z-10'></div>

            </div>
            <ChevronDownWide id='ChevronDownWide'
                             className='text-slate-100 w-8 h-8 flex-none absolute bottom-3 left-1/2 -translate-x-1/2'/>
        </>
    )
}

const Cross: React.FC<{ className: string }> = ({className}) => {
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
import React from "react";
import AnimatedText from "../../AnimatedText";

const Visualisation: React.FC = () => {
    return (
        <>
        <AnimatedText text={'Визуализация'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
        <div className="w-full h-72 bg-red-800 my-32">Visualisation</div>
        </>
    )
}

export default Visualisation
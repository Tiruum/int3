import React from "react";
import AnimatedText from "../../AnimatedText";

const Description: React.FC = () => {
    return (
        <>
            <AnimatedText text={'Описание'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
            <div className="w-full h-72 bg-red-800 my-32">Description</div>
        </>
    )
}

export default Description
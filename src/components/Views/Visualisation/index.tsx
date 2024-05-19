import React, {useState} from "react";
import AnimatedText from "../../AnimatedText";
import {Earth} from "../../Earth";

const Visualisation: React.FC = () => {
    const [earthFullscreen, setEarthFullscreen] = useState<boolean>(false)
    return (
        <>
        <AnimatedText text={'Визуализация'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
            <div className="border-2 border-green-500 shadow-green-500/25 shadow-lg rounded-3xl h-fit w-full">
                <Earth className={`relative top-0 left-0 h-[32rem] rounded-3xl ${earthFullscreen && 'z-20 block'}`} ifControls={true} setFullscreen={setEarthFullscreen} fullscreen={earthFullscreen} />
            </div>
        </>
    )
}

export default Visualisation
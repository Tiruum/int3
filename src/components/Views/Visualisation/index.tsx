import React, {useState} from "react";
import AnimatedText from "../../AnimatedText";
import {Earth} from "../../Earth";

const Visualisation: React.FC = () => {
    const [earthFullscreen, setEarthFullscreen] = useState<boolean>(false)
    const [ifControls, setIfControls] = useState<boolean>(false)
    return (
        <>
        <AnimatedText text={'Визуализация'} className='font-bold text-white lg:text-5xl text-3xl leading-[125%] mb-12' />
            <div className="relative border-2 border-green-500 shadow-green-500/25 shadow-lg rounded-3xl h-fit w-full">
                {!ifControls && <button className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 z-10'} onClick={() => setIfControls(true)}>Запустить</button>}
                <Earth className={`relative top-0 left-0 h-[32rem] rounded-3xl ${earthFullscreen && 'z-20 block'}`} ifControls={ifControls} setFullscreen={setEarthFullscreen} fullscreen={earthFullscreen}/>
            </div>
        </>
    )
}

export default Visualisation
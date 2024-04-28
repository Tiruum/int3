import React from "react";
import {Rocket} from "@gravity-ui/icons";

interface ScenariosProps {
}

const Scenarios: React.FC<ScenariosProps> = () => {
    return (
        <div>
            <h1 className={'font-bold text-white text-5xl leading-[125%] mb-8'}>Сценарии</h1>
            <div className="grid items-center md:grid-cols-2 grid-cols-1 lg:gap-8 gap-4">
                <div
                    className={`cursor-pointer border-2 border-transparent hover:border-violet-800 group flex flex-col gap-4 justify-center rounded-3xl bg-violet-950 p-8 transition-all`}>
                    <Rocket className={`text-violet-400 w-8 h-8 flex-none`}/>
                    <div className="flex flex-col gap-3">
                        <p className={`text-violet-50 leading-[125%] text-3xl font-bold`}>Название
                            сценария</p>
                        <p className={`text-violet-100 leading-5`}>Описание</p>
                    </div>
                </div>

                <div
                    className={`cursor-pointer border-2 border-transparent hover:border-violet-800 group flex flex-col gap-4 justify-center rounded-3xl bg-violet-950 p-8 transition-all`}>
                    <Rocket className={`text-violet-400 w-8 h-8 flex-none`}/>
                    <div className="flex flex-col gap-3">
                        <p className={`text-violet-50 leading-[125%] text-3xl font-bold`}>Название
                            сценария</p>
                        <p className={`text-violet-100 leading-5`}>Описание</p>
                    </div>
                </div>

                <div
                    className={`cursor-pointer border-2 border-transparent hover:border-violet-800 group flex flex-col gap-4 justify-center rounded-3xl bg-violet-950 p-8 transition-all`}>
                    <Rocket className={`text-violet-400 w-8 h-8 flex-none`}/>
                    <div className="flex flex-col gap-3">
                        <p className={`text-violet-50 leading-[125%] text-3xl font-bold`}>Название
                            сценария</p>
                        <p className={`text-violet-200 leading-5`}>Описание</p>
                    </div>
                </div>

                <div
                    className={`cursor-pointer border-2 border-transparent hover:border-violet-800 group flex flex-col gap-4 justify-center rounded-3xl bg-violet-950 p-8 transition-all`}>
                    <Rocket className={`text-violet-400 w-8 h-8 flex-none`}/>
                    <div className="flex flex-col gap-3">
                        <p className={`text-violet-50 leading-[125%] text-3xl font-bold`}>Название
                            сценария</p>
                        <p className={`text-violet-200 leading-5`}>Описание</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scenarios
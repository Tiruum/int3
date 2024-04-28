import React, {ReactNode} from 'react';

interface BoxProps {
    children?: ReactNode,
    color: string,
    Icon: React.ComponentType<{className: string}>,
    description?: string,
    title?: string,
    col?: boolean,
}

const Box: React.FC<BoxProps> = ({color, Icon, title, description, col}) => {
    return (
        <div
            className={`group flex ${col ? 'flex-col justify-center' : 'items-center'} gap-4 rounded-xl bg-gradient-to-br from-${color}-900 hover:from-${color}-800 to-${color}-950 hover:to-${color}-900 p-4 border hover:border-2 border-${color}-800 hover:border-${color}-600 transition-all`}>
            {Icon && <Icon className={`text-${color}-400 w-8 h-8 flex-none`}/>}
            <div className="flex flex-col gap-1">
                {title && <p className={`text-${color}-50 group-hover:text-white leading-5 text-lg font-bold`}>{title}</p>}
                {description && <p className={`text-${color}-200 group-hover:text-white leading-5`}>{description}</p>}
            </div>
        </div>
    )
}

export default Box
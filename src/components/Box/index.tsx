import React, {ReactNode} from 'react';

interface BoxProps {
    children?: ReactNode,
    color: keyof typeof colorVariants,
    Icon: React.ComponentType<{className: string}>,
    description?: string,
    title?: string,
    col?: boolean,
}

const colorVariants = {
    blue: {
        box: 'from-blue-900 to-blue-950 border-blue-800 ',
        icon: 'text-blue-400',
        title: 'text-blue-50',
        description: 'text-blue-200'
    }
}

const Box: React.FC<BoxProps> = ({color, Icon, title, description, col}) => {
        return (
        <div
            className={`group flex ${col ? 'flex-col justify-center' : 'items-center'} gap-4 rounded-xl bg-gradient-to-br p-4 border ${colorVariants[color].box} transition-all`}>
            {Icon && <Icon className={`${colorVariants[color].icon} w-8 h-8 flex-none`}/>}
            <div className="flex flex-col gap-1">
                {title && <p className={`${colorVariants[color].title} leading-5 text-lg font-bold`}>{title}</p>}
                {description && <p className={`${colorVariants[color].description} leading-5`}>{description}</p>}
            </div>
        </div>
    )
}

export default Box
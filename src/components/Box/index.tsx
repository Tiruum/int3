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
        box: 'from-blue-900/50 to-blue-950/50 border-blue-800',
        icon: 'text-blue-400',
        title: 'text-blue-50',
        description: 'text-blue-200'
    },
    red: {
        box: 'from-red-900/50 to-red-950/50 border-red-800',
        icon: 'text-red-400',
        title: 'text-red-50',
        description: 'text-red-200'
    },
    yellow: {
        box: 'from-yellow-900/50 to-yellow-950/50 border-yellow-800',
        icon: 'text-yellow-400',
        title: 'text-yellow-50',
        description: 'text-yellow-200'
    },
    green: {
        box: 'from-green-900/50 to-green-950/50 border-green-800',
        icon: 'text-green-400',
        title: 'text-green-50',
        description: 'text-green-200'
    }
}

const Box: React.FC<BoxProps> = ({color, Icon, title, description, col}) => {
        return (
        <div
            className={`group flex ${col ? 'flex-col justify-center' : 'items-center'} gap-4 rounded-xl bg-gradient-to-br p-4 border ${colorVariants[color].box} transition-all backdrop-blur-xs`}>
            {Icon && <Icon className={`${colorVariants[color].icon} w-8 h-8 flex-none`}/>}
            <div className="flex flex-col gap-1">
                {title && <p className={`${colorVariants[color].title} leading-5 text-lg font-bold`}>{title}</p>}
                {description && <p className={`${colorVariants[color].description} leading-5`}>{description}</p>}
            </div>
        </div>
    )
}

export default Box
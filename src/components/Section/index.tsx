import React, {CSSProperties, ReactNode} from 'react';

// Типы пропсов для вашего Wrapper компонента
interface SectionProps {
    className?: string; // Необязательный пропс для класса стиля
    children?: ReactNode; // Дочерние элементы, которые будут обёрнуты
    id: string;
    style?: CSSProperties
}

const Section: React.FC<SectionProps> = ({className, children, id, style}) => {
    return (
        <div id={id} style={style} className={`lg:w-11/12 w-full relative lg:p-12 md:p-8 p-6 mx-auto my-40 ${className}`}>
            {children}
        </div>
    );
};

export default Section
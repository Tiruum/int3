import React from "react";

interface Props {
    setShowContact: (show: boolean) => void;
}

const ContactWithUs: React.FC<Props> = ({ setShowContact }) => {
    return (
        <div className={`space-y-8 cursor-pointer`} onClick={() => setShowContact(true)}>
            <h2 className={`font-bold text-2xl`}>ММСП</h2>
            <div className={`flex flex-col gap-4`}>
                <h1 className={'font-bold text-white text-4xl leading-[125%]'}>Получите подробную информацию</h1>
                <p className={`text-lg text-fuchsia-100 lg:w-1/2`}>Заполните форму и мы свяжемся с вами для ответов на
                    любой
                    Ваш вопрос!</p>
            </div>
            <button className="hover:bg-black px-6 py-2 rounded-full bg-gray-100 text-blue-800 font-semibold text-lg">Связаться
                с нами
            </button>
        </div>
    )
}

export default ContactWithUs
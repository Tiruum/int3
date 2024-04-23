import React, { useEffect, useState } from 'react';
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Регистрация плагина ScrollTo
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger) 


const Header: React.FC = () => {
    // Состояние для открытия/закрытия меню на мобильных устройствах
    const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);
    const [section, setSection] = useState<string>('#intro')

    type HeaderItem = {
        value: string,
        url: string
    }

    const headerList: HeaderItem[] = [
        {
            value: 'Интро',
            url: '#intro'
        }, {
            value: 'Преимущества',
            url: '#benefits'
        }, {
            value: 'Функции',
            url: '#functions'
        }, {
            value: 'Визуализация',
            url: '#vizualization'
        }
    ]

    useEffect(() => {
        // Создаем триггер прокрутки для элемента с идентификатором 'triggerElement'
        gsap.to("#intro", {
            scrollTrigger: {
              trigger: "#intro", // элемент триггер
              start: "top center", // когда верх элемента достигает центра
              end: "bottom center", // когда низ элемента покидает центр
              onEnter: () => setSection('#intro'), // срабатывает, когда элемент входит в область
              onLeave: () => {}, // срабатывает, когда элемент покидает область
              onEnterBack: () => setSection('#intro'), // срабатывает, когда возвращается в область сверху
              onLeaveBack: () => setSection('#intro') // срабатывает, когда покидает область снизу
            }
        });

        gsap.to("#benefits", {
            scrollTrigger: {
              trigger: "#benefits", // элемент триггер
              start: "top center", // когда верх элемента достигает центра
              end: "bottom center", // когда низ элемента покидает центр
              onEnter: () => setSection('#benefits'), // срабатывает, когда элемент входит в область
              onLeave: () => {}, // срабатывает, когда элемент покидает область
              onEnterBack: () => setSection('#benefits'), // срабатывает, когда возвращается в область сверху
              onLeaveBack: () => setSection('#benefits') // срабатывает, когда покидает область снизу
            }
        });

        gsap.to("#functions", {
            scrollTrigger: {
                trigger: "#functions", // элемент триггер
                start: "top center", // когда верх элемента достигает центра
                end: "bottom center", // когда низ элемента покидает центр
                onEnter: () => setSection('#functions'), // срабатывает, когда элемент входит в область
                onLeave: () => {}, // срабатывает, когда элемент покидает область
                onEnterBack: () => setSection('#functions'), // срабатывает, когда возвращается в область сверху
                onLeaveBack: () => setSection('#functions') // срабатывает, когда покидает область снизу
            }
        });

        gsap.to("#vizualization", {
            scrollTrigger: {
                trigger: "#vizualization", // элемент триггер
                start: "top center", // когда верх элемента достигает центра
                end: "bottom center", // когда низ элемента покидает центр
                onEnter: () => setSection('#vizualization'), // срабатывает, когда элемент входит в область
                onLeave: () => {}, // срабатывает, когда элемент покидает область
                onEnterBack: () => setSection('#vizualization'), // срабатывает, когда возвращается в область сверху
                onLeaveBack: () => setSection('#vizualization') // срабатывает, когда покидает область снизу
            }
        });
    
        // Очистка эффекта
        return () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <header className='fixed top-0 left-0 right-0'>
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Логотип */}
                <a href="/" className="text-2xl font-bold text-gray-200 flex-none">
                    ММСП{section}
                </a>

                {/* Меню для мобильных устройств */}
                <div className="md:hidden">
                    {/* Иконка бургер-меню, клик по которой открывает/закрывает меню */}
                    <button
                        className="text-white focus:outline-none focus:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Навигационное меню для больших устройств */}
                <nav className="hidden md:flex space-x-0 flex-grow-0 bg-gray-950/50 backdrop-blur-md px-1.5 py-1.5 rounded-full text-gray-200 ubuntu-mono-regular uppercase border-2 border-neutral-500 shadow-md">
                    {headerList.map((headerItem: HeaderItem) => (
                        <ScrollLink to={headerItem.url} key={headerItem.value} setSection={setSection} className={`cursor-pointer hover:text-cyan-500 rounded-full px-4 py-1.5 transition-all border-2 ${section === headerItem.url ? 'border-gray-400' : 'border-transparent'}`}>
                            {headerItem.value}
                        </ScrollLink>
                    ))}
                </nav>

                <button className="hidden md:flex flex-none bg-gray-950/50 backdrop-blur-md text-gray-200 ubuntu-mono-regular uppercase px-6 py-3 border-2 border-gray-500 transition-all hover:border-gray-200 rounded-full">
                    <span className='border-2 border-transparent'>Связаться с нами</span>
                </button>
            </div>

            {/* Выпадающее меню для мобильных устройств */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <nav className="flex flex-col space-y-2">
                        {headerList.map((headerItem: HeaderItem) => (
                            <ScrollLink to={headerItem.url} key={headerItem.value} setSection={setSection} className={`hover:text-cyan-400 rounded-full px-4 py-1.5 transition-all border-2 ${section === headerItem.url ? 'border-gray-400' : 'border-transparent'}`}>
                                {headerItem.value}
                            </ScrollLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

interface ScrollLinkProps {
    to: string; // Селектор элемента, к которому нужно прокрутить
    className: string; // Классы для ScrollLink для кастомизации с помощью Tailwind
    children: React.ReactNode; // Содержимое ссылки
    setSection: Function; // Функция для управления стейтом для переключения отображения активной страницы
}

const ScrollLink: React.FC<ScrollLinkProps> = ({ to, children, className }) => {
    const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        const element = document.querySelector(to);

        if (element) {
            // Получаем высоту окна просмотра
            const windowHeight = window.innerHeight;

            // Вычисляем позицию элемента и его высоту
            const elementRect = element.getBoundingClientRect();
            const elementTop = window.scrollY + elementRect.top;  // Абсолютное положение элемента относительно документа
            const elementHeight = elementRect.height;

            // Вычисляем позицию прокрутки
            const scrollToPosition = elementTop + elementHeight / 2 - windowHeight / 2;

            // GSAP анимация прокрутки
            gsap.to(window, {
                duration: .5,
                scrollTo: { y: scrollToPosition, autoKill: false }
            });
        };
    };

    return (
        <a href="#" onClick={scrollToSection} className={className}>
            {children}
        </a>
    );
};

export default Header;

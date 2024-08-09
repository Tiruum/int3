import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import mainImage from '/scenarios/periodicallyWatch/main.png'
import AnimatedText from "@/components/AnimatedText";

export const PeriodicallyWatch = () => {
    const slideshow = [
        {
            src: '/scenarios/periodicallyWatch/00.png',
            label: 'Задание камеры ДЗЗ'
        },
        {
            src: '/scenarios/periodicallyWatch/01.png',
            label: 'Задание конструкции КА'
        },
        {
            src: '/scenarios/periodicallyWatch/02.png',
            label: 'Задание группировки КА'
        },
        {
            src: '/scenarios/periodicallyWatch/03.png',
            label: 'Задание точечных целей ДЗЗ'
        },
        {
            src: '/scenarios/periodicallyWatch/04.png',
            label: 'Запуск расчета'
        },
        {
            src: '/scenarios/periodicallyWatch/05.png',
            label: 'Произведенный расчет'
        },
        {
            src: '/scenarios/periodicallyWatch/06.png',
            label: 'Результаты по районам зондирования, таблица с параметрами съёмки'
        },
        {
            src: '/scenarios/periodicallyWatch/07.png',
            label: 'Просмотр циклограмм наблюдения каждой точки'
        },
        {
            src: '/scenarios/periodicallyWatch/08.png',
            label: 'Зависимость средней периодичности от широты'
        }]

    return (
        <>
            <AnimatedText text={'Периодичность наблюдения'}
                          className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'/>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <div className='space-y-2'>
                    <p className="text-gray-100 w-4/5">Цель: произвести съёмку точечных целей на различных широтах и
                        определить
                        зависимость средней периодичности наблюдения цели от широты.</p>
                    <p className="text-gray-100 w-4/5">Входные данные: параметры оптической камеры ДЗЗ, конструкции КА,
                        орбитального
                        построения группировки КА, группы точечных целей ДЗЗ.</p>
                    <br/>
                    <p className='text-gray-100'>Периодичность наблюдения — один из основных критериев
                        эффективности систем ДЗЗ. Он показывает, как часто объект можно наблюдать из космоса данной
                        системой.</p>
                    <p className='text-gray-100'>Основным преимуществом новых многоспутниковых систем может
                        стать возможность обеспечения низкой
                        периодичности, так с большим числом аппаратов, любую точку на земле можно будет наблюдать почти
                        постоянно.</p>
                    <p className='text-gray-100'>Большую роль при проектировании таких систем играет
                        правильное распределение КА по орбитам.
                        Для анализа и оптимизации таких систем проводят множество расчетов по данному сценарию.</p>
                </div>
                <div className="w-full my-2 space-y-1">
                    <img src={mainImage} alt="mainImage" className='bg-white select-none rounded-xl'/>
                    <p className="text-center">Основной сценарий для проектирования систем ДЗЗ</p>
                </div>
            </div>

            <ol className="relative mt-8 border-s-2 border-gray-700 space-y-10">
                <li className="ps-8">
                    <h3 className="relative flex items-center mb-1 text-xl font-semibold text-gray-200 tracking-tight">
                        <span
                            className="absolute block -left-8 rounded-tr-full rounded-br-full top-0 h-full bg-gray-700 w-2"/>
                        <p className={`lg:w-1/2`}>Задание входных данных</p>
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500 lg:w-1/2">Задание
                        необходимых данных для запуска расчета
                    </time>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-4/5"></p>
                    {
                        slideshow &&
                        <Carousel className={'lg:w-4/5 w-full my-2'}>
                            <CarouselContent>
                                {slideshow.map((image, i) => (
                                    i <= 4 &&
                                    <CarouselItem key={`periodicallyWatch_image${image.src.slice(-6, -4)}`}
                                                  className={'space-y-1'}>
                                        <p className='text-center'>{image.label}</p>
                                        <img src={image.src} alt=''
                                             className={'bg-white select-none rounded-xl'}/>
                                    </CarouselItem>
                                ))
                                }
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                    }
                </li>

                <li className="ps-8">
                    <h3 className="relative flex items-center mb-1 text-xl font-semibold text-gray-200 tracking-tight">
                        <span
                            className="absolute block -left-8 rounded-tr-full rounded-br-full top-0 h-full bg-gray-700 w-2"/>
                        <p className={`lg:w-1/2`}>Анализ результатов</p>
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500 lg:w-1/2">Описание
                        выходных данных
                    </time>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">В результате вычисления дневной
                        периодичности (с учётом длительности светлой части суток), усреднённой по долготам, в каждом
                        широтном поясе определена зависимость средней периодичности от широты. Обнаружено, что средняя
                        периодичность обзора зависит от широты цели линейным образом и уменьшается с увеличением
                        широты.</p>
                    {
                        slideshow &&
                        <Carousel className={'lg:w-4/5 w-full my-2'}>
                            <CarouselContent>
                                {slideshow.map((image, i) => (
                                    i > 4 &&
                                    <CarouselItem key={`periodicallyWatch_image${image.src.slice(-6, -4)}`}
                                                  className={'space-y-1'}>
                                        <p className='text-center'>{image.label}</p>
                                        <img src={image.src} alt=''
                                             className={'bg-white w-full select-none rounded-xl'}/>
                                    </CarouselItem>
                                ))
                                }
                            </CarouselContent>
                            <CarouselPrevious/>
                            <CarouselNext/>
                        </Carousel>
                    }
                </li>
            </ol>
        </>
    )
}
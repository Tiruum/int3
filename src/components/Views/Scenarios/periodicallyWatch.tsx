import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";

export const PeriodicallyWatch = () => {
    const slideshow = ['/scenarios/periodicallyWatch/00.png',
        '/scenarios/periodicallyWatch/01.png',
        '/scenarios/periodicallyWatch/02.png',
        '/scenarios/periodicallyWatch/03.png',
        '/scenarios/periodicallyWatch/04.png',
        '/scenarios/periodicallyWatch/05.png',
        '/scenarios/periodicallyWatch/06.png',
        '/scenarios/periodicallyWatch/07.png',
        '/scenarios/periodicallyWatch/08.png']

    return (
        <>
            <h1 className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'>Периодичность наблюдения</h1>
            <p className="text-gray-100">Цель: произвести съёмку точечных целей на различных широтах и определить
                зависимость средней периодичности наблюдения цели от широты.</p>
            <p className="text-gray-100">Входные данные: параметры оптической камеры ДЗЗ, конструкции КА, орбитального
                построения группировки КА, группы точечных целей ДЗЗ.</p>

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
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Задание камеры ДЗЗ</p>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Задание конструкции КА</p>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Задание группировки КА</p>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Задание точечных целей ДЗЗ</p>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Запуск расчета</p>
                    {
                        slideshow &&
                        <Carousel className={'lg:w-5/6 w-full my-2'}>
                            <CarouselContent>
                                {slideshow.map((image, i) => (
                                    i <= 4 &&
                                    <CarouselItem key={`periodicallyWatch_image${image.slice(-6, -4)}`}>
                                        <img src={image} alt=''
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
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Результаты по районам
                        зондирования, таблица с параметрами съёмки</p>
                    <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">Просмотр циклограмм
                        наблюдения каждой точки</p>
                    {
                        slideshow &&
                        <Carousel className={'lg:w-5/6 w-full my-2'}>
                            <CarouselContent>
                                {slideshow.map((image, i) => (
                                    i > 4 &&
                                    <CarouselItem key={`periodicallyWatch_image${image.slice(-6, -4)}`}>
                                        <img src={image} alt=''
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
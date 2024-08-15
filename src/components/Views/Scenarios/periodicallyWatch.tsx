import mainImage from '/scenarios/periodicallyWatch/main.png'
import AnimatedText from "@/components/AnimatedText";
import {Step} from "@/components/Views/Scenarios/step.tsx";

export const PeriodicallyWatch = () => {
    const slideshow = [
        {
            id: 0,
            src: '/scenarios/periodicallyWatch/00.png',
            label: 'Задание камеры ДЗЗ'
        },
        {
            id: 1,
            src: '/scenarios/periodicallyWatch/01.png',
            label: 'Задание конструкции КА'
        },
        {
            id: 2,
            src: '/scenarios/periodicallyWatch/02.png',
            label: 'Задание группировки КА'
        },
        {
            id: 3,
            src: '/scenarios/periodicallyWatch/03.png',
            label: 'Задание точечных целей ДЗЗ'
        },
        {
            id: 4,
            src: '/scenarios/periodicallyWatch/04.png',
            label: 'Запуск расчета'
        },
        {
            id: 5,
            src: '/scenarios/periodicallyWatch/05.png',
            label: 'Произведенный расчет'
        },
        {
            id: 6,
            src: '/scenarios/periodicallyWatch/06.png',
            label: 'Результаты по районам зондирования, таблица с параметрами съемки'
        },
        {
            id: 7,
            src: '/scenarios/periodicallyWatch/07.png',
            label: 'Просмотр циклограмм наблюдения каждой точки'
        },
        {
            id: 8,
            src: '/scenarios/periodicallyWatch/08.png',
            label: 'Зависимость средней периодичности от широты'
        }]

    return (
        <>
            <AnimatedText text={'Периодичность наблюдения'}
                          className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'/>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <div className='space-y-2'>
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
                <Step images={slideshow.filter((point) => point.id <= 4)} listName={'periodicallyWatch'}
                      title={'Задание входных данных'}
                      subtitle={'Задание необходимых данных для запуска расчета'}
                />

                <Step images={slideshow.filter((point) => point.id > 4)} listName={'mergedGroup'}
                      title={'Анализ результатов'}
                      subtitle={'Описание выходных данных'}
                      description={'В результате вычисления дневной периодичности (с учетом длительности светлой части суток),' +
                          'усредненной по долготам, в каждом широтном поясе определена зависимость средней периодичности от широты.' +
                          'Обнаружено, что средняя периодичность обзора зависит от широты цели линейным образом и уменьшается' +
                          'с увеличением широты.'}
                />
            </ol>
        </>
    )
}
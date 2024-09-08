import mainImage from '/scenarios/abonent/main.png'
import AnimatedText from "@/components/AnimatedText";
import {Step} from "@/components/Views/Scenarios/step.tsx";

export const Abonent = () => {
    const slideshow = [
        {
            id: 0,
            src: '/scenarios/abonent/00.png',
            label: 'Задание системы связи'
        },
        {
            id: 1,
            src: '/scenarios/abonent/01.png',
            label: 'Задание конструкции космического аппарата'
        },
        {
            id: 2,
            src: '/scenarios/abonent/02.png',
            label: 'Задание группировки космического аппарата'
        },
        {
            id: 3,
            src: '/scenarios/abonent/03.png',
            label: 'Задание наземных станций'
        },
        {
            id: 4,
            src: '/scenarios/abonent/04.png',
            label: 'Задание абонента'
        },
        {
            id: 5,
            src: '/scenarios/abonent/05.png',
            label: 'Задание отправки сообщений'
        },
        {
            id: 6,
            src: '/scenarios/abonent/06.png',
            label: 'Запуск расчета'
        },
        {
            id: 7,
            src: '/scenarios/abonent/07.png',
            label: 'Просмотр результатов расчета'
        },
        {
            id: 8,
            src: '/scenarios/abonent/08.png',
            label: 'Определение процента недоставленной информации и оперативности доставки данных'
        },
        {
            id: 9,
            src: '/scenarios/abonent/09.png',
            label: 'Определение времени ожидания сеанса связи для абонента'
        },
        {
            id: 10,
            src: '/scenarios/abonent/10.png',
            label: 'Просмотр циклограммы связи абонента с космическим аппаратом'
        },
        {
            id: 11,
            src: '/scenarios/abonent/11.png',
            label: 'Определение объема загруженных станциями данных и времени ожидания сеанса связи для каждой станции'
        },
        {
            id: 12,
            src: '/scenarios/abonent/12.png',
            label: 'Задание абонентов в различных регионах'
        },
        {
            id: 13,
            src: '/scenarios/abonent/13.png',
            label: 'Задание отправки сообщений для обоих типов связи'
        },
        {
            id: 14,
            src: '/scenarios/abonent/14.png',
            label: 'Запуск расчета'
        },
        {
            id: 15,
            src: '/scenarios/abonent/15.png',
            label: 'Просмотр результатов расчета'
        },
        {
            id: 16,
            src: '/scenarios/abonent/16.png',
            label: 'Определение процента недоставленной информации и оперативности доставки данных'
        },
        {
            id: 17,
            src: '/scenarios/abonent/17.png',
            label: 'Определение времени ожидания сеанса связи для абонента'
        },
        {
            id: 18,
            src: '/scenarios/abonent/18.png',
            label: 'Определение объема загруженных станциями данных и времени ожидания сеанса связи для каждой станции'
        }]

    return (
        <>
            <AnimatedText text={'Абонентская связь'}
                          className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'/>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <div className='space-y-2'>
                    <p className='text-gray-100'>Перспективные группировки связи на низких орбитах могут обеспечить
                        большие пропускные способности сети и меньшие задержки.</p>
                    <p className='text-gray-100'>Одна из ключевых особенностей таких группировок — применение
                        межспутниковой связи, что обеспечивает наименьшие задержки для абонентов по всему миру.</p>
                    <p className='text-gray-100'>Данный сценарий — основной для проектирования многоспутниковых систем
                        связи.</p>
                </div>
                <div className="w-full my-2 space-y-1">
                    <img src={mainImage} alt="mainImage" className='bg-white select-none rounded-xl'/>
                    <p className="text-center">Основной сценарий для проектирования систем связи</p>
                </div>
            </div>

            <ol className="relative mt-8 border-s-2 border-gray-700 space-y-10">

                <Step images={slideshow.filter((point) => point.id <= 6)} listName={'abonent'}
                      title={'Задание входных данных для варианта 1: передача заданных пакетов от абонента на станции'}
                      subtitle={'Задание необходимых данных для запуска первого расчета'}
                />

                <Step images={slideshow.filter((point) => point.id > 6 && point.id <= 11)} listName={'abonent'}
                      title={'Анализ результатов для варианта 1'}
                      subtitle={'Описание выходных данных для первого расчета'}
                />

                <Step images={slideshow.filter((point) => point.id > 11 && point.id <= 14)} listName={'abonent'}
                      title={'Задание входных данных для варианта 2: передача случайных пакетов от нескольких абонентов на станции и между абонентами'}
                      subtitle={'Описание входных данных для второго расчета'}
                />

                <Step images={slideshow.filter((point) => point.id > 15 && point.id <= 18)} listName={'abonent'}
                      title={'Анализ результатов для варианта 2'}
                      subtitle={'Описание выходных данных для второго расчета'}
                      description={'Данные переданы практически полностью (потери < 1%). Средняя оперативность доставки данных 4.4 с, что говорит о достаточно быстрой передаче данных. Время ожидания связи от 20 до 40 с в зависимости от местоположения абонента, результат приемлемый. Среднее время ожидания на станциях 24-35 с.'}
                />
            </ol>
        </>
    )
}
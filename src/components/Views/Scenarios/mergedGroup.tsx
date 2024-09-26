import mainImage from '/scenarios/mergedGroup/main.png'
import AnimatedText from "@/components/AnimatedText";
import {Step} from "@/components/Views/Scenarios/step.tsx";

export const MergedGroup = () => {
    const slideshow = [
        {
            id: 0,
            src: '/scenarios/mergedGroup/00.png',
            label: 'Задание компонентов: систем связи для обоих типов космических аппаратов и камер ДЗЗ'
        },
        {
            id: 1,
            src: '/scenarios/mergedGroup/01.png',
            label: 'Задание конструкций космических аппаратов ДЗЗ и связи'
        },
        {
            id: 2,
            src: '/scenarios/mergedGroup/02.png',
            label: 'Задание группировок космических аппаратов'
        },
        {
            id: 3,
            src: '/scenarios/mergedGroup/03.png',
            label: 'Задание цели ДЗЗ'
        },
        {
            id: 4,
            src: '/scenarios/mergedGroup/04.png',
            label: 'Задание наземных станций'
        },
        {
            id: 5,
            src: '/scenarios/mergedGroup/05.png',
            label: 'Задание абонентов'
        },
        {
            id: 6,
            src: '/scenarios/mergedGroup/06.png',
            label: 'Задание отправки сообщений'
        },
        {
            id: 7,
            src: '/scenarios/mergedGroup/07.png',
            label: 'Запуск расчета'
        },
        {
            id: 8,
            src: '/scenarios/mergedGroup/08.png',
            label: 'Просмотр результатов расчета'
        },
        {
            id: 9,
            src: '/scenarios/mergedGroup/09.png',
            label: 'Определение процента недоставленной информации и оперативности доставки данных'
        },
        {
            id: 10,
            src: '/scenarios/mergedGroup/10.png',
            label: 'Определение времени ожидания сеанса связи для абонентов'
        },
        {
            id: 11,
            src: '/scenarios/mergedGroup/11.png',
            label: 'Определение объема загруженных станциями данных и времени ожидания сеанса связи для каждой станции'
        }]

    return (
        <>
            <AnimatedText text={'Объединенная группировка'}
                          className='font-bold text-gray-50 text-4xl leading-[125%] mb-8'/>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <div className='space-y-2'>
                    <p className='text-gray-100'>Применение технологий межспутниковой связи открывает возможность
                        создания связанной группировки ДЗЗ и связи.
                    </p>
                    <p className='text-gray-100'>Это существенно ускоряет доставку данных ДЗЗ и время, необходимое для съемки точки по заявке потребителя. В такой группировке космические аппараты ДЗЗ могут получать и передавать данные на Землю через космические аппараты связи.
                    </p>
                    <p className='text-gray-100'>Данный сценарий позволяет оценить эффективность подобной группировки
                        при ее проектировании.</p>
                </div>
                <div className="w-full my-2 space-y-1">
                    <img src={mainImage} alt="mainImage" className='bg-white select-none rounded-xl'/>
                    <p className="text-center">Основной сценарий для проектирования систем ДЗЗ и связи</p>
                </div>
            </div>

            <ol className="relative mt-8 border-s-2 border-gray-700 space-y-10">
                <Step images={slideshow.filter((point) => point.id <= 7)} listName={'mergedGroup'}
                      title={'Задание входных данных'}
                      subtitle={'Задание необходимых данных для запуска расчета'}
                />

                <Step images={slideshow.filter((point) => point.id > 7)} listName={'mergedGroup'}
                      title={'Анализ результатов'}
                      subtitle={'Описание выходных данных'}
                      description={'Данные переданы практически полностью (потери < 0.1%), оперативность доставки данных 188 с, время ожидания связи для абонентов 19-43 с, результат приемлемый. Среднее время ожидания связи на станциях 61-1742 с в зависимости от положения станции. Задачи связи выполнены успешно, построенная космическая система удовлетворяет предъявляемым требованиям по эффективности.'}
                />
            </ol>
        </>
    )
}
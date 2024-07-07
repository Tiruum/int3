import { ChevronRight } from "@gravity-ui/icons"
import AnimatedText from "../../AnimatedText";
import {useEffect, useRef, useState} from "react";

export const Media = () => {
    const truncate = (text: string):string => {
        const length = 90
        return text.length <= 90 ? text + '.' : text.substring(0, length) + '...'
    }
    type Article = {
        id: number,
        date: Date,
        source: string,
        text: string,
        url: string
    }
    const articles: Article[] = [
        {
            id: 0,
            source: 'Портал «TAdviser»',
            date: new Date('2020-10-27'),
            text: '27 октября 2020 Фонд перспективных исследований сообщил о создании программы управления сотнями спутников на орбите. создании программы управления сотнями спутников на орбите',
            url: 'https://www.tadviser.ru/index.php/Продукт:Интеграл-Д_%28программа_для_управления_спутниками%29'
        }, {
            id: 1,
            source: 'Новости регионов «Беzформата»',
            date: new Date('2023-10-26'),
            text: 'Физтехи представили Владимиру Путину свои разработки в области космической отрасли. 26 октября в РКК «Энергия» прошли встреча Президента РФ Владимира Путина с молодыми учеными и совещание по развитию ракетно-космической отрасли страны.',
            url: 'https://dolgoprudniy.bezformata.com/listnews/svoi-razrabotki-v-oblasti-kosmicheskoy/123331481/'
        }, {
            id: 2,
            source: 'Новости регионов «Беzформата»',
            date: new Date('2020-10-28'),
            text: 'Протестирован программный комплекс для проектирования многоспутниковых систем. В рамках совместного проекта Фонда перспективных исследований и МФТИ «Интеграл-Д» успешно протестирован первый российский программный комплекс для проектирования многоспутниковых космических систем.',
            url: 'https://dolgoprudniy.bezformata.com/listnews/proektirovaniya-mnogosputnikovih-sistem/88363536/'
        }, {
            id: 3,
            source: 'Журнал «За науку»',
            date: new Date('2020-10-28'),
            text: 'Большинство современных технологий практического использования космоса требуют мультидисциплинарных подходов, и Физтех обеспечивает их. Сотрудники и выпускники Физтех-школы аэрокосмических технологий (ФАКТ) участвуют в проектах ГЛОНАСС, Superjet-100, МКС, работают над новыми гиперзвуковыми летательными аппаратами, глобальными системами связи и дистанционного зондирования Земли (в частности, над «Сферой»), современными моделями климата.',
            url: 'https://zanauku.mipt.ru/2021/04/26/integralnyj-otvet/'
        }, {
            id: 4,
            source: 'Фонд перспективных исследований',
            date: new Date('2010-11-06'),
            text: 'Программный комплекс моделирования и проектирования спутниковых группировок. Совместный проект Фонда перспективных исследований и Московского физико-технического института (МФТИ)',
            url: 'https://fpi.gov.ru/projects/fiziko-tekhnicheskie-issledovaniya/integral/'
        }, {
            id: 5,
            source: 'Роскосмос',
            date: new Date('2022-01-02'),
            text: 'В 2022 году Фонд перспективных исследований (ФПИ) отпразднует свое десятилетие. Основная его задача — содействие в разработке инновационных технологий и производства высокотехнологичной продукции военного, специального и двойного назначения.',
            url: 'https://www.roscosmos.ru/33784/'
        }, {
            id: 6,
            source: 'Aviation Explorer',
            date: new Date('2020-10-27'),
            text: 'ФПИ разрабатывает программный комплекс для проектирования многоспутниковых космических систем',
            url: 'https://www.aex.ru/news/2020/10/27/218421/'
        }, {
            id: 7,
            source: 'Национальная оборона',
            date: new Date('2020-11-19'),
            text: 'Россия создает программу управления сотнями спутников. В рамках совместного проекта Фонда перспективных исследований (ФПИ) и Московского физико-технического института (МФТИ) «Интеграл-Д» успешно протестирован первый российский программный комплекс для проектирования многоспутниковых космических систем.',
            url: 'https://oborona.ru/product/zhurnal-nacionalnaya-oborona/rossiya-sozdaet-programmu-upravleniya-sotnyami-sputnikov-41185.shtml'
        }, {
            id: 8,
            source: 'ИА «Красная весна»',
            date: new Date('2021-07-25'),
            text: 'МФТИ провел работу по комплексу для моделирования космических группировок. Разработка программного комплекса для проектирования многоспутниковых космических группировок идет',
            url: 'https://rossaprimavera.ru/news/878ae135'
        }, {
            id: 9,
            source: 'Новости ВПК',
            date: new Date('2021-07-26'),
            text: 'Физтех разработает программу для проектирования многоспутниковых группировок.',
            url: 'https://vpk.name/news/526690_fizteh_razrabotaet_programmu_dlya_proektirovaniya_mnogosputnikovyh_gruppirovok.html'
        }, {
            id: 10,
            source: 'Интернет-портал СНГ',
            date: new Date('2021-07-26'),
            text: 'Разработка программного комплекса для проектирования многоспутниковых космических группировок идет в Московском физико-техническом институте (МФТИ), заявил представитель МФТИ на Международном авиационно-космическом салоне, сообщает 25 июля ИА REGNUM.',
            url: 'https://e-cis.info/news/569/93623/'
        }, {
            id: 11,
            source: 'TechInsider',
            date: new Date('2021-07-27'),
            text: 'В России сделают программу для проектирования спутниковых группировок. Как сообщает ТАСС, Московский физико-технический институт при поддержке',
            url: 'https://www.techinsider.ru/technologies/news-726503-v-rossii-sdelayut-programmu-dlya-proektirovaniya-sputnikovyh-gruppirovok/'
        }, {
            id: 12,
            source: 'ТАСС',
            date: new Date('2022-07-25'),
            text: 'Физтех разработает программу для проектирования многоспутниковых группировок⁠⁠.',
            url: 'https://tass.ru/kosmos/11980285'
        }, {
            id: 13,
            source: 'Pikabu',
            date: new Date('2021-10-27'),
            text: 'Фонд перспективных исследований совместно с Московским физико-техническим институтом завершили начальный этап разработки первого российского софта⁠⁠.',
            url: 'https://pikabu.ru/story/rossiya_sozdaet_programmu_upravleniya_sotnyami_sputnikov_na_orbite_7795426'
        }, {
            id: 14,
            source: 'Pikabu',
            date: new Date('2020-10-27'),
            text: 'Проекты по развёртыванию орбитальных группировок из сотен спутников в виде систем OneWeb, Starlink или российской «Сферы» требуют тщательного проектирования и учитывают столько факторов, что без развитого программного обеспечения никак не обойтись.',
            url: 'https://pikabu.ru/story/v_rossii_protestirovana_programma_upravleniya_sotnyami_sputnikov_na_orbite_7798622'
        }
    ].sort((one: Article, two: Article) => Number(two.date) - Number(one.date))

    const displayArticles = useRef(articles)

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        let scrollInterval: NodeJS.Timeout;

        if (scrollContainer) {
            if (scrollContainer.scrollWidth > window.innerWidth) {
                displayArticles.current = [...articles, ...articles]
                scrollInterval = setInterval((): void => {
                    if (!isHovered) {
                        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2 + 10) {
                            scrollContainer.scrollLeft = 0;
                        } else {
                            scrollContainer.scrollLeft += 1;
                        }
                    }
                }, 20);
            }
        }

        return () => {
            clearInterval(scrollInterval);
        };
    }, [isHovered, articles]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            <AnimatedText text={'СМИ о нас'} className='font-bold text-white text-5xl leading-[125%] mb-12' />
            <div ref={scrollContainerRef}
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}
                 className="hideScroll overflow-x-auto gap-5 flex items-center">
                {
                    [...displayArticles.current].map((article: Article, index: number)=> (
                        <div key={`${article.id}_${index}`} className='flex-none w-80 h-48 border border-slate-400 rounded-xl group transition-all p-5 bg-gray-950/50 backdrop-blur-sm hover:border-sky-500'>
                            <p className="text-slate-400 text-xs group-hover:text-white">{article.source}</p>
                            <p className="text-base text-pretty text-slate-100 group-hover:text-sky-100">{truncate(article.text)}</p>

                            <a href={article.url} target="_blank" className="text-base mt-auto font-bold text-sky-500 group-hover:text-sky-50 flex items-center">Перейти к новости <ChevronRight /></a>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
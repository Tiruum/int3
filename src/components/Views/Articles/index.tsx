import { ChevronRight } from "@gravity-ui/icons";
import {FunctionComponent, useEffect, useRef, useState} from "react";
import AnimatedText from "../../AnimatedText";

const Articles: FunctionComponent = () => {
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
        source: 'Springer',
        date: new Date('2021-01-01'),
        text: 'Using an Interpolation Model of the Gravitational Potential for High-Precision Ballistic Calculations',
        url: 'https://link.springer.com/chapter/10.1007/978-981-16-8154-7_19'
    }, {
        id: 1,
        source: 'Moscow institute of physics and technology',
        date: new Date('2020-01-06'),
        text: 'Methods for accurate ballistics calculations formulti-satellite constellations',
        url: 'https://www.gaussteam.com/wordpress/wp-content/uploads/2020/03/IAA-AAS-CU-20-01-06-Methods-for-Accurate-Ballistics-Calculations-for-Multi-Satellite-Constellation-min.pdf'
    }, {
        id: 2,
        source: 'eLibrary.ru',
        date: new Date('2019-10-21'),
        text: 'Methods for detecting subtle space debris using information from optical telescopes',
        url: 'https://www.elibrary.ru/item.asp?id=43247541'
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
                        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth/2+10) {
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
      <AnimatedText text={'Статьи с упоминанием нас'} className='font-bold text-white text-5xl leading-[125%] mb-12' />

          <div ref={scrollContainerRef}
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
               className="overflow-x-auto gap-5 flex items-center hideScroll"
               style={{WebkitMask: "linear-gradient( to left, rgb(0, 0, 0, 0) 0%, rgb(0, 0, 0, 1) 5%, rgb(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100% )"}}>
              {
                  [...displayArticles.current].map((article) => (
                      <div key={article.id}
                           className='flex-none w-80 h-48 backdrop-blur-xs border rounded-xl group transition-all p-5 bg-gradient-to-bl from-violet-900/50 hover:from-violet-800/50 to-violet-950/50 hover:to-violet-900/50 border-violet-800 hover:border-violet-700'>
                          <p className="text-violet-300 text-xs group-hover:text-violet-200">{article.source}</p>
                          <p className="text-base text-pretty text-slate-100 group-hover:text-violet-100">{truncate(article.text)}</p>

                          <a href={article.url} target="_blank"
                             className="text-base mt-auto font-bold text-violet-400 group-hover:text-violet-50 flex items-center">Перейти
                              к статье <ChevronRight/></a>
                      </div>
                  ))
              }
          </div>
      </>
  );
}

export default Articles;

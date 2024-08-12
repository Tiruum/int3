import AnimatedText from "../../AnimatedText";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollContainer} from "@/components/ScrollContainer";
import React from "react";

gsap.registerPlugin(ScrollTrigger)

const Articles: React.FC = () => {
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

    return (
        <>
            <AnimatedText text={'Статьи с упоминанием нас'}
                          className='font-bold text-white lg:text-5xl text-3xl leading-[125%] mb-12'/>

            <ScrollContainer elements={articles} displayName={'articles'}/>
        </>
    );
}

export default Articles;

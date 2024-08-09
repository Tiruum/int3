import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import React from "react";

interface Point {
    id: number;
    src: string,
    label: string
}

interface StepProps {
    listName: string,
    images?: Point[],
    title?: string,
    subtitle?: string,
    description?: string
}

export const Step: React.FC<StepProps> = ({title, subtitle, description, images, listName}) => {
    return (
        <li className="ps-8">
            {title &&
                <h3 className="relative flex items-center mb-1 text-xl font-semibold text-gray-200 tracking-tight">
                <span
                    className="absolute block -left-8 rounded-tr-full rounded-br-full top-0 h-full bg-gray-700 w-2"/>
                    <p className={`lg:w-1/2`}>{title}</p>
                </h3>}
            {subtitle && <time
                className="block mb-2 text-sm font-normal leading-none text-gray-500 lg:w-1/2">{subtitle}</time>}
            {description && <p className="mb-4 text-base font-normal text-gray-200 lg:w-5/6">{description}</p>}
            {
                images &&
                <Carousel className={'lg:w-4/5 w-full my-2'}>
                    <CarouselContent>
                        {images.map((image) => (
                            <CarouselItem key={`${listName}_image${image.id}`}
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
    )
}
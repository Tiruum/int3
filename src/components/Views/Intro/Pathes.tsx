import React, {useEffect, useRef} from "react";
import gsap from "gsap";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);


const Path1: React.FC<{ className: string }> = ({className}) => {

    const satellite1Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        satellite1Ref.current &&
        gsap.to(satellite1Ref.current, {
            duration: 12,
            ease: "none",
            repeat: -1,
            delay: 1,
            motionPath: {
                path: "#path1",
                align: "#path1",
                autoRotate: true,
                alignOrigin: [0.5, 0.5],
            }
        });
    }, []);

    return (
        <div className={`${className}`}>
            <div ref={satellite1Ref} className='lg:w-4 w-1 lg:h-4 h-1 sat2 relative'>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42" fill="none" className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <path d="M8.39806 26.7123H0.651002L0.651001 14.0756L8.39806 14.0756L8.39806 26.7123ZM25.5553 26.7123H33.349L33.349 14.0756H25.5553L25.5553 26.7123ZM9.94663 30.2422C8.06289 32.126 7.02345 34.6312 7.02451 37.2967V38.0476H15.5013L15.5013 41.0323H18.5009V38.0476L26.9766 38.0487L26.9766 37.2977C26.9766 34.6334 25.9393 32.1281 24.0545 30.2433C22.1697 28.3585 19.6655 27.3201 17 27.3212C14.3356 27.3212 11.8304 28.3585 9.94663 30.2422ZM18.8053 0.900121L15.146 0.900116C13.1403 0.901178 11.3955 2.65021 11.3965 4.64955L11.3955 25.6029C13.1244 24.7735 15.0251 24.3216 16.9979 24.3216C18.9538 24.3216 20.8375 24.765 22.5547 25.5806L22.5536 4.65061C22.5536 2.58233 20.8714 0.900119 18.8031 0.900117L18.8053 0.900121Z" fill="#F8FAFC"/>
                </svg>
            </div>
            <svg className='lg:w-[662px] w-[85vw] lg:h-[540px] h-[69vw]' viewBox="0 0 662 540" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path id="path1"
                      d="M251.385 373.176C162.831 304.432 91.6459 230.653 48.1382 166.953C26.3826 135.1 11.5641 105.792 4.9426 80.9111C-1.6814 56.0209 -0.0798633 35.6584 10.8503 21.5784C21.7804 7.49846 41.1099 0.897995 66.8653 1.14357C92.6109 1.38904 124.678 8.47782 160.93 21.6561C233.429 48.0105 322.555 98.6785 411.11 167.423C499.665 236.167 570.849 309.946 614.357 373.647C636.113 405.499 650.931 434.807 657.553 459.688C664.177 484.578 662.575 504.941 651.645 519.021C640.715 533.101 621.385 539.701 595.63 539.455C569.884 539.21 537.817 532.121 501.565 518.943C429.066 492.588 339.94 441.921 251.385 373.176Z"
                      stroke="#94A3B8" opacity={0.7} strokeLinecap="round" strokeDasharray="10 20"/>
            </svg>
        </div>
    )
}

const Path2: React.FC<{ className: string }> = ({className}) => {
    const satellite2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        satellite2Ref.current &&
        gsap.to(satellite2Ref.current, {
            duration: 8,
            ease: "none",
            repeat: -1,
            motionPath: {
                path: "#path2",
                align: "#path2",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });
    }, []);

    return (
        <div className={`${className}`}>
            <div ref={satellite2Ref} className='lg:w-4 w-1 lg:h-4 h-1 sat2 relative'>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42" fill="none"
                     className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <path d="M8.39806 26.7123H0.651002L0.651001 14.0756L8.39806 14.0756L8.39806 26.7123ZM25.5553 26.7123H33.349L33.349 14.0756H25.5553L25.5553 26.7123ZM9.94663 30.2422C8.06289 32.126 7.02345 34.6312 7.02451 37.2967V38.0476H15.5013L15.5013 41.0323H18.5009V38.0476L26.9766 38.0487L26.9766 37.2977C26.9766 34.6334 25.9393 32.1281 24.0545 30.2433C22.1697 28.3585 19.6655 27.3201 17 27.3212C14.3356 27.3212 11.8304 28.3585 9.94663 30.2422ZM18.8053 0.900121L15.146 0.900116C13.1403 0.901178 11.3955 2.65021 11.3965 4.64955L11.3955 25.6029C13.1244 24.7735 15.0251 24.3216 16.9979 24.3216C18.9538 24.3216 20.8375 24.765 22.5547 25.5806L22.5536 4.65061C22.5536 2.58233 20.8714 0.900119 18.8031 0.900117L18.8053 0.900121Z" fill="#F8FAFC"/>
                </svg>
            </div>
            <svg className='lg:w-[792px] w-[90vw] lg:h-[321px] h-[37vw]' viewBox="0 0 792 321" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="path2" d="M365.173 286.775C256.305 260.026 161.254 221.609 95.5859 181.133C62.7494 160.893 37.2847 140.154 21.1095 120.122C4.92814 100.083 -1.89701 80.8319 2.3559 63.5222C6.6088 46.2125 21.5782 32.316 45.2036 22.0573C68.82 11.8024 100.996 5.22537 139.473 2.50716C216.422 -2.92883 318.454 7.07588 427.322 33.8242C536.19 60.5726 631.242 98.9903 696.91 139.466C729.746 159.706 755.211 180.445 771.386 200.477C787.567 220.516 794.393 239.767 790.14 257.077C785.887 274.386 770.917 288.283 747.292 298.542C723.676 308.797 691.499 315.374 653.022 318.092C576.074 323.528 474.041 313.523 365.173 286.775Z" stroke="#94A3B8" opacity={0.5} strokeLinecap="round" strokeDasharray="10 20"/>
            </svg>
        </div>
    )
}

export {Path1, Path2}
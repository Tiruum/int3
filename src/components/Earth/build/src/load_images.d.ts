export function loadImages(imagePath: any, minimal: any): {
    image: {
        earth: HTMLImageElement;
        stars: HTMLImageElement;
        bordr: HTMLImageElement;
        milky: HTMLImageElement;
        grid: HTMLImageElement;
        moon: HTMLImageElement;
    };
    load: {
        earth: (gl: any, im: any) => any;
        stars: (gl: any, im: any) => any;
        bordr: (gl: any, im: any) => any;
        milky: (gl: any, im: any) => any;
        grid: (gl: any, im: any) => any;
        moon: (gl: any, im: any) => any;
    };
};

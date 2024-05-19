import { createTexture } from "./create_texture.js";
export function loadImages(imagePath, minimal) {
    const image = {
        earth: new Image(),
        stars: new Image(),
        bordr: new Image(),
        milky: new Image(),
        grid: new Image(),
        moon: new Image(),
    };
    const empty = "../empty.webp";
    image.earth.src = imagePath + "earthAlbedo.webp";
    image.grid.src = imagePath + "celestialGrid.webp";
    image.moon.src = imagePath + "../moon.webp";
    image.stars.src = imagePath + (minimal ? empty : "starMap.webp");
    image.bordr.src = imagePath + (minimal ? empty : "earthBorders.webp");
    image.milky.src = imagePath + (minimal ? empty : "milkyway.webp");
    return {
        image: image,
        load: {
            earth: (gl, im) => createTexture(gl, gl.LINEAR, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, im),
            stars: (gl, im) => createTexture(gl, gl.LINEAR, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, im),
            bordr: (gl, im) => createTexture(gl, gl.LINEAR, gl.R8, gl.RED, gl.UNSIGNED_BYTE, im),
            milky: (gl, im) => createTexture(gl, gl.LINEAR, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, im),
            grid: (gl, im) => createTexture(gl, gl.LINEAR, gl.R8, gl.RED, gl.UNSIGNED_BYTE, im),
            moon: (gl, im) => createTexture(gl, gl.LINEAR, gl.R8, gl.RED, gl.UNSIGNED_BYTE, im),
        },
    };
}

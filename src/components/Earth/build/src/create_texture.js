export function createEmptyTexture(gl, filter, internalFormat, width, height) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
    return texture;
}
export function createTexture(gl, filter, internalFormat, format, type, image) {
    const texture = createEmptyTexture(gl, filter, internalFormat, image.width, image.height);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, format, type, image);
    return texture;
}
export function createTextureFromArray(gl, internalFormat, width, height, format, type, array) {
    const texture = createEmptyTexture(gl, gl.NEAREST, internalFormat, width, height);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, format, type, array);
    return texture;
}
export function createMipmapTexture(gl, internalFormat, format, type, image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
}

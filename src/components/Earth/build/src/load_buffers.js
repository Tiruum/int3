import { createEmptyTexture } from "./create_texture.js";
export function loadBuffers(gl) {
    const fb = {
        camera: gl.createFramebuffer(),
        main: gl.createFramebuffer(),
        region: gl.createFramebuffer(),
        satCoord: gl.createFramebuffer(),
        surface: gl.createFramebuffer(),
    };
    const rb = {
        color: gl.createRenderbuffer(),
        depth: gl.createRenderbuffer(),
    };
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb.main);
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb.color);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, 1, 1);
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb.depth);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, 1, 1);
    gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rb.color);
    gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, rb.depth);
    const ub = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, ub);
    gl.bufferData(gl.UNIFORM_BUFFER, 4 * 32, gl.STREAM_DRAW);
    return {
        frame: fb,
        render: rb,
        uniform: ub,
    };
}

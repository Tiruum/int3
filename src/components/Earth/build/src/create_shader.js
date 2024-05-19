import * as S from "./shaders.js";
export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    const header = `#version 300 es\nprecision highp float;\nprecision highp int;\n#define ` + (type == gl.VERTEX_SHADER
        ? `VERTSHADER\n`
        : `FRAGSHADER\n`);
    gl.shaderSource(shader, header + S.commonGLSL + source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        alert(gl.getShaderInfoLog(shader));
    return shader;
}
export function createShaderProgram(gl, vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert(gl.getProgramInfoLog(program));
        return;
    }
    return program;
}

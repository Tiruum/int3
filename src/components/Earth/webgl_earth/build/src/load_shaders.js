import { createShader, createShaderProgram } from "./create_shader.js";
import * as S from "./shaders.js";
export function loadShaders(gl) {
    const vs = {
        aabb: createShader(gl, gl.VERTEX_SHADER, S.aabbVS),
        moon: createShader(gl, gl.VERTEX_SHADER, S.moonVS),
        quad: createShader(gl, gl.VERTEX_SHADER, S.quadVS),
        earth: createShader(gl, gl.VERTEX_SHADER, S.earthVS),
        orbit: createShader(gl, gl.VERTEX_SHADER, S.orbitVS),
        polygon: createShader(gl, gl.VERTEX_SHADER, S.polygonVS),
        station: createShader(gl, gl.VERTEX_SHADER, S.stationVS),
        satLine: createShader(gl, gl.VERTEX_SHADER, S.satLineVS),
        satView: createShader(gl, gl.VERTEX_SHADER, S.satViewVS),
        satellite: createShader(gl, gl.VERTEX_SHADER, S.satelliteVS),
        commsLine: createShader(gl, gl.VERTEX_SHADER, S.commsLineVS),
        commsPoint: createShader(gl, gl.VERTEX_SHADER, S.commsPointVS),
        satCapture: createShader(gl, gl.VERTEX_SHADER, S.satCaptureVS),
        viewTriangle: createShader(gl, gl.VERTEX_SHADER, S.viewTriangleVS),
    };
    const fs = {
        moon: createShader(gl, gl.FRAGMENT_SHADER, S.moonFS),
        earth: createShader(gl, gl.FRAGMENT_SHADER, S.earthFS),
        circle: createShader(gl, gl.FRAGMENT_SHADER, S.circleFS),
        object: createShader(gl, gl.FRAGMENT_SHADER, S.objectFS),
        uColor: createShader(gl, gl.FRAGMENT_SHADER, S.uColorFS),
        vColor: createShader(gl, gl.FRAGMENT_SHADER, S.vColorFS),
        region: createShader(gl, gl.FRAGMENT_SHADER, S.regionFS),
        capture: createShader(gl, gl.FRAGMENT_SHADER, S.captureFS),
        satCoord: createShader(gl, gl.FRAGMENT_SHADER, S.satCoordFS),
    };
    const shader = {
        fade: createShaderProgram(gl, vs.quad, fs.uColor),
        moon: createShaderProgram(gl, vs.moon, fs.moon),
        earth: createShaderProgram(gl, vs.earth, fs.earth),
        orbit: createShaderProgram(gl, vs.orbit, fs.vColor),
        object: createShaderProgram(gl, vs.aabb, fs.object),
        region: createShaderProgram(gl, vs.quad, fs.region),
        capture: createShaderProgram(gl, vs.quad, fs.capture),
        polygon: createShaderProgram(gl, vs.polygon, fs.vColor),
        station: createShaderProgram(gl, vs.station, fs.circle),
        satLine: createShaderProgram(gl, vs.satLine, fs.vColor),
        satView: createShaderProgram(gl, vs.satView, fs.vColor),
        satCoord: createShaderProgram(gl, vs.quad, fs.satCoord),
        commsLine: createShaderProgram(gl, vs.commsLine, fs.vColor),
        commsPoint: createShaderProgram(gl, vs.commsPoint, fs.circle),
        satellite: createShaderProgram(gl, vs.satellite, fs.circle),
        satCapture: createShaderProgram(gl, vs.satCapture, fs.vColor),
        viewTriangle: createShaderProgram(gl, vs.viewTriangle, fs.uColor),
    };
    for (const key in vs)
        gl.deleteShader(vs[key]);
    for (const key in fs)
        gl.deleteShader(fs[key]);
    return shader;
}

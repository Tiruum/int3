import { createEmptyTexture, createTexture, createTextureFromArray, createMipmapTexture } from "./create_texture.js";
import { loadImages } from "./load_images.js";
import { loadBuffers } from "./load_buffers.js";
import { loadShaders } from "./load_shaders.js";
import { RenderState } from "./render_state.js";
import { leapSecondsInfo } from "./leap_seconds.js";
const numberToU32 = (f) => {
    var buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = f;
    return (new Uint32Array(buf))[0];
};
const isStrictlySorted = (array, projection = (x) => x, compare = (x, y) => x < y) => {
    for (let i = 0; i + 1 < array.length; ++i)
        if (!compare(projection(array[i]), projection(array[i + 1])))
            return false;
    return true;
};
const typedArrayEqual = (a1, a2) => {
    return a2 != undefined && a1.length == a2.length && a1.every((a, i) => a === a2[i]);
};
export class WebGLRenderer {
    constructor(canvas, renderState = new RenderState()) {
        this.canvas = canvas;
        this.canvas.width = 1;
        this.canvas.height = 1;
        const attributes = {
            alpha: true,
            antialias: false,
            colorSpace: "srgb",
            depth: false,
            desynchronized: true,
        };
        this.gl = canvas.getContext("webgl2", attributes);
        if (this.gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.nextRender = (time) => this.render(time, renderState);
        this.afterRender = (renderState) => { };
        this.postponed = [];
        this.satelliteCount = 0;
        this.cameraCount = 0;
        this.stationCount = 0;
        this.commsTotalCount = 0;
        this.commsMaxCount = 0;
        this.regionCount = 0;
        this.meshCount = 0;
        this.satGroup = Array(262144).fill(0);
        this.stationGroup = Array(1024).fill(0);
        this.regionGroup = Array(256).fill(0);
        this.regionID = Array(256).fill(0);
        this.regionCenter = Array(512).fill(0);
        this.texture = {
            surface: null,
            earth: null,
            stars: null,
            bordr: null,
            milky: null,
            grid: null,
            moon: null,
            group: null,
            satPoint: null,
            satCoord: null,
            station: null,
            camera: null,
            capture: null,
            comms: null,
            object: null,
            region: null,
            polygon: null,
            picker: null,
        };
        this.textureIdx = {};
        for (const key in this.texture)
            this.textureIdx[key] = Object.keys(this.textureIdx).length;
        this.postponed.push((gl) => {
            this.replaceTexture("group", createEmptyTexture(gl, gl.NEAREST, gl.R32UI, 256, 263));
        });
        this.postponed.push((gl) => {
            this.buffer = loadBuffers(gl);
            this.shader = loadShaders(gl);
            for (const sKey in this.shader) {
                const shader = this.shader[sKey];
                gl.useProgram(shader);
                gl.uniformBlockBinding(shader, gl.getUniformBlockIndex(shader, "UniformBlock"), 1);
                for (const tKey in this.texture)
                    gl.uniform1i(gl.getUniformLocation(shader, tKey + "A"), this.textureIdx[tKey]);
            }
        });
        const maxL = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
        this.setSurfaceSize(maxL >= 8192 ? 8192 : 4096);
        this.lastNow = Date.now();
        this.frame = 0;
        window.requestAnimationFrame(this.nextRender);
    }
    replaceTexture(which, withWhat) {
        if (this.texture[which])
            this.gl.deleteTexture(this.texture[which]);
        this.texture[which] = withWhat;
    }
    loadTextures(imagePath, minimal = false) {
        const dict = loadImages(imagePath, minimal);
        const image = dict.image;
        const load = dict.load;
        for (const key in image)
            image[key].onload = () => {
                this.postponed.push((gl) => {
                    this.replaceTexture(key, load[key](gl, image[key]));
                });
            };
    }
    setSurfaceSize(surfaceWidth) {
        this.postponed.push((gl) => {
            this.surfaceW = surfaceWidth;
            this.surfaceH = surfaceWidth / 2;
            this.replaceTexture("surface", createEmptyTexture(gl, gl.LINEAR, gl.RGBA8, this.surfaceW, this.surfaceH));
            this.replaceTexture("region", createEmptyTexture(gl, gl.NEAREST, gl.R8, this.surfaceW, this.surfaceH));
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.surface);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.surface, 0);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.region);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.region, 0);
        });
    }
    replaceRenderState(renderState) {
        this.nextRender = (time) => this.render(time, renderState);
    }
    terminate() {
        this.nextRender = null;
    }
    loadSatellites(webpImage) {
        this.postponed.push((gl) => {
            const cvs = document.createElement("canvas", { width: 2, height: 1 });
            const ctx = cvs.getContext("2d");
            ctx.drawImage(webpImage, 0, 0);
            const pixel = ctx.getImageData(0, 0, 2, 1).data;
            this.satelliteCount = pixel[0] + 256 * pixel[1] + 65536 * pixel[2];
            this.satSampleCount = pixel[4] + 256 * pixel[5] + 65536 * pixel[6];
            if (this.satelliteCount == 0)
                return;
            this.replaceTexture("satPoint", createTexture(gl, gl.NEAREST, gl.RGBA8UI, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, webpImage));
            this.satCoordWidth = Math.min(4096, this.satelliteCount);
            this.satCoordHeight = 4 * Math.ceil(this.satelliteCount / 4096.);
            this.replaceTexture("satCoord", createEmptyTexture(gl, gl.NEAREST, gl.RGBA32UI, this.satCoordWidth, this.satCoordHeight));
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.satCoord);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.satCoord, 0);
        });
    }
    groupSatellites(groupArray) {
        if (groupArray.some(x => x < 0 || x > 255))
            console.log("group indices must be in {0..255}");
        if (groupArray.length > this.satGroup.length)
            console.log("satellite count must be less than " + this.satGroup.length);
        else
            this.satGroup = [...groupArray, ...Array(this.satGroup.length - groupArray.length).fill(0)];
    }
    regroupSatellite(satID, groupID) {
        if (groupID < 0 || groupID > 255)
            console.log("group index must be in {0..255}");
        if (satID < 0 || satID > this.satGroup.length)
            console.log("station index must be in {0.." + this.satGroup.length + "}");
        else if (this.satGroup[satID] != groupID)
            this.satGroup[satID] = groupID;
    }
    loadStations(stations) {
        if (stations.length > 1024)
            console.log("station count must be less than 1024");
        if (!isStrictlySorted(stations, (x) => x.ID))
            console.log("station array must be sorted by ID");
        else
            this.postponed.push((gl) => {
                this.stationCount = stations.length;
                const data = stations
                    .sort((dict1, dict2) => dict1.ID - dict2.ID)
                    .map(dict => [numberToU32(dict.longitude), numberToU32(dict.latitude), dict.ID])
                    .flat();
                if (this.stationCount != 0)
                    this.replaceTexture("station", createTextureFromArray(gl, gl.RGB32UI, this.stationCount, 1, gl.RGB_INTEGER, gl.UNSIGNED_INT, new Uint32Array(data)));
            });
    }
    groupStations(groupArray) {
        if (groupArray.some(x => x < 0 || x > 255))
            console.log("group indices must be in {0..255}");
        if (groupArray.length >= this.stationGroup.length)
            console.log("station count must be less than " + this.stationGroup.length);
        else
            this.stationGroup = [...groupArray, ...Array(this.stationGroup.length - groupArray.length).fill(0)];
    }
    regroupStation(stationID, groupID) {
        if (groupID < 0 || groupID > 255)
            console.log("group index must be in {0..255}");
        if (stationID < 0 || stationID >= this.stationGroup.length)
            console.log("station index must be in {0.." + this.stationGroup.length + "}");
        else if (this.stationGroup[stationID] != groupID)
            this.stationGroup[stationID] = groupID;
    }
    loadRegions(regions) {
        if (regions.length >= 255)
            console.log("region count must be less than 255");
        if (!isStrictlySorted(regions, (x) => x.ID))
            console.log("region array must be sorted by ID");
        else
            this.postponed.push((gl) => {
                this.regionCount = regions.length;
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.surface);
                gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
                gl.viewport(0, 0, this.surfaceW, this.surfaceH);
                gl.clearColor(0., 0., 0., 0.);
                gl.colorMask(false, false, false, true);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.disable(gl.DEPTH_TEST);
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE, gl.ONE);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.buffer.uniform);
                for (let i = 0; i < regions.length; ++i) {
                    this.regionID[i] = regions[i].ID;
                    const lines = regions[i].lines;
                    this.regionCenter[2 * i] = 0.;
                    this.regionCenter[2 * i + 1] = 0.;
                    var pointCount = 0;
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.region);
                    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
                    gl.colorMask(true, false, false, false);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.enable(gl.BLEND);
                    gl.useProgram(this.shader.polygon);
                    gl.uniform1i(gl.getUniformLocation(this.shader.polygon, "polygonA"), 0);
                    for (let j = 0; j < lines.length; ++j) {
                        const line = lines[j];
                        pointCount += line.length;
                        this.regionCenter[2 * i] += line.reduce((acc, point) => acc + point.longitude, 0);
                        this.regionCenter[2 * i + 1] += line.reduce((acc, point) => acc + point.latitude, 0);
                        const data = line.map(point => [point.longitude, point.latitude]).flat();
                        this.replaceTexture("polygon", createTextureFromArray(gl, gl.RG32F, line.length, 1, gl.RG, gl.FLOAT, new Float32Array(data)));
                        gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, line.length, 2);
                    }
                    this.regionCenter[2 * i] /= pointCount;
                    this.regionCenter[2 * i + 1] /= pointCount;
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.surface);
                    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
                    gl.colorMask(false, false, false, true);
                    gl.disable(gl.BLEND);
                    gl.useProgram(this.shader.region);
                    gl.bindTexture(gl.TEXTURE_2D, this.texture.region);
                    gl.uniform1i(gl.getUniformLocation(this.shader.region, "regionA"), 0);
                    gl.uniform1i(gl.getUniformLocation(this.shader.region, "idx"), i);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
            });
    }
    groupRegions(groupArray) {
        if (groupArray.some(x => x < 0 || x > 255))
            console.log("group indices must be in {0..255}");
        if (groupArray.length > 254)
            console.log("region count must be less than 255");
        else
            this.regionGroup = [...groupArray, ...Array(this.regionGroup.length - groupArray.length).fill(0)];
    }
    regroupRegion(regionID, groupID) {
        if (groupID < 0 || x > groupID)
            console.log("group index must be in {0..255}");
        if (regionID < 0 || regionID > 254)
            console.log("region index must be in {0..254}");
        else if (this.regionGroup[regionID] != groupID)
            this.regionGroup[regionID] = groupID;
    }
    loadCapture(webpImage) {
        this.postponed.push((gl) => {
            if (webpImage.width * webpImage.height == 0)
                this.cameraCount = 0;
            else {
                const cvs = document.createElement("canvas", { width: 1, height: 1 });
                const ctx = cvs.getContext("2d");
                ctx.drawImage(webpImage, 0, 0);
                const pixel = ctx.getImageData(0, 0, 1, 1).data;
                this.cameraCount = pixel[0] + 256 * pixel[1] + 65536 * pixel[2];
                if (this.cameraCount == 0)
                    return;
                this.cameraImageWidth = Math.max(4096, this.cameraCount);
                this.cameraImageHeight = Math.ceil(this.cameraCount / 4096.);
                this.replaceTexture("camera", createEmptyTexture(gl, gl.NEAREST, gl.RGBA32UI, this.cameraImageWidth, this.cameraImageHeight));
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.camera);
                gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.camera, 0);
                this.replaceTexture("capture", createTexture(gl, gl.NEAREST, gl.RGBA8UI, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, webpImage));
            }
        });
    }
    loadCommunications(webpImage) {
        this.postponed.push((gl) => {
            if (webpImage.width * webpImage.height == 0) {
                this.commsTotalCount = 0;
                this.commsMaxCount = 0;
            }
            else {
                const cvs = document.createElement("canvas", { width: 2, height: 1 });
                const ctx = cvs.getContext("2d");
                ctx.drawImage(webpImage, 0, 0);
                const pixel = ctx.getImageData(0, 0, 2, 1).data;
                this.commsTotalCount = pixel[0] + 256 * pixel[1] + 65536 * pixel[2];
                this.commsMaxCount = pixel[4] + 256 * pixel[5] + 65536 * pixel[6];
                this.replaceTexture("comms", createTexture(gl, gl.NEAREST, gl.RGBA8UI, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, webpImage));
            }
        });
    }
    load3DObject(webpImage) {
        this.postponed.push((gl) => {
            if (webpImage.width * webpImage.height == 0)
                this.meshCount = 0;
            else {
                const cvs = document.createElement("canvas", { width: 1, height: 1 });
                const ctx = cvs.getContext("2d");
                ctx.drawImage(webpImage, 0, 0);
                const pixel = ctx.getImageData(0, 0, 1, 1).data;
                this.meshCount = pixel[0] + 256 * pixel[1] + 65536 * pixel[2] - 1;
                this.replaceTexture("object", createTexture(gl, gl.NEAREST, gl.RGB8UI, gl.RGB_INTEGER, gl.UNSIGNED_BYTE, webpImage));
            }
        });
    }
    render(time, renderState) {
        const now = Date.now();
        const dt = (now - this.lastNow) * renderState.timeMultiplier;
        this.lastNow = now;
        renderState.time += dt;
        this.frame = this.frame + 1;
        const gl = this.gl;
        this.postponed.forEach(f => {
            f(gl);
            while (gl.getError() != gl.NO_ERROR)
                console.log(f);
        });
        this.postponed = [];
        const dpr = window.devicePixelRatio;
        const cw = Math.round(this.canvas.clientWidth * dpr);
        const ch = Math.round(this.canvas.clientHeight * dpr);
        if (this.canvas.width != cw || this.canvas.height != ch) {
            this.canvas.width = cw;
            this.canvas.height = ch;
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.main);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.buffer.render.color);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, cw, ch);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.buffer.render.depth);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, cw, ch);
            this.replaceTexture("picker", createEmptyTexture(gl, gl.NEAREST, gl.RGBA8, cw, ch));
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.texture.picker, 0);
        }
        else
            this.actuallyRender(time, dt, renderState);
        this.afterRender(renderState);
        if (this.nextRender)
            window.requestAnimationFrame(this.nextRender);
        else {
            for (const key in this.shader)
                gl.deleteProgram(this.shader[key]);
            for (const key in this.texture)
                gl.deleteTexture(this.texture[key]);
            for (const key in this.buffer.frame)
                gl.deleteFramebuffer(this.buffer.frame[key]);
            for (const key in this.buffer.render)
                gl.deleteRenderbuffer(this.buffer.render[key]);
            gl.deleteBuffer(this.buffer.uniform);
        }
    }
    actuallyRender(time, dt, rs) {
        const gl = this.gl;
        while (gl.getError() != gl.NO_ERROR)
            console.log("GL error before render");
        const expand = (x, y, z, w) => x + 256 * y + 65536 * z + 16777216 * w;
        const colorToU32 = (c) => expand(Math.floor(255.9999 * c.r), Math.floor(255.9999 * c.g), Math.floor(255.9999 * c.b), Math.floor(255.9999 * c.a));
        {
            const satGroup = [...Array(256 * 256).keys()].map(i => expand(this.satGroup[4 * i], this.satGroup[4 * i + 1], this.satGroup[4 * i + 2], this.satGroup[4 * i + 3]));
            const stationGroup = [...Array(256).keys()].map(i => expand(this.stationGroup[4 * i], this.stationGroup[4 * i + 1], this.stationGroup[4 * i + 2], this.stationGroup[4 * i + 3]));
            const groupColor = [...Array(256).keys()].map(i => colorToU32(rs.groupColor[i]));
            const groupInfo = [...Array(256).keys()].map(i => (rs.groupPointVisibility[i] ? 1 : 0)
                + (rs.groupOrbitVisibility[i] ? 2 : 0)
                + (rs.groupRenderSatLine[i] ? 4 : 0)
                + (rs.groupRenderSatView[i] ? 8 : 0)
                + (rs.groupRenderSatCapture[i] ? 16 : 0)
                + rs.groupPointShape[i] * 32
                + rs.groupPointSize[i] * 256);
            const groupData = new Uint32Array([
                ...satGroup, //   0..256
                ...stationGroup, // 256..257
                ...this.regionGroup, // 257..258
                ...this.regionID, // 258..259
                ...this.regionCenter.map(numberToU32), // 259..261
                ...groupColor, // 261..262
                ...groupInfo, // 262..263
            ]);
            if (groupData.length != 256 * 263)
                alert("group info update error");
            gl.bindTexture(gl.TEXTURE_2D, this.texture.group);
            if (!typedArrayEqual(groupData, this.lastGroupData)) {
                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, 263, gl.RED_INTEGER, gl.UNSIGNED_INT, groupData);
                this.lastGroupData = groupData;
            }
        }
        {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.buffer.uniform);
            const uboSize = gl.getBufferParameter(gl.UNIFORM_BUFFER, gl.BUFFER_SIZE);
            const uniformBuffer = new Uint32Array(uboSize / 4);
            let offset = 0;
            uniformBuffer[offset++] = numberToU32(this.canvas.width);
            uniformBuffer[offset++] = numberToU32(this.canvas.height);
            uniformBuffer[offset++] = numberToU32(this.surfaceW);
            uniformBuffer[offset++] = numberToU32(this.surfaceH);
            uniformBuffer[offset++] = numberToU32(rs.mouse()[0]);
            uniformBuffer[offset++] = numberToU32(rs.mouse()[1]);
            uniformBuffer[offset++] = numberToU32(rs.mouse()[2]);
            uniformBuffer[offset++] = rs.camObjectID;
            uniformBuffer[offset++] = numberToU32(this.canvas.width / this.canvas.height);
            uniformBuffer[offset++] = numberToU32(rs.camExposure);
            uniformBuffer[offset++] = rs.commsGroup
                + rs.commsPointMinimalSize * 256;
            uniformBuffer[offset++] = (rs.pretty ? 1 : 0)
                + (rs.multisample ? 2 : 0)
                + (rs.cam2D ? 4 : 0)
                + (rs.camEclipticPlane ? 8 : 0)
                + (rs.camSynchronized ? 16 : 0);
            uniformBuffer[offset++] = expand(rs.pick[3], rs.pick[2], rs.pick[1], rs.pick[0]);
            uniformBuffer[offset++] = numberToU32(rs.pickSizeMultiplier);
            uniformBuffer[offset++] = numberToU32(rs.pickColorMultiplier);
            uniformBuffer[offset++] = colorToU32(rs.satLineColor);
            uniformBuffer[offset++] = colorToU32(rs.satViewColor);
            uniformBuffer[offset++] = colorToU32(rs.satCaptureColor);
            uniformBuffer[offset++] = colorToU32(rs.sunsetColor);
            uniformBuffer[offset++] = colorToU32(rs.borderColor);
            uniformBuffer[offset++] = this.satelliteCount;
            uniformBuffer[offset++] = this.satSampleCount;
            uniformBuffer[offset++] = this.stationCount;
            uniformBuffer[offset++] = this.regionCount;
            uniformBuffer[offset++] = this.commsTotalCount;
            uniformBuffer[offset++] = this.commsMaxCount;
            uniformBuffer[offset++] = this.cameraCount;
            uniformBuffer[offset++] = 0;
            uniformBuffer[offset++] = 0;
            uniformBuffer[offset++] = 0;
            uniformBuffer[offset++] = 0;
            uniformBuffer[offset++] = 0;
            if (offset != uniformBuffer.length)
                alert("uniform buffer fill error");
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, uniformBuffer);
        }
        for (const key in this.texture) {
            gl.activeTexture(gl.TEXTURE0 + this.textureIdx[key]);
            gl.bindTexture(gl.TEXTURE_2D, this.texture[key]);
        }
        gl.activeTexture(gl.TEXTURE0);
        const setTimeUniforms = (shader, now0, now1) => {
            const i = leapSecondsInfo.leap_seconds.findIndex(info => info[0] >= now0 / 1000. + 2208988800);
            const TAIminusUTC = leapSecondsInfo.leap_seconds.at(i == -1 ? -1 : Math.max(0, i - 1))[1];
            const msLeap = 1000. * (TAIminusUTC - 10);
            const ms0 = now0 + msLeap;
            const ms1 = now1 + msLeap;
            const msInDay = 86400 * 1000;
            const days0 = Math.floor(ms0 / msInDay);
            const days1 = Math.floor(ms1 / msInDay);
            gl.uniform1f(gl.getUniformLocation(shader, "TTminusUT"), 32.184 + TAIminusUTC);
            gl.uniform1i(gl.getUniformLocation(shader, "now.epoch"), 1);
            gl.uniform1i(gl.getUniformLocation(shader, "prev.epoch"), 1);
            gl.uniform1f(gl.getUniformLocation(shader, "now.interval.days"), days0);
            gl.uniform1f(gl.getUniformLocation(shader, "prev.interval.days"), days1);
            gl.uniform1f(gl.getUniformLocation(shader, "now.interval.ms"), ms0 - days0 * msInDay);
            gl.uniform1f(gl.getUniformLocation(shader, "prev.interval.ms"), ms1 - days1 * msInDay);
        };
        const now0 = rs.time;
        const now1 = rs.time - dt;
        const useProgram = (shader) => {
            gl.useProgram(shader);
            setTimeUniforms(shader, now0, now1);
        };
        gl.colorMask(true, true, true, true);
        gl.disable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        { // cleanup pass
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.surface);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
            gl.viewport(0, 0, this.surfaceW, this.surfaceH);
            if (rs.cleanSatLine || rs.cleanSatView || rs.cleanSatCapture || rs.cleanRegions) {
                gl.colorMask(rs.cleanSatLine, rs.cleanSatView, rs.cleanSatCapture, rs.cleanRegions);
                gl.clear(gl.COLOR_BUFFER_BIT);
                rs.cleanSatLine = false;
                rs.cleanSatView = false;
                rs.cleanSatCapture = false;
                rs.cleanRegions = false;
            }
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE);
            gl.disable(gl.DEPTH_TEST);
            if (this.frame % rs.framesBetweenFade == 0 && (rs.satLineFade + rs.satViewFade + rs.satCaptureFade != 0)) {
                gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
                gl.useProgram(this.shader.fade);
                gl.uniform4f(gl.getUniformLocation(this.shader.fade, "uColor"), rs.satLineFade / 255., rs.satViewFade / 255., rs.satCaptureFade / 255., 0.);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }
        const anySatLine = rs.groupRenderSatLine.some((x, i) => x && rs.groupPointVisibility[i]);
        const anySatView = rs.groupRenderSatView.some((x, i) => x && rs.groupPointVisibility[i]);
        const anySatCapture = rs.groupRenderSatCapture.some((x, i) => x && rs.groupPointVisibility[i]);
        const anySatDraw = anySatLine || anySatView || anySatCapture;
        if (anySatDraw && Math.abs(dt) / rs.timeMultiplier < 1000.) // build satellite lines, views and captures
         {
            const frameCount = Math.ceil(Math.abs(dt) / rs.maxFrameDelay);
            gl.blendEquation(gl.FUNC_ADD);
            for (let frame = 0; frame < frameCount; ++frame) {
                const k0 = frame / frameCount;
                const k1 = (frame + 1) / frameCount;
                const t0 = rs.time - (1 - k0) * dt;
                const t1 = rs.time - (1 - k1) * dt;
                gl.disable(gl.BLEND);
                gl.disable(gl.DEPTH_TEST);
                if (this.satelliteCount != 0) {
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.satCoord);
                    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
                    gl.viewport(0, 0, this.satCoordWidth, this.satCoordHeight);
                    gl.useProgram(this.shader.satCoord);
                    setTimeUniforms(this.shader.satCoord, t0, t1);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
                if ((anySatView || anySatCapture) && this.cameraCount != 0) {
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.camera);
                    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
                    gl.viewport(0, 0, this.cameraImageWidth, this.cameraImageHeight);
                    gl.useProgram(this.shader.capture);
                    setTimeUniforms(this.shader.capture, t0, t1);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }
                gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.surface);
                gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
                gl.viewport(0, 0, this.surfaceW, this.surfaceH);
                gl.enable(gl.BLEND);
                if (anySatLine && this.satelliteCount != 0) {
                    gl.useProgram(this.shader.satLine);
                    setTimeUniforms(this.shader.satLine, t0, t1);
                    gl.drawArraysInstanced(gl.LINES, 0, 4, this.satelliteCount);
                }
                if (anySatView && this.cameraCount != 0) {
                    gl.useProgram(this.shader.satView);
                    setTimeUniforms(this.shader.satView, t0, t1);
                    gl.drawArraysInstanced(gl.TRIANGLES, 0, 24, this.cameraCount);
                }
                if (anySatCapture && this.cameraCount != 0) {
                    gl.useProgram(this.shader.satCapture);
                    setTimeUniforms(this.shader.satCapture, t0, t1);
                    gl.drawArraysInstanced(gl.TRIANGLES, 0, 24, this.cameraCount);
                }
            }
        }
        else if (this.satelliteCount != 0) {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.satCoord);
            gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
            gl.viewport(0, 0, this.satCoordWidth, this.satCoordHeight);
            useProgram(this.shader.satCoord);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.buffer.frame.main);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        if (rs.enableHover) {
            const hoverX = Math.floor(rs.cursor[0] * this.canvas.width);
            const hoverY = Math.floor(rs.cursor[1] * this.canvas.height);
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.buffer.frame.main);
            gl.readBuffer(gl.COLOR_ATTACHMENT1);
            gl.readPixels(hoverX, hoverY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rs.pick);
        }
        gl.clearColor(0., 0., 0., 0.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        useProgram(this.shader.earth);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA);
        gl.blendEquation(gl.FUNC_ADD);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(false);
        if (this.commsMaxCount != 0) {
            useProgram(this.shader.commsLine);
            gl.drawArraysInstanced(gl.LINES, 0, 2, this.commsMaxCount);
            useProgram(this.shader.commsPoint);
            gl.drawArraysInstanced(gl.POINTS, 0, 1, this.commsMaxCount);
        }
        if (!rs.cam2D) {
            gl.depthMask(true);
            useProgram(this.shader.moon);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            if (this.satelliteCount != 0) {
                if (this.meshCount != 0 && rs.camObjectID >= 0) {
                    gl.enable(gl.CULL_FACE);
                    gl.cullFace(gl.FRONT);
                    useProgram(this.shader.object);
                    gl.drawArrays(gl.TRIANGLES, 0, 36);
                    gl.disable(gl.CULL_FACE);
                }
                gl.depthMask(false);
                useProgram(this.shader.orbit);
                gl.uniform1ui(gl.getUniformLocation(this.shader.orbit, "orbitPointCount"), rs.orbitPointCount);
                gl.drawArraysInstanced(gl.LINE_STRIP, 0, rs.orbitPointCount + 1, this.satelliteCount);
                if (this.cameraCount != 0) {
                    useProgram(this.shader.viewTriangle);
                    gl.uniform4f(gl.getUniformLocation(this.shader.viewTriangle, "uColor"), rs.satViewColor.r, rs.satViewColor.g, rs.satViewColor.b, rs.satViewColor.a);
                    gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, this.cameraCount);
                }
            }
        }
        gl.depthMask(false);
        if (this.satelliteCount != 0) {
            useProgram(this.shader.satellite);
            gl.drawArraysInstanced(gl.POINTS, 0, 1, this.satelliteCount);
        }
        if (this.stationCount != 0) {
            useProgram(this.shader.station);
            gl.drawArraysInstanced(gl.POINTS, 0, 1, this.stationCount);
        }
        gl.depthMask(true);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.buffer.frame.main);
        gl.readBuffer(gl.COLOR_ATTACHMENT0);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        gl.drawBuffers([gl.BACK]);
        gl.blitFramebuffer(0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        while (gl.getError() != gl.NO_ERROR)
            console.log(`GL error after render`);
    }
}

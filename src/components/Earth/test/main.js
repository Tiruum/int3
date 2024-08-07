import {WebGLRenderer} from "../build/src/webgl_renderer.js"
import {RenderState} from "../build/src/render_state.js"
import {onWheel, onMouseMove} from "../build/src/on_canvas_events.js"

window.onload = () =>
{
    const nameElement = document.querySelector("#name");
    const timeElement = document.querySelector("#time");
    const nameNode = document.createTextNode("");
    const timeNode = document.createTextNode("");
    nameElement.appendChild(nameNode);
    timeElement.appendChild(timeNode);

    const overlay = document.querySelector("#nameOverlay");
    const canvas = document.querySelector("#glCanvas");

    const renderState = new RenderState();
    const renderer = new WebGLRenderer(canvas, renderState);
    const res = "../build/res/";
    renderer.loadTextures(res + "mediump/");

    //renderState.time = Date.now();
    //renderState.time = Date.UTC(2016, 11, 31) + (86400. * 23.999 / 24.) * 1000.; // leap second
    //renderState.time = Date.UTC(2023, 9, 14) + (86400. * 18. / 24.) * 1000.; // solar eclipse
    //renderState.time = Date.UTC(2023, 2, 22) + (86400. * 15. / 24.) * 1000.; // vernal equinox
    //renderState.time = Date.UTC(2023, 2, 21) + (86400. * 9.622 / 24.) * 1000.;
    //renderState.time = Date.UTC(1990, 0, 1) + (86400. * 9.622 / 24.) * 1000.;
    //renderState.time = 1672531200. * 1000.;

    renderState.time = 1679374800. * 1000.;

    var moveX = 0.;
    var moveY = 0.;
    var moveZ = 0.;
    var moveSensivity = 1.;

    const clamp = (x, xmin, xmax) => Math.min(xmax, Math.max(xmin, x));

    fetch("./test/res/names.json")
        .then((response) => response.json())
        .then((json) =>
    {
        renderer.afterRender = (renderState) =>
        {
            const pick = renderState.pickInfo();
            if(pick.target == "satellite" && renderState.enableHover)
            {
                nameNode.nodeValue = json["name"][pick.ID];

                const [x, y] = renderState.cursor;
                overlay.style.left = `${      x  * canvas.clientWidth  +  8}px`;
                overlay.style. top = `${(1. - y) * canvas.clientHeight - 16}px`;
            }
            else if(pick.target == "station" && renderState.enableHover)
            {
                nameNode.nodeValue = json["name"][renderer.satelliteCount + pick.ID];

                const [x, y] = renderState.cursor;
                overlay.style.left = `${      x  * canvas.clientWidth  +  8}px`;
                overlay.style. top = `${(1. - y) * canvas.clientHeight - 16}px`;
            }
            else
                nameNode.nodeValue = "";

            var date = new Date(1970, 0, 1);
            date.setTime(renderState.time);
            timeNode.nodeValue = date.toString();

            const [u0, v0, z] = renderState.mouse();
            const u =       u0 + moveSensivity * moveX / canvas.clientWidth;
            const v = clamp(v0 - moveSensivity * moveY / canvas.clientHeight, -0.999, 0.999);
            renderState.setMouse([u, v, clamp(z + 5e-4 * moveZ * moveSensivity, 0., 1.)]);

        };
    });

    renderState.multisample = false;
    for(let i = 0; i < 10; ++i)
    {
        renderState.groupPointVisibility[i] = true;
        renderState.groupOrbitVisibility[i] = true;
        renderState.groupRenderSatView[i] = true;
        renderState.groupRenderSatCapture[i] = true;
    }

    renderState.groupColor[0].a = 0.1;
    renderState.groupColor[1].a = 0.1;
    renderState.groupColor[2].a = 0.1;
    renderState.groupColor[3].a = 0.1;
    renderState.groupColor[4].a = 0.1;
    renderState.groupColor[5].a = 0.05;
    renderState.groupColor[6].a = 0.05;
    renderState.groupColor[7].a = 0.05;
    renderState.groupColor[8].a = 0.05;
    renderState.groupPointShape[0] = 0;
    renderState.groupPointShape[1] = 1;
    renderState.groupPointShape[2] = 7;
    renderState.groupPointShape[3] = 5;
    renderState.groupPointShape[4] = 7;
    renderState.groupPointShape[5] = 6;
    renderState.groupPointShape[6] = 4;
    renderState.groupPointShape[7] = 0;
    renderState.groupPointShape[8] = 5;

    var sat = new Image();
    sat.src = "./test/res/trajectories.webp";
    sat.onload = () =>
    {
        renderer.loadSatellites(sat);

        fetch("./test/res/groups.json")
            .then((response) => response.json())
            .then((json) => {renderer.groupSatellites(json["group"]);});

        var capture = new Image();
        capture.src = "./test/res/remote_sensing_devices.webp";
        capture.onload = () => {renderer.loadCapture(capture);};
    };

    var obj = new Image();
    obj.src = "./test/res/objects.webp";
    obj.onload = () =>
    {
        renderer.load3DObject(obj);
    };

    var comms = new Image();
    comms.src = "./test/res/messages.webp";
    comms.onload = () =>
    {
        renderer.loadCommunications(comms);
    };
    const CG = renderState.commsGroup;
    renderState.groupPointVisibility[CG] = true;
    renderState.groupColor[CG].r = 0.3;
    renderState.groupColor[CG].g = 1.0;
    renderState.groupColor[CG].b = 0.3;
    renderState.groupColor[CG].a = 0.5;
    renderState.groupPointShape[CG] = 7;
    renderState.groupPointSize[CG] = 15;

    fetch("./test/res/regions.json")
        .then((response) => response.json())
        .then((json) =>
    {
        renderer.loadRegions(json.map((points) => {return {lines: points, ID: 0};}));
        renderer.groupRegions(Array(json.length).fill(2));
    });

    const toRad = Math.PI / 180.;

    fetch("./test/res/stations.json")
        .then((response) => response.json())
        .then((json) =>
    {
        const stationGroup = 253;
        renderState.groupColor[stationGroup].r = 0.;
        renderState.groupColor[stationGroup].g = 1.;
        renderState.groupColor[stationGroup].b = 1.;
        renderState.groupPointVisibility[stationGroup] = true;
        renderState.groupPointShape[stationGroup] = 0;
        renderState.groupPointSize[stationGroup] = 8;
        renderer.loadStations(json);
        renderer.groupStations(Array(json.length).fill(stationGroup));
    });

    renderState.framesBetweenFade = 50;
    renderState.satLineFade = 3;
    renderState.satViewFade = 2;

    /*
    renderState.enableHover = false;
    renderState.setPickInfo({target: "satellite", ID: 0});
    renderState.setPickSizeMultiplier = 3;
    */

    canvas.onwheel     = onWheel    (renderState);
    canvas.onmousemove = onMouseMove(renderState);
    canvas.onclick = (e) =>
    {
        const info = renderState.pickInfo();
        if(e.button == 0)
        {
            if(info.target == "satellite")
                renderState.camObjectID = info.ID;
        }
    };

    var pointSize = 0;
    window.onkeydown = (e) =>
    {
        const m = 1.1;
        if(e.key == "q")
            renderState.camExposure *= m;
        if(e.key == "a")
            renderState.camExposure /= m;
        if(e.key == "e")
            renderState.timeMultiplier *= m;
        if(e.key == "d")
            renderState.timeMultiplier /= m;

        if(e.key == "r")
        {
            for(const i in [...Array(9).keys()])
                renderState.groupPointSize[i] += 1;
        }
        if(e.key == "f")
        {
            for(const i in [...Array(9).keys()])
                renderState.groupPointSize[i] -= 1;
        }

        if(e.key == "y")
        {
            renderer.postponed.push
            (
                (gl) =>
                {
                    const pixels = new Uint8Array(canvas.width * canvas.height * 4);
                    renderer.gl.bindFramebuffer(renderer.gl.READ_FRAMEBUFFER, renderer.buffer.frame.main);
                    renderer.gl.readBuffer(renderer.gl.COLOR_ATTACHMENT0);
                    renderer.gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

                    const data = new Uint8ClampedArray(pixels.length);
                    for(let y = 0; y < canvas.height; ++y)
                    for(let x = 0; x < canvas.width * 4; ++x)
                        data[y * canvas.width * 4 + x] = pixels[(canvas.height - y - 1) * canvas.width * 4 + x];

                    const cvs = document.createElement("canvas", {width: canvas.width, height: canvas.height});
                    cvs.width = canvas.width;
                    cvs.height = canvas.height;

                    const ctx = cvs.getContext("2d");
                    ctx.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);

                    var link = document.createElement('a');
                    link.setAttribute("download", "screenshot.png");
                    link.setAttribute("href", cvs.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                    link.click();
                }
            );
        }
        /*
        if(e.key == "r")
        {
            if(pointSize < 6)
            {
                pointSize += 1;
                for(const i in [...Array(9).keys()])
                    renderState.groupPointSize[i] += 1;
            }
        }
        if(e.key == "f")
        {
            if(pointSize > -2)
            {
                pointSize -= 1;
                for(const i in [...Array(9).keys()])
                    renderState.groupPointSize[i] -= 1;
            }
        }
        */

        if(e.key == "-")
            renderState.timeMultiplier = -renderState.timeMultiplier;
        if(e.key == "w")
        {
            for(const i in [...Array(9).keys()])
                renderState.groupRenderSatLine[i] = !renderState.groupRenderSatLine[i];
            renderState.cleanSatLine = true;
        }

        if(e.key == "z")
            renderState.camEclipticPlane = !renderState.camEclipticPlane;
        if(e.key == "x")
            renderState.camSynchronized = !renderState.camSynchronized;
        if(e.key == "c")
            renderState.cam2D = !renderState.cam2D;
        if(e.key == "v")
            renderState.pretty = !renderState.pretty;
        if(e.key == "n")
            renderState.multisample = !renderState.multisample;
        if(e.key == "m")
        {
            if(renderState.camObjectID == -1)
                renderState.camObjectID = -2;
            else
                renderState.camObjectID = -1;
        }

        if(e.key == "i")
        {
            moveY = 1.;
        }
        if(e.key == "k")
        {
            moveY = -1.;
        }
        if(e.key == "j")
        {
            moveX = -1.;
        }
        if(e.key == "l")
        {
            moveX = 1.;
        }
        if(e.key == "p")
        {
            moveZ =  1.;
        }
        if(e.key == ";")
        {
            moveZ = -1.;
        }
        if(e.key == "o")
        {
            moveSensivity *= 1.1;
        }
        if(e.key == "u")
        {
            moveSensivity /= 1.1;
        }

        if(e.key == ",")
        {
            renderer.loadTextures(res + "lowp/", true);
            renderer.setSurfaceSize(4096);
        }
        if(e.key == ".")
        {
            renderer.loadTextures(res + "mediump/");
            renderer.setSurfaceSize(8192);
        }
        if(e.key == "/")
        {
            renderer.loadTextures(res + "highp/");
            renderer.setSurfaceSize(16384);
        }

        if(e.key == "t")
        {
            for(let k = 0; k < 10; ++k)
                renderState.groupOrbitVisibility[k] = !renderState.groupOrbitVisibility[k];
        }
        const i = parseInt(e.key);
        if(i == 0)
        {
            for(let k = 0; k < 10; ++k)
                renderState.groupPointVisibility[k] = !renderState.groupPointVisibility[k];
        }
        else if(i == i)
        {
            renderState.groupPointVisibility[i - 1] = !renderState.groupPointVisibility[i - 1];
        }
    };
    window.onkeyup = (e) =>
    {
        if(e.key == "i" || e.key == "k")
        {
            moveY = 0.;
        }
        if(e.key == "j" || e.key == "l")
        {
            moveX = 0.;
        }
        if(e.key == "p" || e.key == ";")
        {
            moveZ = 0.;
        }
    };

}

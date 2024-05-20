import {FunctionComponent, useEffect} from "react"
import {WebGLRenderer} from "./build/src/webgl_renderer"
import {RenderState} from "./build/src/render_state"
import {onWheel, onMouseMove} from "./build/src/on_canvas_events.ts"
import namesJSON from './test/res/names.json'
import groupsJSON from './test/res/groups.json'
import regionsJSON from './test/res/regions.json'
import stationsJSON from './test/res/stations.json'
import trajectoriesWEBP from './test/res/trajectories.webp'
import remote_sensing_devicesWEBP from './test/res/remote_sensing_devices.webp'
import objectsWEBP from './test/res/objects.webp'
import messagesWEBP from './test/res/messages.webp'
import {ArrowLeftFromLine, CaretLeft, CaretRight} from "@gravity-ui/icons"


export const Earth: FunctionComponent<{className: string, setFullscreen: (fullscreen: boolean) => void, fullscreen: boolean, ifControls: boolean}> = ({className, setFullscreen, fullscreen, ifControls}) => {

    useEffect(() => {
        window.onload = () => {
            const nameElement = document.querySelector("#name") as HTMLDivElement;
            const timeElement = document.querySelector("#time") as HTMLDivElement;
            const nameNode = document.createTextNode("");
            const timeNode = document.createTextNode("");
            nameElement?.appendChild(nameNode);
            timeElement?.appendChild(timeNode);

            const overlay = document.querySelector("#nameOverlay") as HTMLDivElement;
            const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;

            const renderState = new RenderState() as RenderState;
            const renderer = new WebGLRenderer(canvas, renderState);
            const res = "./src/components/Earth/build/res/";
            renderer.loadTextures("./build/res/lowp");

            // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
            renderState.time = 1679374800. * 1000.;

            let moveX = 0.;
            let moveY = 0.;
            let moveZ = 0.;
            let moveSensivity = 1.;

            const clamp = (x: number, xmin: number, xmax: number) => Math.min(xmax, Math.max(xmin, x));

            // names.json
            renderer.afterRender = (renderState) => {
                const pick = renderState.pickInfo();
                if(pick.target == "satellite" && renderState.enableHover) {
                    nameNode.nodeValue = namesJSON["name"][pick.ID];

                    const [x, y] = renderState.cursor;
                    overlay.style.left = `${      x  * canvas.clientWidth  +  8}px`;
                    overlay.style. top = `${(1. - y) * canvas.clientHeight - 16}px`;
                }
                else if(pick.target == "station" && renderState.enableHover) {
                    nameNode.nodeValue = namesJSON["name"][renderer.satelliteCount + pick.ID];

                    const [x, y] = renderState.cursor;
                    overlay.style.left = `${      x  * canvas.clientWidth  +  8}px`;
                    overlay.style. top = `${(1. - y) * canvas.clientHeight - 16}px`;
                }
                else {
                    nameNode.nodeValue = "";
                }

                const date = new Date(1970, 0, 1);
                date.setTime(renderState.time);
                timeNode.nodeValue = date.toString();

                const [u0, v0, z] = renderState.mouse();
                const u =       u0 + moveSensivity * moveX / canvas.clientWidth;
                const v = clamp(v0 - moveSensivity * moveY / canvas.clientHeight, -0.999, 0.999);
                renderState.setMouse([u, v, clamp(z + 5e-4 * moveZ * moveSensivity, 0., 1.)]);

            };

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

            const sat = new Image();
            sat.src = trajectoriesWEBP;
            sat.onload = () =>
            {
                renderer.loadSatellites(sat);

                renderer.groupSatellites(groupsJSON["group"]);

                const capture = new Image();
                capture.src = remote_sensing_devicesWEBP;
                capture.onload = () => {renderer.loadCapture(capture);};
            };

            const obj = new Image();
            obj.src = objectsWEBP;
            obj.onload = () => {
                renderer.load3DObject(obj);
            };

            const comms = new Image();
            comms.src = messagesWEBP;
            comms.onload = () => {
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

            renderer.loadRegions(regionsJSON.map((points) => {return {lines: points, ID: 0};}));
            renderer.groupRegions(Array(regionsJSON.length).fill(2));

            // const toRad = Math.PI / 180.;

            // stations.json
            const stationGroup = 253;
            renderState.groupColor[stationGroup].r = 0.;
            renderState.groupColor[stationGroup].g = 1.;
            renderState.groupColor[stationGroup].b = 1.;
            renderState.groupPointVisibility[stationGroup] = true;
            renderState.groupPointShape[stationGroup] = 0;
            renderState.groupPointSize[stationGroup] = 8;
            renderer.loadStations(stationsJSON);
            renderer.groupStations(Array(stationsJSON.length).fill(stationGroup));

            renderState.framesBetweenFade = 50;
            renderState.satLineFade = 3;
            renderState.satViewFade = 2;


            // renderState.enableHover = false;
            // renderState.setPickInfo({target: "satellite", ID: 0});
            // renderState.setPickSizeMultiplier = 3;


            if(ifControls) {
                canvas.onwheel = onWheel(renderState)
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

                // var pointSize = 0;
                window.onkeydown = (e) =>
                {
                    const m = 5;
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
                        renderer.postponed.push(
                            (gl: WebGLRenderingContext) =>
                            {
                                const pixels = new Uint8Array(canvas.width * canvas.height * 4);
                                renderer.gl.bindFramebuffer(renderer.gl.READ_FRAMEBUFFER, renderer.buffer.frame.main);
                                renderer.gl.readBuffer(renderer.gl.COLOR_ATTACHMENT0);
                                renderer.gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

                                const data = new Uint8ClampedArray(pixels.length);
                                for(let y = 0; y < canvas.height; ++y)
                                for(let x = 0; x < canvas.width * 4; ++x)
                                    data[y * canvas.width * 4 + x] = pixels[(canvas.height - y - 1) * canvas.width * 4 + x];

                                const cvs: HTMLCanvasElement = document.createElement<"canvas">("canvas");
                                cvs.width = canvas.width;
                                cvs.height = canvas.height;

                                const ctx = cvs.getContext("2d");
                                ctx!.putImageData(new ImageData(data, canvas.width, canvas.height), 0, 0);

                                const link = document.createElement('a');
                                link.setAttribute("download", "screenshot.png");
                                link.setAttribute("href", cvs.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                                link.click();
                            }
                        );
                    }

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
        }
    }, [ifControls])

    function triggerKeyPress(key: string) {
        dispatchEvent(new KeyboardEvent('keydown', {'key': key}))
    }



    return (
        <div className={`${className}`}>
            <canvas id="glCanvas" className="w-full h-full rounded-3xl overflow-hidden"></canvas>
            <div id="timeOverlay" className="absolute top-0 left-0 text-white">
                <div className={`relative left-2 top-2 p-2 rounded-lg flex flex-col space-y-1 bg-black/30 backdrop-blur-lg transition-all`}>
                    {/*<button className={`border rounded px-2 hover:bg-white/10`}*/}
                    {/*        onClick={() => setControls(!controls)}>{controls ? 'Выкл' : 'Вкл'} управление*/}
                    {/*</button>*/}
                    <button className={`border rounded px-2 hover:bg-white/10`}
                            onClick={() => triggerKeyPress('m')}>Перекл. камеру
                    </button>
                    <button className={`border rounded px-2 hover:bg-white/10`}
                            onClick={() => triggerKeyPress('c')}>Перекл. 2D/3D
                    </button>
                    <button className={`border rounded px-2 hover:bg-white/10`}
                            onClick={() => triggerKeyPress('t')}>Вкл/выкл орбиты
                    </button>
                    <button className={`border rounded px-2 hover:bg-white/10`}
                            onClick={() => triggerKeyPress('z')}>Эллиптич. пл-ть
                    </button>
                    <div className={`flex space-x-1 flex-grow`}>
                        <button
                            className={`border rounded px-2 hover:bg-white/10 w-1/2 flex items-center justify-center`}
                            onClick={() => triggerKeyPress('d')}><CaretLeft className="w-6 h-6"/>
                        </button>
                        <button
                            className={`border rounded px-2 hover:bg-white/10 w-1/2 flex items-center justify-center`}
                            onClick={() => triggerKeyPress('e')}><CaretRight className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
                <div className="relative flex flex-col gap-2">
                    {
                        fullscreen &&
                        <button className="text-slate-300 leading-0 border-2 border-slate-300 rounded-lg p-1 w-fit"
                                onClick={() => setFullscreen(!fullscreen)}>{fullscreen &&
                            <ArrowLeftFromLine className="w-6 h-6"/>}</button>
                    }
                    <span id="time" className={`${fullscreen ? 'block' : 'hidden'}`}></span>
                </div>
            </div>
            <div id="nameOverlay" className="absolute top-0 left-0 text-white">
                <div><span id="name"></span></div>
            </div>
        </div>
    )
}
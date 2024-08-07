export class RGBAColor {
    constructor(red = 0., green = 0., blue = 0., alpha = 1.) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }
}
const generateColors = () => {
    const hue = [
        0, 60, 120, 180, 240, 300,
        30, 90, 150, 210, 270, 330,
        15, 75, 135, 195, 255, 315,
        45, 105, 165, 225, 285, 345,
    ];
    const saturation = [100, 60, 80];
    const value = [100, 70, 80, 60];
    const color = Array(hue.length * saturation.length * value.length);
    for (let i = 0; i < value.length; ++i)
        for (let j = 0; j < saturation.length; ++j)
            for (let k = 0; k < hue.length; ++k) {
                const l = (i * saturation.length + j) * hue.length + k;
                const h = hue[k];
                const s = saturation[j] / 100.;
                const v = value[i] / 100.;
                const f = (n) => {
                    const p = (n + h / 60) % 6;
                    return v * (1. - s * Math.max(0, Math.min(1, Math.min(p, 4 - p))));
                };
                color[l] = new RGBAColor(f(5), f(3), f(1), 0.3);
            }
    return color;
};
export class RenderState {
    timeLerp(k) {
        return (1. - k) * this.time0 + k * this.time1;
    }
    pickInfo() {
        const type = this.pick[0] / 16;
        return {
            target: type == 1 ? "satellite"
                : (type == 2 ? "station"
                    : (type == 3 ? "region"
                        : (type == 4 ? "comms"
                            : "nothing"))),
            ID: (this.pick[0] % 16) * 65536
                + this.pick[1] * 256
                + this.pick[2],
        };
    }
    setPickInfo(pick) {
        const targetList = ["nothing", "satellite", "station", "region", "comms"];
        this.pick[0] = targetList.findIndex(elem => elem == pick.target) + pick.ID / 65536;
        this.pick[1] = (pick.ID / 256) % 256;
        this.pick[2] = pick.ID % 256;
    }
    mouse() {
        return this.cam2D ? this.mouse2D : this.mouse3D;
    }
    setMouse(m) {
        this.mouse2D = this.cam2D ? m : this.mouse2D;
        this.mouse3D = this.cam2D ? this.mouse3D : m;
    }
    constructor() {
        this.time = Date.UTC(2000, 0, 1) + 43200. * 1000.;
        this.timeMultiplier = 1.;
        this.maxFrameDelay = 5000.;
        this.orbitPointCount = 120;
        this.enableHover = true;
        this.pick = new Uint8Array(4); // mutable both by user and renderer
        this.pickSizeMultiplier = 1.75;
        this.pickColorMultiplier = 2.;
        this.pretty = true;
        this.multisample = true;
        this.cleanSatLine = false;
        this.cleanSatView = false;
        this.cleanSatCapture = false;
        this.cleanRegions = false;
        this.satLineFade = 0; // 0-255
        this.satViewFade = 0; // 0-255
        this.satCaptureFade = 0; // 0-255
        this.framesBetweenFade = 5;
        this.camObjectID = -1; // -2 for Moon, -1 for Earth
        this.cam2D = false;
        this.camEclipticPlane = false;
        this.camSynchronized = false;
        this.camExposure = 0.02;
        this.sunsetColor = new RGBAColor(0.0, 0.0, 0.0, 0.0);
        this.satLineColor = new RGBAColor(1.0, 0.3, 0.3, 0.4);
        this.satViewColor = new RGBAColor(0.5, 1.0, 0.5, 0.2);
        this.satCaptureColor = new RGBAColor(1.0, 1.0, 0.2, 1.0);
        this.borderColor = new RGBAColor(1.0, 1.0, 1.0, 0.3);
        this.groupColor = generateColors();
        this.groupPointSize = Array(256).fill(4); // [0; 15], from smallest to largest
        this.groupPointShape = Array(256).fill(0); // 0: ●, 1: ○, 2: ■, 3: □, 4: ◆, 5: ◇, 6: ▼, 7: x
        this.groupPointVisibility = Array(256).fill(false);
        this.groupOrbitVisibility = Array(256).fill(false);
        this.groupRenderSatLine = Array(256).fill(false);
        this.groupRenderSatView = Array(256).fill(false);
        this.groupRenderSatCapture = Array(256).fill(false);
        this.cursor = [0, 0];
        this.mouse3D = [0., 0., 0.25];
        this.mouse2D = [0., 0., 1.00];
        this.wheelSensivity = 1.;
        this.mouseSensivity = 1.;
        this.commsPointMinimalSize = 2;
        this.commsGroup = 255;
    }
}

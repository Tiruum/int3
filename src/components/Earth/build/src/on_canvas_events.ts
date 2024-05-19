import { RenderState } from "./index";

function clamp(x: number, min: number, max: number) {
    return Math.min(max, Math.max(min, x));
}

export function onWheel(renderState: RenderState) {
    return (event: any) => {
        const [u, v, z] = renderState.mouse();
        const m = 2e-4 * renderState.wheelSensivity;
        renderState.setMouse([u, v, clamp(z + m * event.deltaY, 0., 1.)]);
        event.preventDefault();
    };
}
export function onMouseMove(renderState: RenderState) {
    return (event: any) => {
        const rect = event.target.getBoundingClientRect();
        renderState.cursor =
            [
                (event.clientX - rect.left) / event.target.clientWidth,
                1 - (event.clientY - rect.top) / event.target.clientHeight,
            ];
        if (event.buttons == 1) {
            const [u0, v0, z] = renderState.mouse();
            const m = 5. * renderState.mouseSensivity * (z + 0.1);
            const u = u0 - m * event.movementX / event.target.clientWidth;
            const v = clamp(v0 + m * event.movementY / event.target.clientHeight, -0.999, 0.999);
            renderState.setMouse([u, v, z]);
        }
    };
}

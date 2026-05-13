"use strict";
async function main(ctx, Messege, global) {
    const fd = new Messege("Setup Mouse Test");
    try {
        const mouse = global.get("mouse");
        function render() {
            ctx.fillStyle = "red";
            ctx.fillRect(mouse.x, mouse.y, 10, 10);
            requestAnimationFrame(render);
        }
        fd.ok();
        return () => {
            const fd = new Messege("Setup Mouse Test");
            try {
                render();
                fd.ok();
            }
            catch (e) {
                fd.error();
                throw e;
            }
        };
    }
    catch (e) {
        fd.error();
        throw e;
    }
}
// @ts-ignore
return main;

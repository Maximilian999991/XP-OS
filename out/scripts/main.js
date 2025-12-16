"use strict";
async function main(ctx) {
    mouseInit(ctx.canvas);
    openFenster("./out/fensters/template.js");
    while (true) {
        render(ctx);
        await new Promise(requestAnimationFrame);
    }
}
//# sourceMappingURL=main.js.map
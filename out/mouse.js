async function main(ctx, Messege, global) {
    const fd = new Messege("Setup Mouse");
    try {
        const mouse = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            button: {
                pressed: false,
                down: false,
                up: false,
                x: 0,
                y: 0,
            },
            update() {
                mouse.vx = 0;
                mouse.vy = 0;
                mouse.button.pressed = false;
                mouse.button.up = false;
            },
        };
        function mouseDown(e) {
            mouse.button.pressed = true;
            mouse.button.down = true;
            mouse.button.x = e.clientX;
            mouse.button.y = e.clientY;
        }
        function mouseMove(e) {
            mouse.vx = e.clientX - mouse.x;
            mouse.vy = e.clientY - mouse.y;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
        function mouseUp(e) {
            mouse.button.down = false;
            mouse.button.up = true;
        }
        document.body.addEventListener("mousedown", mouseDown);
        document.body.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseup", mouseUp);
        global.set("mouse", mouse);
        fd.ok();
        return;
    }
    catch (e) {
        fd.error(e.message);
        throw e;
    }
}
// @ts-ignore
return main;

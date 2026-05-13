function loadImports(global) {
    const file = global.get("file");
    if (!file)
        throw new Error("Not find FileHandle");
    const mouse = global.get("mouse");
    if (!mouse)
        throw new Error("Not find Mouse");
    const keyboard = global.get("keyboard");
    if (!keyboard)
        throw new Error("Not find Keyboard");
    return { file, mouse, keyboard };
}
async function main(ctx, Messege, global) {
    const fd = new Messege("Console");
    try {
        const { file, mouse, keyboard } = loadImports(global);
        let done = false;
        const log = {
            logs: [],
            add: (text) => log.logs.unshift(text),
            clear: () => (log.logs = []),
        };
        function render() {
            const height = ctx.canvas.height;
            const width = ctx.canvas.width;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "white";
            ctx.textAlign = "start";
            ctx.textBaseline = "bottom";
            ctx.font = "15px Monospace";
            let y = 0;
            for (let i = 0; i < log.logs.length; i++) {
                ctx.fillText(log.logs[i], 0, height - y * 15);
                y++;
            }
            if (done)
                requestAnimationFrame(render);
        }
        render();
        async function run(fc) {
            use = true;
            switch (fc) {
                case "Start": {
                    break;
                }
                case "cl": {
                    log.clear();
                    break;
                }
                case "ls": {
                    const list = await file.listFolder("");
                    for (let i = 0; i < list.length; i++) {
                        log.add(list[i].name);
                    }
                    break;
                }
                case "cat": {
                }
                default: {
                    if (fc.trim() === "")
                        break;
                    log.add("[System] Not a Commane = " + fc);
                }
            }
            log.add("[User] = ");
            input = "";
            use = false;
        }
        let use = false;
        let input = "";
        function setup() {
            run("Start");
            keyboard.add("Down", (key) => {
                if (use)
                    return;
                if (key.code === "Enter") {
                    run(input);
                }
                else if (key.code === "Backspace") {
                    input = input.slice(0, input.length - 1);
                    log.logs[0] = "[User] = " + input;
                }
                else if (key.key.length < 2) {
                    log.logs[0] += key.key;
                    input = input + key.key;
                }
            });
        }
        fd.ok();
        return () => {
            const fd = new Messege("Console Render Start");
            try {
                log.add("  Terminal");
                log.add("");
                log.add(" Von Maximilian ");
                log.add(" Willkommen, dies ist der erste Test");
                setup();
                done = true;
                render();
                fd.ok();
            }
            catch (e) {
                fd.error(e.message);
                throw e;
            }
        };
    }
    catch (e) {
        fd.error(e.message);
        throw e;
    }
}
// @ts-ignore
return main;

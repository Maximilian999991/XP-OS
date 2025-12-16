"use strict";
const fensters = [];
class Fenster {
    title;
    position;
    size;
    canvas;
    constructor({ title, position = new Vector2(100, 100), size = new Vector2(150, 100), canvas = document.createElement("canvas"), }) {
        this.title = title;
        this.position = position;
        this.size = size;
        this.canvas = canvas;
        fensters.push(this);
    }
    events = [];
    addRender(fn, priority = 2) {
        // priority: 0 Tab wechsel, 1 1000ms, 2 Bei Focus, 3 Immer
        return this.events.push({ type: "render", function: fn, priority: priority });
    }
    getRender() {
        return this.events.filter((e) => e && e.type === "render").map((e) => e.function);
    }
    deleteRender(fn) {
        this.events = this.events.filter((e) => !(e.type === "render" && e.function === fn));
    }
    runRender(priority) {
        // priority: 0 Tab wechsel, 1 1000ms,
        this.events.forEach((value) => {
            if (value.type == "render" && value.priority == priority)
                value.function(this);
        });
    }
}
async function openFenster(url, force = false) {
    const code = await waitAsset("code", url);
    if (!force && code.src.startsWith("// Max-OS Fenster Signature"))
        throw new Error('Code dont start with Signature. Try "force = true"');
    eval(code.src);
}
//# sourceMappingURL=fenster.js.map
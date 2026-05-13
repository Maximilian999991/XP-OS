async function main(ctx, Messege, global) {
    const fd = new Messege("Setup Keybroard");
    try {
        const once = [];
        const all = [];
        const key = {
            press: [],
            once(type, func) {
                once.push({ type, func });
            },
            add(type, func) {
                for (let i = 0; i < once.length; i++) {
                    if (!once[i]) {
                        all[i] = { type, func };
                        return i;
                    }
                }
                return all.push({ type, func }) - 1;
            },
            remove(i) {
                if (i < all.length) {
                    all[i] = undefined;
                }
            },
        };
        function keyDown(event) {
            event.preventDefault();
            all.forEach((value) => {
                if (!value)
                    return;
                if (value.type === "Down") {
                    value.func(event);
                }
            });
            once.filter((value) => {
                if (value.type === "Down") {
                    value.func(event);
                    return true;
                }
                else
                    return false;
            });
        }
        function keyUp(event) {
            event.preventDefault();
            all.forEach((value) => {
                if (!value)
                    return;
                if (value.type === "Up") {
                    value.func(event);
                }
            });
            once.filter((value) => {
                if (value.type === "Up") {
                    value.func(event);
                    return true;
                }
                else
                    return false;
            });
        }
        document.body.addEventListener("keydown", keyDown);
        document.body.addEventListener("keyup", keyUp);
        global.set("keyboard", key);
        fd.ok();
        return () => { };
    }
    catch (e) {
        fd.error(e.message);
        throw e;
    }
}
// @ts-ignore
return main;

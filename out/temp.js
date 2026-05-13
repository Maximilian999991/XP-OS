function loadImports(global) {
    const file = global.get("file");
    if (!file)
        throw new Error("Not find FileHandle");
    const mouse = global.get("mouse");
    if (!mouse)
        throw new Error("Not find Mouse");
    const keyboard = global.get("mouse");
    if (!keyboard)
        throw new Error("Not find Keyboard");
    return { file, mouse, keyboard };
}
async function main(ctx, Messege, global) {
    const fd = new Messege("Console");
    try {
        const { file, mouse, keyboard } = loadImports(global);
        fd.ok();
        return () => { }; // After all script (After Bootscreen)
    }
    catch (e) {
        fd.error(e.message);
        throw e;
    }
}
// @ts-ignore
return main;

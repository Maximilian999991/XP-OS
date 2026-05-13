import type { Messege, FileHandle, Mouse, Keyboard } from "./types";

function loadImports(global: Map<string, unknown>) {
	const file = global.get("file") as FileHandle;
	if (!file) throw new Error("Not find FileHandle");

	const mouse = global.get("mouse") as Mouse;
	if (!mouse) throw new Error("Not find Mouse");

	const keyboard = global.get("mouse") as Keyboard;
	if (!keyboard) throw new Error("Not find Keyboard");

	return { file, mouse, keyboard };
}

async function main(ctx: CanvasRenderingContext2D, Messege: Messege, global: Map<string, unknown>) {
	const fd = new Messege("Console");

	try {
		const { file, mouse, keyboard } = loadImports(global);

		fd.ok();
		return () => {}; // After all script (After Bootscreen)
	} catch (e) {
		fd.error((e as Error).message);
		throw e;
	}
}
// @ts-ignore
return main;

import type { Messege, FileHandle } from "./types";

async function main(ctx: CanvasRenderingContext2D, Messege: Messege, global: Map<string, unknown>) {
	const fd = new Messege("Tests FileSignur");

	const fileHandle = global.get("file") as FileHandle;
	if (!fileHandle) {
		fd.error("Not find FileHandle");
		throw new Error("Not find FileHandle");
	}

	const signure = "System Max-OS v#.#";

	if (location.hash.includes("first;")) {
		fileHandle.writeFile("info", signure);
		fd.ok("Force First Start");
	} else {
		try {
			const content = await fileHandle.readFile("info");
			if (!content.startsWith(signure)) throw new Error();
			fd.ok();
		} catch (e) {
			fileHandle.writeFile("info", signure);
			fd.warn("First Start");
		}
	}

	return () => {};
}
// @ts-ignore
return main;

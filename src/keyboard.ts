import type { Messege, KeyTypes, Keyboard } from "./types";

async function main(ctx: CanvasRenderingContext2D, Messege: Messege, global: Map<string, unknown>) {
	const fd = new Messege("Setup Keybroard");

	try {
		const once: { type: KeyTypes; func: (key: KeyboardEvent) => void }[] = [];
		const all: ({ type: KeyTypes; func: (key: KeyboardEvent) => void } | undefined)[] = [];
		const key = {
			press: [],
			once(type: KeyTypes, func: (key: KeyboardEvent) => void) {
				once.push({ type, func });
			},
			add(type: KeyTypes, func: (key: KeyboardEvent) => void) {
				for (let i = 0; i < once.length; i++) {
					if (!once[i]) {
						all[i] = { type, func };
						return i;
					}
				}
				return all.push({ type, func }) - 1;
			},
			remove(i: number) {
				if (i < all.length) {
					all[i] = undefined;
				}
			},
		} as Keyboard;

		function keyDown(event: KeyboardEvent) {
			event.preventDefault();
			all.forEach((value) => {
				if (!value) return;
				if (value.type === "Down") {
					value.func(event);
				}
			});
			once.filter((value) => {
				if (value.type === "Down") {
					value.func(event);
					return true;
				} else return false;
			});
		}
		function keyUp(event: KeyboardEvent) {
			event.preventDefault();
			all.forEach((value) => {
				if (!value) return;
				if (value.type === "Up") {
					value.func(event);
				}
			});
			once.filter((value) => {
				if (value.type === "Up") {
					value.func(event);
					return true;
				} else return false;
			});
		}

		document.body.addEventListener("keydown", keyDown);
		document.body.addEventListener("keyup", keyUp);

		global.set("keyboard", key);
		fd.ok();
		return () => {};
	} catch (e) {
		fd.error((e as Error).message);
		throw e;
	}
}
// @ts-ignore
return main;

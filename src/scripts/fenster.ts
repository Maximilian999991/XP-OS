const fensters: Fenster[] = [];
class Fenster {
	title: string;
	position: Vector2;
	size: Vector2;

	canvas: HTMLCanvasElement;

	constructor({
		title,
		position = new Vector2(100, 100),
		size = new Vector2(150, 100),
		canvas = document.createElement("canvas"),
	}: {
		title: string;
		position?: Vector2;
		size?: Vector2;
		canvas?: HTMLCanvasElement;
	}) {
		this.title = title;
		this.position = position;
		this.size = size;
		this.canvas = canvas;

		fensters.push(this);
	}

	events: { type: "render" | "update"; function: Function; priority: 0 | 1 | 2 | 3 }[] = [];
	addRender(fn: Function, priority: 0 | 1 | 2 | 3 = 2): number {
		// priority: 0 Tab wechsel, 1 1000ms, 2 Bei Focus, 3 Immer
		return this.events.push({ type: "render", function: fn, priority: priority });
	}
	getRender(): Function[] {
		return this.events.filter((e) => e && e.type === "render").map((e) => e.function);
	}
	deleteRender(fn: Function): void {
		this.events = this.events.filter((e) => !(e.type === "render" && e.function === fn));
	}
	runRender(priority: 0 | 1 | 2 | 3): void {
		// priority: 0 Tab wechsel, 1 1000ms,
		this.events.forEach((value) => {
			if (value.type == "render" && value.priority == priority) value.function(this);
		});
	}
}
async function openFenster(url: string, force = false) {
	const code = await waitAsset("code", url);
	if (!force && (code.src as string).startsWith("// Max-OS Fenster Signature"))
		throw new Error('Code dont start with Signature. Try "force = true"');
	eval(code.src as string);
}

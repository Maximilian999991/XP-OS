// @ts-ignore
declare type Messege = new (text: string) => {
	type: "ok" | "start" | "warn" | "error" | "log";
	time: number;
	sleep: number;
	text: string;

	toString(): string;

	ok(e?: string): void;
	warn(e?: string): void;
	error(e?: string): void;
	log(): void;
};

async function main(ctx: CanvasRenderingContext2D, Messege: Messege, global: Map<string, unknown>) {
	const fd = new Messege("Setup Mouse Test");

	try {
		const mouse = global.get("mouse") as {
			x: number;
			y: number;
			vx: number;
			vy: number;
			button: {
				pressed: boolean;
				down: boolean;
				up: boolean;
				x: number;
				y: number;
			};
			update(): void;
		};

		function render() {
			ctx.fillStyle = "red";
			ctx.fillRect(mouse.x, mouse.y, 10, 10);

			requestAnimationFrame(render);
		}

		fd.ok();
		return () => {
			const fd = new Messege("Setup Mouse Test");
			try {
				render();
				fd.ok();
			} catch (e) {
				fd.error();
				throw e;
			}
		};
	} catch (e) {
		fd.error();
		throw e;
	}
}
// @ts-ignore
return main;

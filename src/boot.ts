// @ts-nocheck
async function main() {
	// === Messege System ===
	const messeges: Messege[] = [];
	class Messege {
		type: "ok" | "start" | "warn" | "error" | "log" = "start";
		time = performance.now();
		sleep = 0;
		text: string;

		constructor(text: string) {
			this.text = text;
			messeges.push(this);
		}

		draw(ctx: CanvasRenderingContext2D, y: number) {
			const t = this.type === "start" ? performance.now() - this.time : this.sleep;
			let sleep: string;
			if (t < 10000) {
				sleep = "" + Math.floor(t).toString().padStart(4, " ") + "";
			} else if (t < 1000000) {
				sleep =
					"" +
					Math.floor(t / 1000)
						.toString()
						.padStart(3, " ") +
					"s";
			} else sleep = ">16m";

			switch (this.type) {
				case "ok":
					ctx.fillStyle = "green";
					ctx.fillText("  OK", 5, y);
					ctx.fillStyle = "white";
					break;
				case "start":
					ctx.fillStyle = "blue";
					ctx.fillText(" wait", 5, y);
					ctx.fillStyle = "white";
					break;
				case "warn":
					ctx.fillStyle = "yellow";
					ctx.fillText(" warn", 5, y);
					ctx.fillStyle = "yellow";
					break;
				case "error":
					ctx.fillStyle = "red";
					ctx.fillText(" ERRO", 5, y);
					ctx.fillStyle = "red";
					break;
				case "log":
					ctx.fillStyle = "white";
					ctx.fillText(`              ${this.text}`, 5, y);
					return;
			}
			ctx.fillText(`              ${this.text}`, 5, y);
			ctx.fillStyle = "gray";
			ctx.fillText(`[    ] (${sleep})`, 5, y);
		}

		ok(e?: string) {
			if (!this.sleep) this.sleep = performance.now() - this.time;
			this.text = this.text + (!e ? "" : " (" + e + ")");
			this.type = "ok";
			updateGlobalMes();
		}
		warn(e?: string) {
			this.sleep = performance.now() - this.time;
			this.text = this.text + (!e ? "" : " (" + e + ")");
			this.type = "warn";
			updateGlobalMes();
		}
		error(e?: string) {
			this.sleep = performance.now() - this.time;
			this.text = this.text + (!e ? "" : " (" + e + ")");
			this.type = "error";
			updateGlobalMes();
		}
		log() {
			this.type = "log";
			updateGlobalMes();
		}
	}
	function updateGlobalMes() {
		(window as never).output = messeges;
	}

	// === Setup BodyStyle for Canvas ===
	function setupBody(): void {
		const fd = new Messege("Document Body");
		try {
			const body = document.body;
			if (!body) throw new Error("HTMLBody nicht da");

			body.style.background = "black";
			body.style.overflow = "hidden";
			body.style.margin = "0px";
			body.style.padding = "0px";

			fd.ok();
			return;
		} catch (e) {
			fd.error((e as Error).message);
			throw e;
		}
	}

	// === Canvas System ===
	function createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
		function createElement(): HTMLCanvasElement {
			const fd = new Messege("Canvas");
			try {
				const canvas = document.createElement("canvas");
				canvas.style.position = "absolute";
				canvas.style.inset = "0px";
				canvas.style.zIndex = 2;
				function resize() {
					canvas.width = innerWidth;
					canvas.height = innerHeight;
				}
				resize();
				addEventListener("resize", resize);
				document.body.appendChild(canvas);

				fd.ok();
				return canvas;
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		}
		function createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
			const fd = new Messege("CanvasRenderingContext2D");
			try {
				const ctx = canvas.getContext("2d")!;
				if (!ctx) throw new Error("CanvasRenderingContext2D nicht da");

				fd.ok();
				return ctx;
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		}

		const canvas = createElement();
		const ctx = createContext(canvas);

		return [canvas, ctx];
	}

	// === Client Canvas System ===
	function createCanvas2(): [HTMLCanvasElement, CanvasRenderingContext2D] {
		function createElement(): HTMLCanvasElement {
			const fd = new Messege("Client Canvas");
			try {
				const canvas = document.createElement("canvas");
				canvas.style.position = "absolute";
				canvas.style.inset = "0px";
				canvas.style.zIndex = 1;
				function resize() {
					canvas.width = innerWidth;
					canvas.height = innerHeight;
				}
				resize();
				addEventListener("resize", resize);
				document.body.appendChild(canvas);

				fd.ok();
				return canvas;
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		}
		function createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
			const fd = new Messege("Client CanvasRenderingContext2D");
			try {
				const ctx = canvas.getContext("2d")!;
				if (!ctx) throw new Error("CanvasRenderingContext2D nicht da");

				fd.ok();
				return ctx;
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		}

		const canvas = createElement();
		const ctx = createContext(canvas);

		return [canvas, ctx];
	}

	// === Boot Render System ===
	function createBootRender(ctx: CanvasRenderingContext2D): Promise<() => void> {
		return new Promise((res) => {
			const fd = new Messege("Boot Render");
			try {
				let stop = false;

				function render() {
					ctx.canvas.hidden = !location.hash.includes("debug;");
					if (location.hash.includes("debug;")) {
						const width = ctx.canvas.width;
						const height = ctx.canvas.height;
						const min = Math.min(width, height);

						ctx.fillStyle = "black";
						ctx.fillRect(0, 0, width, height);

						ctx.fillStyle = "white";
						ctx.textBaseline = "bottom";
						ctx.textAlign = "left";
						ctx.font = (min / 60).toString() + "px monospace";
						let y = height;
						for (let i = messeges.length; i > 0; i--) {
							if (y < 0) {
								messeges.splice(--i, 1);
								continue;
							}
							messeges[i - 1].draw(ctx, y - 5);
							y -= min / 60;
						}
					}
					if (!stop) requestAnimationFrame(render);
				}

				requestAnimationFrame(() => {
					render();
					fd.ok();
					res(() => (stop = true));
				});
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		});
	}

	// === Client Render System ===
	function createClientRender(ctx: CanvasRenderingContext2D): Promise<() => void> {
		return new Promise((res) => {
			const fd = new Messege("Client Render");
			try {
				let stop = false;
				const start = performance.now();

				function render() {
					const width = ctx.canvas.width;
					const height = ctx.canvas.height;
					const min = Math.min(width, height);

					ctx.fillStyle = "black";
					ctx.fillRect(0, 0, width, height);

					const i = Math.max(0, Math.min(256, (performance.now() - start) / 10));
					ctx.fillStyle = "rgb(" + i + ", " + i + ", " + i + ")";
					ctx.textBaseline = "bottom";
					ctx.textAlign = "center";
					ctx.font = (min / 25).toString() + "px Roboto";
					ctx.fillText("Test", width / 2, height / 2.8);

					ctx.textBaseline = "top";
					ctx.textAlign = "center";
					ctx.font = (min / 50).toString() + "px Roboto";
					ctx.fillText("v1.0", width / 2, height / 2.8);

					ctx.textBaseline = "middle";
					ctx.font = (min / 50).toString() + "px Roboto";
					ctx.fillText(messeges.find((i) => i.type === "start")?.text ?? "", width / 2, height / 1.1);

					if (stop) {
						ctx.fillStyle = "rgba(50, 50, 50, 1)";
						ctx.textBaseline = "top";
						ctx.textAlign = "left";
						ctx.font = (min / 50).toString() + "px Roboto";
						ctx.fillText("Stop", 5, 5);
					} else requestAnimationFrame(render);
				}

				requestAnimationFrame(() => {
					render();
					fd.ok();
					res(() => (stop = true));
				});
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		});
	}

	// === Assets Loading System ===
	const assets = [
		"./out/fonts.js",
		"./out/file.js",
		"./out/fileSignur.js",
		"./out/mouse.js",
		"./out/keyboard.js",

		"./out/console.js",
		// "./out/tests/mouse.js",

		"./out/wait.js",
		// "./out/tests/returnNonfunction.js",
	];
	function loadAssets(): Promise<string[]> {
		return new Promise((res, rej) => {
			const fd = new Messege("Load Assets");
			try {
				const list: string[] = [];
				let done = 0;

				function check() {
					if (++done >= assets.length) {
						fd.ok();
						res(list);
					}
				}
				async function load(i: number) {
					const ffd = new Messege(' - "' + assets[i] + '"');
					try {
						let retry = 0;
						while (true) {
							try {
								ffd.type = "start";
								const res = await fetch(assets[i]);
								if (!res.ok) throw new Error();
								list[i] = await res.text();
								ffd.ok();
								fd.text = "Load Assets (" + (done + 1) + "/" + assets.length + ")";
								check();
								return;
							} catch (e) {
								ffd.type = "error";
								ffd.text = ' - "' + assets[i] + '" (' + ++retry + ")";

								if (retry >= 10) throw new Error("To many Faild");
								await new Promise((res) => setTimeout(res, 5000));
							}
						}
					} catch (e) {
						ffd.error((e as Error).message);
						fd.error();
						rej(e);
						throw e;
					}
				}

				for (let i = 0; i < assets.length; i++) {
					load(i);
				}
			} catch (e) {
				fd.error((e as Error).message);
				throw e;
			}
		});
	}

	// === Assets Compile System ===
	function complileAssets(codes: string[], names: string[]) {
		const fd = new Messege("Complile Assets");
		try {
			const functions: ((
				ctx: CanvasRenderingContext2D,
				msg: Messege,
				global: Map<string, unknown>,
			) => ((ctx: CanvasRenderingContext2D, msg: Messege, global: Map<string, unknown>) => void) | void)[] = [];

			for (let i = 0; i < codes.length; i++) {
				const ffd = new Messege(' - "' + names[i] + '"');
				try {
					const res = new Function(codes[i])();
					if (typeof res !== "function") {
						ffd.warn("Return not a Function");
					} else {
						functions.push(res);
						ffd.ok();
					}
				} catch (e) {
					ffd.error((e as Error).message);
					throw e;
				}
				fd.text = "Complile Assets (" + (i + 1) + "/" + codes.length + ")";
			}

			fd.ok();
			return functions;
		} catch (e) {
			fd.error((e as Error).message);
			throw e;
		}
	}

	new Messege("=== Booting           ===").log();
	new Messege(" -  Von Maximilian     - ").log();
	new Messege("").log();

	new Messege("").log();
	new Messege("--- Booter Scripts    ---").log();
	new Messege("").log();

	setupBody();
	const [, ctx] = createCanvas();
	const [, ctx2] = createCanvas2();
	await createBootRender(ctx);
	const stop2 = await createClientRender(ctx2);
	const list = await loadAssets();
	const functions = complileAssets(list, assets);

	new Messege("").log();
	new Messege("--- Run Scripts       ---").log();
	new Messege("").log();

	const global: Map<string, unknown> = new Map();
	const after: ((ctx: CanvasRenderingContext2D, msg: Messege, global: Map<string, unknown>) => unknown)[] = [];
	for (let i = 0; i < functions.length; i++) {
		try {
			const output = await functions[i](ctx2, Messege, global);
			if (output && typeof output === "function") after.push(output);
		} catch (e) {
			new Messege("System: Stoped because of a Error").error((e as Error).message);
			throw e;
		}
	}

	new Messege("").log();
	new Messege("--- Run After Scripts ---").log();
	new Messege("").log();

	stop2();
	for (let i = 0; i < after.length; i++) {
		try {
			after[i](ctx2, Messege, global);
		} catch (e) {
			/* empty */
		}
	}
}
main();

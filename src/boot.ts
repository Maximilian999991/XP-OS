// Max-OS Bootloader
const VERSION = "v1.0.0 BETA";
const assets: Asset[] = [];

type AssetType = "img" | "script" | "code" | "font";
class Asset {
	path: string;
	name: string;
	type: AssetType;
	src: HTMLImageElement | HTMLScriptElement | string | FontFace | null = null;
	done = false;
	private retryTimer?: number;

	constructor(path: string, type: AssetType, name?: string) {
		this.path = path;
		this.name = name ?? path;
		this.type = type;
		assets.push(this);
		this.load();
	}

	private retry(fn: () => void) {
		clearTimeout(this.retryTimer);
		this.retryTimer = window.setTimeout(fn, 1000);
	}

	load() {
		this.done = false;
		try {
			switch (this.type) {
				case "img":
					return this.loadImage();
				case "script":
					return this.loadScript();
				case "code":
					return this.loadCode();
				case "font":
					return this.loadFont();
				default:
					throw new Error("Unknown asset type");
			}
		} catch {
			this.retry(() => this.load());
		}
	}

	clear() {
		const i = assets.indexOf(this);
		if (i >= 0) assets.splice(i, 1);
		if (this.src instanceof HTMLElement) this.src.remove();
		this.src = null;
		this.done = false;
	}

	private loadImage() {
		if (this.src instanceof HTMLImageElement) this.src.remove();
		const img = new Image();
		img.onload = () => (this.done = true);
		img.onerror = () => this.retry(() => this.load());
		img.src = this.path;
		this.src = img;
	}

	private loadScript() {
		if (this.src instanceof HTMLScriptElement) this.src.remove();
		const el = document.createElement("script");
		el.src = this.path;
		el.async = true;
		el.onload = () => (this.done = true);
		el.onerror = () => this.retry(() => this.load());
		document.body.appendChild(el);
		this.src = el;
	}

	private async loadCode() {
		const r = await fetch(this.path);
		if (!r.ok) this.retry(() => this.load());
		this.src = await r.text();
		this.done = true;
	}

	private loadFont() {
		const ff = new FontFace(this.name, `url(${this.path})`);
		ff.load()
			.then((loaded) => {
				document.fonts.add(loaded);
				this.src = loaded;
				this.done = true;
			})
			.catch(() => this.retry(() => this.load()));
	}
}
function getAsset(name: string) {
	return assets.find((a) => a.name === name || a.path === name);
}
async function waitAsset(type: AssetType, url: string, name?: string): Promise<Asset> {
	const value = getAsset(name ?? url);
	if (value) {
		return value;
	} else {
		const newValue = new Asset(url, type, name);
		while (!newValue.done) {
			await new Promise((res) => setTimeout(res, 100));
		}
		return newValue;
	}
}

async function boot() {
	console.log(`Booting Max-OS ${VERSION} von Maximilian`);

	function createCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
		const canvas = document.createElement("canvas");
		canvas.width = 640;
		canvas.height = 480;
		canvas.style.imageRendering = "pixelated";
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas 2D nicht verfügbar");
		ctx.textRendering = "optimizeSpeed";

		const resize = () => {
			const scale = Math.min(window.innerWidth / 640, window.innerHeight / 480);
			canvas.style.width = `${640 * scale}px`;
			canvas.style.height = `${480 * scale}px`;
		};
		resize();
		window.addEventListener("resize", resize);
		document.body.appendChild(canvas);
		return [canvas, ctx];
	}

	function loadCoreAssets() {
		new Asset("./out/scripts/main.js", "script");
		new Asset("./out/scripts/std.js", "script");
		new Asset("./out/scripts/update.js", "script");
		new Asset("./out/scripts/render.js", "script");
		new Asset("./out/scripts/mouse.js", "script");
		new Asset("./out/scripts/fenster.js", "script");
		new Asset("./fonts/Roboto-Regular.ttf", "font", "Roboto");
	}
	function loadExtraAssets() {
		new Asset("./fonts/Roboto-Italic.ttf", "font", "Roboto-Italic");
		new Asset("./fonts/Roboto-Bold.ttf", "font", "Roboto-Bold");
		new Asset("./fonts/Roboto-BoldItalic.ttf", "font", "Roboto-BoldItalic");
		new Asset("./icons/Logo.png", "img", "Logo");
		new Asset("./icons/Minimiren.png", "img", "Minimiren");
		new Asset("./icons/Maximiren.png", "img", "Maximiren");
		new Asset("./icons/Schlissen.png", "img", "Schlissen");
	}

	async function waitForAssets() {
		const tStart = performance.now();
		let requiredDone = false;
		let requiredAssets: number | undefined;
		let finishTime: number | undefined;
		let finish = false;

		while (true) {
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Title
			const elapsed = performance.now() - tStart;
			const p = Math.min(elapsed / 2000, 1);
			const shade = Math.round(p * 255);
			ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
			ctx.font = "25px Roboto";
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			ctx.fillText("Max-OS", canvas.width / 2, canvas.height * 0.38);
			// Version
			ctx.font = "15px Roboto";
			ctx.textBaseline = "top";
			ctx.fillText(`${VERSION} von Maximilian`, canvas.width / 2, canvas.height * 0.4);

			// Timer
			const allDone1 = assets.every((a) => a.done);
			ctx.font = "10px Roboto";
			ctx.textBaseline = "top";
			if (finishTime)
				ctx.fillText(
					`${Math.ceil((finishTime + (allDone1 ? 3000 : 10000) - elapsed) / 1000)}s`,
					canvas.width / 2,
					canvas.height * 0.9,
				);
			ctx.textBaseline = "bottom";
			if (finishTime) ctx.fillText(`Loading Assets`, canvas.width / 2, canvas.height * 0.89);

			// Allways on Status
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.font = "10px Roboto";
			const loaded = assets.reduce((a, b) => a + (b.done ? 1 : 0), 0);
			ctx.fillStyle = "rgb(50,50,50)";
			ctx.fillText(`${loaded} / ${assets.length} Assets loaded`, 4, 4);

			// Allways on Font
			ctx.textBaseline = "bottom";
			ctx.fillStyle = "rgb(50,50,50)";
			ctx.font = "10px Roboto";
			ctx.fillText((getAsset("Roboto")?.done ? " > " : "X ") + "Roboto", 4, canvas.height - 40);
			ctx.font = "10px Roboto-Bold";
			ctx.fillText((getAsset("Roboto-Bold")?.done ? " > " : "X ") + "Roboto-Bold", 4, canvas.height - 28);
			ctx.font = "10px Roboto-Italic";
			ctx.fillText((getAsset("Roboto-Italic")?.done ? " > " : "X ") + "Roboto-Italic", 4, canvas.height - 16);
			ctx.font = "10px Roboto-BoldItalic";
			ctx.fillText(
				(getAsset("Roboto-BoldItalic")?.done ? " > " : "X ") + "Roboto-BoldItalic",
				4,
				canvas.height - 4,
			);

			if (elapsed > 2000 && assets.some((a) => !a.done)) {
				// Core Status
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";
				ctx.font = "12px Roboto";
				ctx.fillStyle = requiredAssets ? "rgb(50,50,50)" : "rgb(150, 150, 150)";
				ctx.fillText(
					`${requiredAssets ?? loaded} / ${requiredAssets ?? assets.length} Core Assets loaded`,
					canvas.width / 2,
					canvas.height * 0.6,
				);

				// Extra Status
				if (requiredAssets) {
					ctx.textAlign = "center";
					ctx.textBaseline = "top";
					ctx.font = "12px Roboto";
					ctx.fillStyle = loaded == assets.length ? "rgb(50,50,50)" : "rgb(150, 150, 150)";
					ctx.fillText(
						`${loaded - requiredAssets} / ${assets.length - requiredAssets} Extra Assets loaded`,
						canvas.width / 2,
						canvas.height * 0.61,
					);
				}
			}

			const anyNotDone = assets.some((a) => !a.done);
			if (!requiredDone && !anyNotDone) {
				requiredAssets = assets.length;
				finishTime = elapsed;
				loadExtraAssets();
				requiredDone = true;
			}

			const allDone2 = assets.every((a) => a.done);
			if (!finish && allDone2) {
				finishTime = elapsed;
				finish = true;
			}
			if (finishTime) if (elapsed - finishTime > (allDone2 ? 3000 : 10000) && requiredDone) break;

			await new Promise(requestAnimationFrame);
		}
	}

	const [canvas, ctx] = createCanvas();
	loadCoreAssets();
	await waitForAssets();

	try {
		if (assets.length == 0) throw new Error("No assets loaded!");

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Title
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.font = "25px Roboto-Bold";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Max-OS", canvas.width / 2, canvas.height / 2);

		// @ts-ignore
		await main(ctx);
	} catch (err) {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Title
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.font = "25px Roboto";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Max-OS", 5, 5);
		// Version
		ctx.font = "12px Roboto";
		ctx.fillText(`${VERSION} von Maximilian`, 5, 27);

		// Mesege Type
		ctx.fillStyle = "rgba(179, 0, 0, 1)";
		ctx.font = "15px Roboto";
		ctx.fillText((err as object).constructor.name, 5, 60);
		// Mesege
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.font = "10px Roboto";
		ctx.fillText(String((err as Error).message ?? err), 5, 80);

		throw err;
	}
}

boot();

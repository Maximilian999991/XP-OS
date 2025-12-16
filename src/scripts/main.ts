async function main(ctx: CanvasRenderingContext2D) {
	mouseInit(ctx.canvas);
	openFenster("./out/fensters/template.js");

	while (true) {
		render(ctx);
		await new Promise(requestAnimationFrame);
	}
}

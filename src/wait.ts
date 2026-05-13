import type { Messege } from "./types";

async function main(ctx: CanvasRenderingContext2D, Messege: Messege, global: Map<string, unknown>) {
	const td = new Messege("3");
	const fd = new Messege("Timer");

	await new Promise((res) => setTimeout(res, 1000));
	td.text = "2";
	await new Promise((res) => setTimeout(res, 1000));
	td.text = "1";
	await new Promise((res) => setTimeout(res, 1000));
	td.text = "0";

	td.ok();
	fd.ok();

	return () => {};
}
// @ts-ignore
return main;

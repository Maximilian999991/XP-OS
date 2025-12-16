const mouse = {
	position: new Vector2(0, 0),
	velosity: new Vector2(0, 0),
	button: {
		press: false,
		down: false,
		up: false,
		position: new Vector2(0, 0),
	},
};

function mouseInit(canvas: HTMLCanvasElement): void {
	function mouseDown(e: MouseEvent): void {
		mouse.button.press = true;
		mouse.button.down = true;

		const rect = canvas.getBoundingClientRect();
		mouse.button.position = new Vector2(
			(e.clientX - rect.left) * (canvas.width / rect.width),
			(e.clientY - rect.top) * (canvas.height / rect.height),
		);
	}
	function mouseMove(e: MouseEvent): void {
		mouse.button.press = true;
		mouse.button.down = true;

		const rect = canvas.getBoundingClientRect();
		mouse.position = new Vector2(
			(e.clientX - rect.left) * (canvas.width / rect.width),
			(e.clientY - rect.top) * (canvas.height / rect.height),
		);
	}
	function mouseUp(e: MouseEvent): void {
		mouse.button.down = false;
		mouse.button.up = true;
	}

	window.addEventListener("mousedown", mouseDown);
	window.addEventListener("mousemove", mouseMove);
	window.addEventListener("mouseup", mouseUp);
}

// Max-OS Fenster Signature
const value = new Fenster({
	title: "Title",
});
value.addRender((fenster: Fenster) => {
	fenster.title = performance.now().toString();
}, 3)

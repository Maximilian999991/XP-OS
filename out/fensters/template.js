"use strict";
// Max-OS Fenster Signature
const value = new Fenster({
    title: "Title",
});
value.addRender((fenster) => {
    fenster.title = performance.now().toString();
}, 3);
//# sourceMappingURL=template.js.map
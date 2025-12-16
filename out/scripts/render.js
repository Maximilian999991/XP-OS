"use strict";
function render(ctx) {
    const backgroundsColor = {
        fenster: new Color("rgba(75, 75, 75, 1)"),
        title: new Color("rgba(125, 125, 125, 1)"),
        text: new Color("rgba(0, 0, 0, 1)"),
        font: "Roboto",
        content: new Color("rgba(125, 125, 125, 1)"),
        button: {
            close: new Color("rgba(150, 150, 150, 1)"),
            max: new Color("rgba(150, 150, 150, 1)"),
            min: new Color("rgba(150, 150, 150, 1)"),
        },
    };
    const sizes = {
        title: 14,
        text: 10,
        buttons: {
            close: 10,
            max: 10,
            min: 10,
            border: 2,
            padding: 2,
        },
        border: 2,
        padding: 2,
    };
    const buttonsConfig = {
        close: { enable: true, name: "Schlissen" },
        max: { enable: true, name: "Maximiren" },
        min: { enable: true, name: "Minimiren" },
    };
    function renderFenster(fn) {
        const x = Math.round(fn.position.x);
        const y = Math.round(fn.position.y);
        const sx = Math.round(fn.size.x);
        const sy = Math.round(fn.size.y);
        function backgrounds() {
            // Fenster
            if (backgroundsColor.fenster) {
                ctx.fillStyle = backgroundsColor.fenster.style;
                ctx.fillRect(x, y, fn.size.x, sy);
            }
            // Title
            if (backgroundsColor.title) {
                ctx.fillStyle = backgroundsColor.title.style;
                ctx.fillRect(x + sizes.border, y + sizes.border, sx - sizes.border * 2, sizes.title);
            }
            // Content
            if (backgroundsColor.content) {
                ctx.fillStyle = backgroundsColor.content.style;
                ctx.fillRect(x + sizes.border, y + sizes.border + sizes.padding + sizes.title, sx - sizes.border * 2, sy - sizes.border * 2 - sizes.padding - sizes.title);
            }
        }
        function buttons() {
            let xx = x + sx - sizes.border - sizes.buttons.border;
            ctx.imageSmoothingEnabled = true;
            // Clocse
            if (buttonsConfig.close.enable) {
                if (backgroundsColor.button.close) {
                    ctx.fillStyle = backgroundsColor.button.close.style;
                    ctx.fillRect(xx - sizes.buttons.close, y + sizes.border + sizes.buttons.border, sizes.buttons.close, sizes.title - sizes.buttons.border * 2);
                }
                const img = getAsset(buttonsConfig.close.name)?.src;
                if (img)
                    ctx.drawImage(img, xx - sizes.buttons.close, y + sizes.border + sizes.buttons.border, sizes.buttons.close, sizes.title - sizes.buttons.border * 2);
                xx -= sizes.buttons.close + sizes.buttons.padding;
            }
            // Max
            if (buttonsConfig.max.enable) {
                if (backgroundsColor.button.max) {
                    ctx.fillStyle = backgroundsColor.button.max.style;
                    ctx.fillRect(xx - sizes.buttons.max, y + sizes.border + sizes.buttons.border, sizes.buttons.max, sizes.title - sizes.buttons.border * 2);
                }
                const img = getAsset(buttonsConfig.max.name)?.src;
                if (img)
                    ctx.drawImage(img, xx - sizes.buttons.max, y + sizes.border + sizes.buttons.border, sizes.buttons.max, sizes.title - sizes.buttons.border * 2);
                xx -= sizes.buttons.max + sizes.buttons.padding;
            }
            // Min
            if (buttonsConfig.min.enable) {
                if (backgroundsColor.button.min) {
                    ctx.fillStyle = backgroundsColor.button.min.style;
                    ctx.fillRect(xx - sizes.buttons.min, y + sizes.border + sizes.buttons.border, sizes.buttons.close, sizes.title - sizes.buttons.border * 2);
                }
                const img = getAsset(buttonsConfig.min.name)?.src;
                if (img)
                    ctx.drawImage(img, xx - sizes.buttons.min, y + sizes.border + sizes.buttons.border, sizes.buttons.min, sizes.title - sizes.buttons.border * 2);
            }
        }
        function title() {
            ctx.fillStyle = backgroundsColor.text.style;
            ctx.font = `${sizes.text}px ${tryFont(backgroundsColor.font)}`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillText(fn.title, x + sizes.border + 2, y + sizes.border + sizes.title / 2);
        }
        function content() {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(fn.canvas, x + sizes.border, y + sizes.border + sizes.padding + sizes.title, sx - sizes.border * 2, sy - sizes.border * 2 - sizes.padding - sizes.title);
        }
        backgrounds();
        buttons();
        title();
        content();
    }
    for (const fn of fensters) {
        fn.runRender(0);
        fn.runRender(1);
        if (fensters.indexOf(fn) == 0)
            fn.runRender(2);
        fn.runRender(3);
        renderFenster(fn);
    }
}
function tryFont(name, url, defaultFont = "Roboto") {
    // Roboto ist default weil es als Pflicht Paket beim boot ist sonst startet ist nicht
    const asset = getAsset(name);
    if (asset) {
        return asset.done ? name : defaultFont;
    }
    else {
        if (url)
            new Asset(url, "font", name);
        return defaultFont;
    }
}
//# sourceMappingURL=render.js.map
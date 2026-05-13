async function main(_ctx, Messege, global) {
    return new Promise((res, rej) => {
        const fd = new Messege("Loading Fonts");
        const fonts = [
            { name: "Roboto", path: "./fonts/Roboto-Regular.ttf" },
            { name: "RobotoMono", path: "./fonts/RobotoMono-Regular.ttf" },
        ];
        fd.text = "Loading Fonts (0/" + fonts.length + ")";
        try {
            let done = 0;
            function check() {
                if (++done >= fonts.length) {
                    fd.ok();
                    res();
                }
            }
            async function load(i) {
                const ffd = new Messege(" - " + fonts[i].name + ' "' + fonts[i].path + '"');
                try {
                    let retry = 0;
                    while (true) {
                        try {
                            ffd.type = "start";
                            const res = new FontFace(fonts[i].name, "url(" + fonts[i].path + ")");
                            await res.load();
                            if (!res.loaded)
                                throw new Error();
                            document.fonts.add(res);
                            ffd.ok();
                            fd.text = "Load Fonts (" + (done + 1) + "/" + fonts.length + ")";
                            check();
                            return;
                        }
                        catch (e) {
                            ffd.type = "error";
                            ffd.text = " - " + fonts[i].name + ' "' + fonts[i].path + '" (' + ++retry + ")";
                            if (retry >= 10)
                                throw new Error("To many Faild");
                            await new Promise((res) => setTimeout(res, 5000));
                        }
                    }
                }
                catch (e) {
                    ffd.error(e.message);
                    fd.error();
                    rej(e);
                    throw e;
                }
            }
            for (let i = 0; i < fonts.length; i++) {
                load(i);
            }
        }
        catch (e) {
            fd.error("Font failed");
            throw e;
        }
    });
}
// @ts-ignore
return main;

"use strict";
class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(b) {
        return new Vector2(this.x + b.x, this.y + b.y);
    }
    sub(b) {
        return new Vector2(this.x - b.x, this.y - b.y);
    }
    mul(b) {
        return new Vector2(this.x * b, this.y * b);
    }
    div(b) {
        return new Vector2(this.x / b, this.y / b);
    }
    inBox(position, size) {
        return (this.x >= position.x - size.x / 2 &&
            this.x <= position.x + size.x / 2 &&
            this.y >= position.y - size.y / 2 &&
            this.y <= position.y + size.y / 2);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
}
class Color {
    r;
    g;
    b;
    a;
    constructor(r_string, g, b, a) {
        if (typeof r_string === "string") {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = r_string;
            ctx.fillRect(0, 0, 1, 1);
            const data = ctx.getImageData(0, 0, 1, 1).data;
            this.r = data[0];
            this.g = data[1];
            this.b = data[2];
            this.a = data[3] / 255;
        }
        else {
            this.r = r_string ?? 0;
            this.g = g ?? 0;
            this.b = b ?? 0;
            this.a = a ?? 1;
        }
    }
    clamp() {
        this.r = Math.min(255, Math.max(0, this.r));
        this.g = Math.min(255, Math.max(0, this.g));
        this.b = Math.min(255, Math.max(0, this.b));
        this.a = Math.min(1, Math.max(0, this.a));
    }
    get style() {
        this.clamp();
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
    durchschnit(b, stärke) {
        this.clamp();
        return new Color((this.r + b.r * stärke) / (1 + stärke), (this.g + b.g * stärke) / (1 + stärke), (this.b + b.b * stärke) / (1 + stärke), (this.a + b.a * stärke) / (1 + stärke));
    }
    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }
}
class linkString {
    text = "";
    constructor(text = "") {
        this.text = text;
    }
    clone() {
        return new linkString(this.text);
    }
}
//# sourceMappingURL=std.js.map
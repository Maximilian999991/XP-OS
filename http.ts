import * as http from "node:http";
import * as fs from "node:fs";
import "path";

http.createServer((req, res) => {
	let url;
	switch (req.url) {
		case "/":
			url = "/index.html";
			break;
		default:
			url = req.url || "/index.html";
			break;
	}
	url = "." + url;

	let MIME = "";
	switch (url.split(".").at(-1)) {
		case "html":
			MIME = "text/html";
			break;

		case "js":
			MIME = "text/javascript";
			break;

		case "png":
			MIME = "image/png";
			break;
		case "ico":
			MIME = "image/x-icon";
			break;

		case "ttf":
			MIME = "font/ttf";
			break;

		case "txt":
			MIME = "text/plain";
			break;
	}

	if (fs.existsSync(url)) {
		res.writeHead(200, {
			"Content-Length": fs.statSync(url).size,
			"Content-Type": MIME,
		});

		const file = fs.createReadStream(url);
		file.addListener("data", (chunk) => res.write(chunk));
		file.addListener("end", () => res.end());
	} else {
		res.writeHead(404);
		res.end();
	}
}).listen(5400);

import express from "express";
import expressWsLib from "express-ws";
import {ICustomWebSocket, IWsData} from "./types";
import {broadcastHandler, connectHandler} from "./wsHandlers";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const wsInstance = expressWsLib(app);
const wsApp = wsInstance.app;
const aWss = wsInstance.getWss();

wsApp.ws("/", (ws, req) => {
	ws.on("message", (msg: string) => {
		const customWs = ws as unknown as ICustomWebSocket;
		const data: IWsData = JSON.parse(msg);
		switch (data.type) {
			case "connect":
				connectHandler(customWs, data, aWss);
				break;
			case "figure":
				broadcastHandler(data, aWss);
				break;
		}
	});
});

(wsApp as express.Application).post("/image", (req: express.Request, res: express.Response) => {
	try {
		const data = req.body.img.replace(`data:image/png;base64,`, "");
		fs.writeFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`), data, "base64");
		return res.status(200).json({message: "Загружено"});
	} catch (e) {
		console.log(e);
		return res.status(500).json({error: "Internal server error"});
	}
});

(wsApp as express.Application).get("/image", (req: express.Request, res: express.Response) => {
	try {
		const file = fs.readFileSync(path.resolve(__dirname, "files", `${req.query.id}.jpg`));
		const data = `data:image/png;base64,` + file.toString("base64");
		res.json(data);
	} catch (e) {
		console.log(e);
		return res.status(500).json("error");
	}
});

wsApp.listen(8080, () => {
	console.log("Server started on port 8080");
});

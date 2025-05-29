import express from "express";
import expressWsLib from "express-ws";
import {ICustomWebSocket, IWsData} from "./types";
import {broadcastHandler, connectHandler} from "./wsHandlers";
const app = express();
const expressWs = expressWsLib(app);
const aWss = expressWs.getWss();

expressWs.app.ws("/", (ws, req) => {
	ws.on("message", (msg: string) => {
		const customWs = ws as unknown as ICustomWebSocket;
		const data: IWsData = JSON.parse(msg);
		switch (data.type) {
			case "connect":
				connectHandler(customWs, data, aWss);
				break;
			case "figure":
				broadcastHandler(customWs, data, aWss);
				break;
		}
	});
});

expressWs.app.listen(8080, () => {
	console.log("Server started");
});

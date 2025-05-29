import {Server} from "ws";
import {ICustomWebSocket, IWsData} from "./types";

export function connectHandler(ws: ICustomWebSocket, data: IWsData, aWss: Server) {
	ws.id = data.id;
	broadcastHandler(ws, data, aWss);
}

export function broadcastHandler(ws: ICustomWebSocket, data: IWsData, aWss: Server) {
	aWss.clients.forEach((client) => {
		const customClient = client as unknown as ICustomWebSocket;
		if (customClient.id === ws.id && customClient !== ws) {
			client.send(JSON.stringify(data));
		}
	});
}

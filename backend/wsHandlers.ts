import {Server} from "ws";
import {ICustomWebSocket, IWsData} from "./types";

export function connectHandler(ws: ICustomWebSocket, data: IWsData, aWss: Server) {
	ws.id = data.id;
	broadcastHandler(data, aWss);
}

export function broadcastHandler(data: IWsData, aWss: Server) {
	aWss.clients.forEach((client) => {
		const customClient = client as unknown as ICustomWebSocket;
		if (customClient.id === data.id) {
			client.send(JSON.stringify(data));
		}
	});
}

export interface IWsData {
	type: "figure" | "connect";
	username?: string;
	figure?: string;
	id: string;
}
export interface ICustomWebSocket extends WebSocket {
	id: string;
}

export interface IWsData {
	type: "figure" | "connect";
	username?: string;
	figure?: figure;
	id: string;
}
export interface ICustomWebSocket extends WebSocket {
	id: string;
}

type figure = {
	type: "brush" | "circle" | "line" | "eraser" | "rect" | "finish";
	x: number;
	y: number;
	w?: number;
	h?: number;
	startX?: number;
	startY?: number;
	radius?: number;
	color: string | CanvasGradient | CanvasPattern;
	fillColor: string | CanvasGradient | CanvasPattern;
	lineWidth: number;
};

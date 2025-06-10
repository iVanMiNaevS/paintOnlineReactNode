export interface IWsData {
	id: string;
	type: "figure" | "connect" | 'undoRedo';
	sessionId: string;
	username?: string;
	figure?: figure;
	state?: string; // Для передачи состояния canvas
	action?: "undo" | "redo"; // Тип действия
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

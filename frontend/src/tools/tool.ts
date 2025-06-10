export default class Tool {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D | null;
	socket: WebSocket | null = null;
	sessionId: string = "";
	constructor(canvas: HTMLCanvasElement, socket: WebSocket, sessionId: string) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.socket = socket;
		this.sessionId = sessionId;
		this.destroyEvents();
	}

	set fillColor(color: string | CanvasGradient | CanvasPattern) {
		if (this.ctx) this.ctx.fillStyle = color;
	}
	set strokeColor(color: string | CanvasGradient | CanvasPattern) {
		if (this.ctx) this.ctx.strokeStyle = color;
	}

	set lineWidth(width: number) {
		if (this.ctx) this.ctx.lineWidth = width;
	}

	destroyEvents() {
		if (this.canvas) {
			this.canvas.onmousemove = null;
			this.canvas.onmousedown = null;
			this.canvas.onmouseup = null;
		}
	}
}

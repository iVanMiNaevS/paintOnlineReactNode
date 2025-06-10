import toolState from "../store/toolState";
import {IEraserFigure, IFigure, IWsData} from "../types";
import Tool from "./tool";

export default class Eraser extends Tool {
	isDraw: boolean = false;
	constructor(canvas: HTMLCanvasElement, socket: WebSocket, sessionId: string) {
		super(canvas, socket, sessionId);
		this.listen();
	}
	listen() {
		if (this.canvas) {
			this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
			this.canvas.onmousedown = this.mouseDownHandler.bind(this);
			this.canvas.onmouseup = this.mouseUpHandler.bind(this);
		}
	}

	mouseUpHandler(e: MouseEvent) {
		this.isDraw = false;
		this.socket?.send(
			JSON.stringify({
				type: "figure",
				id: this.sessionId,
				figure: {
					type: "finish",
				},
			})
		);
	}
	mouseDownHandler(e: MouseEvent) {
		if (this.canvas) {
			this.isDraw = true;

			const rect = this.canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			this.ctx?.beginPath();
			this.ctx?.moveTo(x, y);
		}
	}
	mouseMoveHandler(e: MouseEvent) {
		if (this.isDraw) {
			if (this.canvas && this.ctx) {
				const rect = this.canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const data: IWsData = {
					type: "figure",
					id: this.sessionId,
					figure: {
						type: "eraser",
						x: x,
						y: y,
						color: "white",
						lineWidth: 25,
					},
				};
				this.socket?.send(JSON.stringify(data));
			}
		}
	}
	static draw(ctx: CanvasRenderingContext2D, figure: IEraserFigure) {
		ctx.strokeStyle = figure.color;
		ctx.lineWidth = figure.lineWidth;
		ctx.lineTo(figure.x, figure.y);
		ctx.stroke();
	}
}

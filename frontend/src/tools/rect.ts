import authState from "../store/authState";
import {IRectFigure, IWsData} from "../types";
import Tool from "./tool";

export default class Rect extends Tool {
	isDraw: boolean = false;
	startX: number = 0;
	startY: number = 0;
	w: number = 0;
	h: number = 0;
	saved: string = "";
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
		if (this.ctx) {
			const data: IWsData = {
				type: "figure",
				id: this.sessionId,
				figure: {
					type: "rect",
					x: this.startX,
					y: this.startY,
					w: this.w,
					h: this.h,
					color: this.ctx.strokeStyle,
					fillColor: this.ctx.fillStyle,
					lineWidth: this.ctx.lineWidth,
				},
			};
			authState.socket?.send(JSON.stringify(data));
		}
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
			this.startX = e.clientX - rect.left;
			this.startY = e.clientY - rect.top;
			this.saved = this.canvas.toDataURL();
		}
	}
	mouseMoveHandler(e: MouseEvent) {
		if (this.isDraw) {
			if (this.canvas) {
				const rect = this.canvas?.getBoundingClientRect();
				const currentX = e.clientX - rect.left;
				const currentY = e.clientY - rect.top;
				this.w = currentX - this.startX;
				this.h = currentY - this.startY;
				this.draw(this.startX, this.startY, this.w, this.h);
			}
		}
	}
	draw(x: number, y: number, w: number, h: number) {
		let img = new Image();

		img.src = this.saved;

		img.onload = () => {
			this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			this.ctx?.beginPath();
			this.ctx?.rect(x, y, w, h);
			this.ctx?.fill();
			this.ctx?.stroke();
		};
	}
	static staticDraw(ctx: CanvasRenderingContext2D, figure: IRectFigure) {
		ctx.strokeStyle = figure.color;
		ctx.lineWidth = figure.lineWidth;
		ctx.fillStyle = figure.fillColor;
		ctx.beginPath();
		ctx.rect(figure.x, figure.y, figure.w, figure.h);
		ctx.fill();
		ctx.stroke();
	}
}

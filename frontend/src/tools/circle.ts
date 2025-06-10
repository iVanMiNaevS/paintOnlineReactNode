import authState from "../store/authState";
import {ICircleFigure, IWsData} from "../types";
import Tool from "./tool";

export default class Circle extends Tool {
	isDraw: boolean = false;
	startX: number = 0;
	startY: number = 0;
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
		const rect = this.canvas?.getBoundingClientRect();
		const currentX = e.clientX - rect.left;
		const radius = currentX - this.startX;
		if (this.ctx) {
			const data: IWsData = {
				type: "figure",
				id: this.sessionId,
				figure: {
					type: "circle",
					x: this.startX,
					y: this.startY,
					radius: Math.abs(radius),
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
				const radius = currentX - this.startX;
				this.draw(this.startX, this.startY, Math.abs(radius));
			}
		}
	}
	draw(x: number, y: number, radius: number) {
		let img = new Image();

		img.src = this.saved;

		img.onload = () => {
			this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			this.ctx?.beginPath();
			this.ctx?.arc(x, y, radius, 0, 2 * Math.PI);
			this.ctx?.fill();
			this.ctx?.stroke();
		};
	}
	static staticDraw(ctx: CanvasRenderingContext2D, figure: ICircleFigure) {
		ctx.fillStyle = figure.fillColor;
		ctx.strokeStyle = figure.color;
		ctx.lineWidth = figure.lineWidth;
		if (figure.radius) {
			ctx.beginPath();
			ctx.arc(figure.x, figure.y, figure.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		} else {
			console.log("radius is empty");
		}
	}
}

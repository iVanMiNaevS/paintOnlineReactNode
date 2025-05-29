import Tool from "./tool";

export default class Eraser extends Tool {
	isDraw: boolean = false;
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
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
			if (this.canvas) {
				const rect = this.canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				this.draw(x, y);
			}
		}
	}
	draw(x: number, y: number) {
		this.ctx?.lineTo(x, y);
		this.ctx?.stroke();
	}
}

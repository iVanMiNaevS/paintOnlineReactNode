import Tool from "./tool";

export default class Line extends Tool {
	isDraw: boolean = false;
	startX: number = 0;
	startY: number = 0;
	saved: string = "";
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
				this.draw(currentX, currentY);
			}
		}
	}
	draw(x: number, y: number) {
		let img = new Image();

		img.src = this.saved;

		img.onload = () => {
			this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			this.ctx?.beginPath();
			this.ctx?.moveTo(this.startX, this.startY);
			this.ctx?.lineTo(x, y);
			this.ctx?.fill();
			this.ctx?.stroke();
		};
	}
}

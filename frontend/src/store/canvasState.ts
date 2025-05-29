import {makeAutoObservable} from "mobx";

class CanvasState {
	canvas: HTMLCanvasElement | null = null;
	undoList: string[] = [];
	redoList: string[] = [];
	constructor() {
		makeAutoObservable(this);
	}

	pushToUndo(data: string) {
		this.undoList.push(data);
	}
	pushToRedo(data: string) {
		this.redoList.push(data);
	}

	setCanvas(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	undo() {
		let ctx = this.canvas?.getContext("2d");
		if (this.undoList.length > 0) {
			let dataUrl = this.undoList.pop();
			let img = new Image();

			if (this.canvas) this.pushToRedo(this.canvas?.toDataURL());

			if (dataUrl) img.src = dataUrl;
			img.onload = () => {
				if (this.canvas) {
					ctx?.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
					ctx?.drawImage(img, 0, 0, this.canvas?.width, this.canvas?.height);
				}
			};
		}
	}
	redo() {
		let ctx = this.canvas?.getContext("2d");
		if (this.redoList.length > 0) {
			let dataUrl = this.redoList.pop();
			let img = new Image();

			if (this.canvas) this.pushToUndo(this.canvas?.toDataURL());

			if (dataUrl) img.src = dataUrl;
			img.onload = () => {
				if (this.canvas) {
					ctx?.clearRect(0, 0, this.canvas?.width, this.canvas?.height);
					ctx?.drawImage(img, 0, 0, this.canvas?.width, this.canvas?.height);
				}
			};
		}
	}
}

export default new CanvasState();

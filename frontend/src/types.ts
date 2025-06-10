import Brush from "./tools/brush";
import Circle from "./tools/circle";
import Eraser from "./tools/eraser";
import Line from "./tools/line";
import Rect from "./tools/rect";

export interface IBaseFigure {
	x: number;
	y: number;
	color: string | CanvasGradient | CanvasPattern;
	lineWidth: number;
}

export interface IBrushFigure extends IBaseFigure {
	type: "brush";
}

export interface IRectFigure extends IBaseFigure {
	type: "rect";
	w: number;
	h: number;
	fillColor: string | CanvasGradient | CanvasPattern;
}

export interface ILineFigure extends IBaseFigure {
	type: "line";

	startX: number;
	startY: number;
}

export interface ICircleFigure extends IBaseFigure {
	type: "circle";
	fillColor: string | CanvasGradient | CanvasPattern;
	radius: number;
}

export interface IEraserFigure extends Pick<IBaseFigure, "x" | "y" | "lineWidth" | "color"> {
	type: "eraser";
}

export interface IFinishFigure {
	type: "finish";
}

export type IFigure =
	| IBrushFigure
	| IRectFigure
	| ILineFigure
	| ICircleFigure
	| IEraserFigure
	| IFinishFigure;

export interface IWsData {
	type: "figure" | "connect" | 'undoRedo';
	username?: string;
	figure?: IFigure;
	id: string;
	state?: string; // Для передачи состояния canvas
	action?: "undo" | "redo"; // Тип действия
}


export type typeTool = Brush | Circle | Rect | Eraser | Line;
export type typeToolName = "brush" | "circle" | "line" | "eraser" | "rect";
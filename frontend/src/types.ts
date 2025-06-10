// export interface IWsData {
// 	type: "figure" | "connect";
// 	username?: string;
// 	figure?: figure;
// 	id: string;
// }
// export type figure = {
// 	type: "brush" | "circle" | "line" | "eraser" | "rect" | "finish";
// 	x: number;
// 	y: number;
// 	w?: number;
// 	h?: number;
// 	startX?: number;
// 	startY?: number;
// 	radius?: number;
// 	color: string | CanvasGradient | CanvasPattern;
// 	fillColor: string | CanvasGradient | CanvasPattern;
// 	lineWidth: number;
// };

// Базовый интерфейс для всех фигур
export interface IBaseFigure {
	x: number;
	y: number;
	color: string | CanvasGradient | CanvasPattern;
	lineWidth: number;
}

// Фигура для кисти
export interface IBrushFigure extends IBaseFigure {
	type: "brush";
}

// Фигура для прямоугольника
export interface IRectFigure extends IBaseFigure {
	type: "rect";
	w: number;
	h: number;
	fillColor: string | CanvasGradient | CanvasPattern;
}

// Фигура для линии
export interface ILineFigure extends IBaseFigure {
	type: "line";

	startX: number;
	startY: number;
}

// Фигура для круга
export interface ICircleFigure extends IBaseFigure {
	type: "circle";
	fillColor: string | CanvasGradient | CanvasPattern;
	radius: number;
}

// Фигура для ластика
export interface IEraserFigure extends Pick<IBaseFigure, "x" | "y" | "lineWidth" | "color"> {
	type: "eraser";
}

// Фигура для завершения рисования
export interface IFinishFigure {
	type: "finish";
}

// Объединенный тип для всех фигур
export type IFigure =
	| IBrushFigure
	| IRectFigure
	| ILineFigure
	| ICircleFigure
	| IEraserFigure
	| IFinishFigure;

// Интерфейс для WebSocket данных
export interface IWsData {
	type: "figure" | "connect";
	username?: string;
	figure?: IFigure;
	id: string;
}

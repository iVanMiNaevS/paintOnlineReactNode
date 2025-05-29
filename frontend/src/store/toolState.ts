import {makeAutoObservable} from "mobx";
import Brush from "../tools/brush";
import Circle from "../tools/circle";
import Rect from "../tools/rect";
import Eraser from "../tools/eraser";
import Line from "../tools/line";

type typeTool = Brush | Circle | Rect | Eraser | Line;
type typeToolName = "brush" | "circle" | "line" | "eraser" | "rect";
class ToolState {
	tool: typeTool | null = null;
	toolName: typeToolName | null = null;
	colorState = "black";
	widthState = 1;
	fillState = "";
	constructor() {
		makeAutoObservable(this);
	}

	setTool(tool: typeTool, toolName: typeToolName) {
		this.tool = tool;
		if (toolName === "eraser") {
			this.tool.strokeColor = "white";
			this.tool.lineWidth = 25;
		} else {
			this.tool.strokeColor = this.colorState;
			this.tool.lineWidth = this.widthState;
		}
		this.toolName = toolName;
	}

	setFillColor(color: string) {
		this.fillState = color;
		if (this.tool) {
			this.tool.fillColor = color;
		}
	}
	setStrokeColor(color: string) {
		this.colorState = color;
		if (this.tool) {
			this.tool.strokeColor = color;
		}
	}
	setLineWidth(width: number) {
		this.widthState = width;
		if (this.tool) {
			this.tool.lineWidth = width;
		}
	}
}

export default new ToolState();

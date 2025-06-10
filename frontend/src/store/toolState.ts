import {makeAutoObservable} from "mobx";

import { typeTool, typeToolName } from "../types";


class ToolState {
	tool: typeTool | null = null;
	toolName: typeToolName | null = null;
	colorState:string | CanvasGradient | CanvasPattern = "black";
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
	setStrokeColor(color: string | CanvasGradient | CanvasPattern) {
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

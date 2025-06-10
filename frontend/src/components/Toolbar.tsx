import React, { useEffect, useState } from "react";
import toolState from "../store/toolState";
import { observer } from "mobx-react-lite";
import Brush from "../tools/brush";
import canvasState from "../store/canvasState";
import Circle from "../tools/circle";
import Rect from "../tools/rect";
import Eraser from "../tools/eraser";
import Line from "../tools/line";
import authState from "../store/authState";
import { typeTool, typeToolName } from "../types";
import brushIcon from "../img/pngwing.com.png";
import eraserIcon from "../img/pngwing.com (1).png";
export type typeToolConstructor = new (
	canvas: HTMLCanvasElement,
	socket: WebSocket,
	sessionId: string
) => Brush | Circle | Rect | Eraser | Line;

export const Toolbar = observer(() => {
	const activeTool = toolState.toolName;
	const [tools, setTools] = useState<
		{
			name: typeToolName;
			class: typeToolConstructor;
			imgSrc: string | null;
		}[]
	>([
		{
			name: "brush",
			class: Brush,
			imgSrc: brushIcon,
		},
		{ name: "circle", class: Circle, imgSrc: null },
		{ name: "rect", class: Rect, imgSrc: null },
		{ name: "eraser", class: Eraser, imgSrc: eraserIcon },
		{ name: "line", class: Line, imgSrc: null },
	]);
	function download() {
		if (canvasState.canvas) {
			const dataUrl = canvasState.canvas.toDataURL();
			const a = document.createElement("a");

			a.href = dataUrl;
			a.download = authState.sessionId + ".png";

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}

	return (
		<nav className="navbar bg-primary p-3 px-5 column-gap-3 align-items-stretch">
			<div className="navbar-brand d-flex column-gap-2 align-items-center text-white">
				<img
					src={require("../img/pngwing.com (5).png")}
					alt="Logo"
					width="40"
					className="d-inline-block align-text-top"
				/>
				PAINT
			</div>
			{tools.map((tool) => {
				return (
					<button
						onClick={() => {
							if (canvasState.canvas) {
								console.log("c");
								if (authState.socket && authState.sessionId) {
									toolState.setTool(
										new tool.class(
											canvasState.canvas,
											authState.socket,
											authState.sessionId
										),
										tool.name
									);
								}
							}
						}}
						className={`btn btn-light ${
							activeTool === tool.name && "my-active"
						}`}
					>
						{tool.imgSrc !== null ? (
							<img src={tool.imgSrc} alt="" width={40} />
						) : (
							<div className={tool.name}></div>
						)}
					</button>
				);
			})}

			<button className="btn btn-light color">
				<input
					type="color"
					onChange={(e) => {
						toolState.setFillColor(e.target.value);
					}}
				/>
			</button>
			<button
				className="btn btn-light ms-auto"
				onClick={() => {
					canvasState.undo();
				}}
			>
				<img src={require("../img/pngwing.com (2).png")} alt="" width={40} />
			</button>
			<button
				className="btn btn-light"
				onClick={() => {
					canvasState.redo();
				}}
			>
				<img src={require("../img/pngwing.com (3).png")} alt="" width={40} />
			</button>
			<button className="btn btn-light" onClick={download}>
				<img src={require("../img/pngwing.com (4).png")} alt="" width={40} />
			</button>
		</nav>
	);
});

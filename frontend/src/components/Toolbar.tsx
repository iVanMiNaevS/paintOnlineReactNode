import React, {useEffect, useState} from "react";
import toolState from "../store/toolState";
import {observer} from "mobx-react-lite";
import Brush from "../tools/brush";
import canvasState from "../store/canvasState";
import Circle from "../tools/circle";
import Rect from "../tools/rect";
import Eraser from "../tools/eraser";
import Line from "../tools/line";

export const Toolbar = observer(() => {
	const activeTool = toolState.toolName;

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
			<button
				onClick={() => {
					if (canvasState.canvas) {
						toolState.setTool(new Brush(canvasState.canvas), "brush");
					}
				}}
				className={`btn btn-light ${activeTool === "brush" && "my-active"}`}
			>
				<img src={require("../img/pngwing.com.png")} alt="" width={40} />
			</button>
			<button
				onClick={() => {
					if (canvasState.canvas) {
						toolState.setTool(new Circle(canvasState.canvas), "circle");
					}
				}}
				className={`btn btn-light ${activeTool === "circle" && "my-active"}`}
			>
				<div className="circle"></div>
			</button>
			<button
				onClick={() => {
					if (canvasState.canvas) {
						toolState.setTool(new Rect(canvasState.canvas), "rect");
					}
				}}
				className={`btn btn-light ${activeTool === "rect" && "my-active"}`}
			>
				<div className="rectangle"></div>
			</button>
			<button
				onClick={() => {
					if (canvasState.canvas) {
						toolState.setTool(new Eraser(canvasState.canvas), "eraser");
					}
				}}
				className={`btn btn-light ${activeTool === "eraser" && "my-active"}`}
			>
				<img src={require("../img/pngwing.com (1).png")} alt="" width={40} />
			</button>
			<button
				onClick={() => {
					if (canvasState.canvas) {
						toolState.setTool(new Line(canvasState.canvas), "line");
					}
				}}
				className={`btn btn-light ${activeTool === "line" && "my-active"}`}
			>
				<div className="line"></div>
			</button>
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
			<button className="btn btn-light">
				<img src={require("../img/pngwing.com (4).png")} alt="" width={40} />
			</button>
		</nav>
	);
});

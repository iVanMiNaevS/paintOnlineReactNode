import React, {useEffect, useRef, useState} from "react";
import canvasState from "../store/canvasState";
import {observer} from "mobx-react-lite";
import toolState from "../store/toolState";
import Brush from "../tools/brush";
import {IWsData} from "../types";
import {useParams} from "react-router-dom";
import authState from "../store/authState";
import "bootstrap/dist/css/bootstrap.min.css";

export const Canvas = observer(() => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const params = useParams();
	const [alertMessage, setAlertMessage] = useState<string | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvasState.setCanvas(canvas);
		toolState.setTool(new Brush(canvas), "brush");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		const ws = new WebSocket("http://localhost:8080/");

		ws.onopen = () => {
			console.log("connect");
			if (!params.id) return;
			if (!authState.username) return;
			const data: IWsData = {
				type: "connect",
				id: params.id,
				username: authState.username,
			};
			ws.send(JSON.stringify(data));
		};

		ws.onmessage = (e) => {
			const data: IWsData = JSON.parse(e.data);
			switch (data.type) {
				case "connect":
					setAlertMessage(`${data.username} присоединился к комнате`);
					setTimeout(() => setAlertMessage(null), 3000);
					break;

				case "figure":
					break;
			}
		};

		return () => {
			ws.close();
		};
	}, [params.id]);

	return (
		<div className="canvasWrapp position-relative">
			{alertMessage && (
				<div className="alert alert-info position-absolute top-0 start-50 translate-middle-x mt-3">
					{alertMessage}
				</div>
			)}
			<canvas
				ref={canvasRef}
				onMouseDown={() => {
					if (canvasRef.current) canvasState.pushToUndo(canvasRef.current?.toDataURL());
				}}
				width={800}
				height={700}
			/>
		</div>
	);
});

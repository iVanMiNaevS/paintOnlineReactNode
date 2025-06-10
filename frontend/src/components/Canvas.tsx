import React, { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import { observer } from "mobx-react-lite";
import toolState from "../store/toolState";
import Brush from "../tools/brush";
import { IFigure, IWsData } from "../types";
import { useParams } from "react-router-dom";
import authState from "../store/authState";
import "bootstrap/dist/css/bootstrap.min.css";
import Rect from "../tools/rect";
import axios from "axios";
import Eraser from "../tools/eraser";
import Line from "../tools/line";
import Circle from "../tools/circle";

export const Canvas = observer(() => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const params = useParams();
	const [alertMessage, setAlertMessage] = useState<string | null>(null);

	useEffect(() => {
		// создание канваса
		const canvas = canvasRef.current;

		if (!canvas) return;
		canvasState.setCanvas(canvas);

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		// получение изображения на канвасе
		axios
			.get(`http://localhost:8080/image?id=${params.id}`)
			.then((response) => {
				const img = new Image();
				img.src = response.data;
				img.onload = () => {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				};
			})
			.catch((err) => console.log(err));

		// работа с веб сокетом
		const ws = new WebSocket("http://localhost:8080/");

		// распределения по глобальным состояниям
		if (!params.id) return;
		authState.setSessionId(params.id);
		authState.setSocket(ws);

		// создание инструмента
		toolState.setTool(new Brush(canvas, ws, params.id), "brush");

		ws.onopen = () => {
			console.log("connect");
			if (!params.id) return;
			const name: string = localStorage.getItem("name") || "";
			if (!authState.username && name === "") {
				alert(
					"Нет имени пользователя, перезайдите в комнату или создайте новую"
				);
			} else {
				const data: IWsData = {
					type: "connect",
					id: params.id,
					username: authState.username ? authState.username : name,
				};
				ws.send(JSON.stringify(data));
			}
		};

		ws.onmessage = (e) => {
			const data: IWsData = JSON.parse(e.data);
			switch (data.type) {
				case "connect":
					setAlertMessage(`${data.username} присоединился к комнате`);
					setTimeout(() => setAlertMessage(null), 3000);
					break;

				case "figure":
					if (data.figure) drawHandler(ctx, data.figure);
					break;
				case "undoRedo":
					if (data.state && !canvasState.isSyncing) {
						canvasState.isSyncing = true; // Блокируем локальные изменения

						const img = new Image();
						img.onload = () => {
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							ctx.drawImage(img, 0, 0);

							// Обновляем историю, избегая дубликатов
							if (data.action === "undo") {
								// Удаляем состояние из undo стека, если оно там есть
								canvasState.undoList = canvasState.undoList.filter(
									(s) => s !== data.state
								);
								// Добавляем в redo стек (текущее состояние уже сохранено отправителем)
								if (data.state) canvasState.pushToRedo(data.state);
							} else {
								// Удаляем состояние из redo стека
								canvasState.redoList = canvasState.redoList.filter(
									(s) => s !== data.state
								);
								// Возвращаем в undo стек
								if (data.state) canvasState.pushToUndo(data.state);
							}

							canvasState.isSyncing = false; // Разблокируем
						};
						img.onerror = () => {
							console.error("Error loading undo/redo image");
							canvasState.isSyncing = false;
						};
						img.src = data.state;
					}
					break;
			}
		};

		return () => {
			ws.close();
		};
	}, [params.id]);

	function drawHandler(ctx: CanvasRenderingContext2D, figure: IFigure) {
		switch (figure.type) {
			case "brush":
				Brush.draw(ctx, figure);
				break;
			case "eraser":
				Eraser.draw(ctx, figure);
				break;
			case "rect":
				Rect.staticDraw(ctx, figure);
				break;
			case "line":
				Line.staticDraw(ctx, figure);
				break;
			case "circle":
				Circle.staticDraw(ctx, figure);
				break;
			case "finish":
				ctx.beginPath();
				break;
		}
	}

	return (
		<div className="canvasWrapp position-relative">
			{alertMessage && (
				<div className="alert alert-info position-absolute top-0 start-50 translate-middle-x mt-3">
					{alertMessage}
				</div>
			)}
			<canvas
				ref={canvasRef}
				onMouseUp={() => {
					if (canvasRef.current) {
						axios
							.post(`http://localhost:8080/image?id=${params.id}`, {
								img: canvasRef.current.toDataURL(),
							})
							.then((response) => console.log(response.data));
					}
				}}
				onMouseDown={() => {
					if (canvasRef.current) {
						canvasState.pushToUndo(canvasRef.current?.toDataURL());
					}
				}}
				width={800}
				height={700}
			/>
		</div>
	);
});

import React from "react";
import toolState from "../store/toolState";

export const Settings = () => {
	return (
		<nav className="navbar bg-primary p-3 px-5 column-gap-3">
			<div className="nav-item text-light">
				<div className="input-group input-group-sm">
					<span className="input-group-text" id="inputGroup-sizing-sm">
						Толщина линии
					</span>
					<input
						onChange={(e) => {
							toolState.setLineWidth(Number(e.target.value));
						}}
						type="number"
						min={1}
						defaultValue={1}
						className="form-control"
						aria-label="Пример размера поля ввода"
						aria-describedby="inputGroup-sizing-sm"
					/>
				</div>
			</div>
			<div className="nav-item text-light">
				<div className="input-group input-group-sm">
					<span className="input-group-text" id="inputGroup-sizing-sm">
						Цвет обводки
					</span>
					<input
						onChange={(e) => {
							toolState.setStrokeColor(e.target.value);
						}}
						type="color"
						className="form-control"
						style={{width: "100px", height: "31px"}}
						aria-label="Пример размера поля ввода"
						aria-describedby="inputGroup-sizing-sm"
					/>
				</div>
			</div>
		</nav>
	);
};

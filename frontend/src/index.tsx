import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Toolbar} from "./components/Toolbar";
import {Settings} from "./components/Settings";
import {Canvas} from "./components/Canvas";
import {Home} from "./components/Home";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<BrowserRouter>
		<div className="app">
			<Routes>
				<Route
					path="/"
					index
					element={
						<>
							<Home />
						</>
					}
				/>
				<Route
					path="/:id"
					element={
						<>
							<Toolbar />
							<Settings />
							<Canvas />
						</>
					}
				/>
				<Route path="*" element={<Navigate to={`/f${(+new Date()).toString(16)}`} replace />} />
			</Routes>
		</div>
	</BrowserRouter>
);

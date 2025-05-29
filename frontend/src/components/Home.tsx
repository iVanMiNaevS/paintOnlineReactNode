import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from "react-router-dom";
import authState from "../store/authState";

export const Home: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [roomId, setRoomId] = useState<string>("");
	const [isJoinMode, setIsJoinMode] = useState<boolean>(false);
	const navigate = useNavigate();
	const handleCreateRoom = () => {
		if (!username.trim()) {
			alert("Введите имя пользователя!");
			return;
		}
		const roomId = `f${(+new Date()).toString(16)}`;
		authState.setUsername(username);
		authState.setSessionId(roomId);
		navigate(`/${roomId}`);
	};

	const handleJoinRoom = () => {
		if (!username.trim() || !roomId.trim()) {
			alert("Заполните все поля!");
			return;
		}
		authState.setUsername(username);
		authState.setSessionId(roomId);
		navigate(`/${roomId}`);
	};

	const toggleMode = () => {
		setIsJoinMode(!isJoinMode);
		setRoomId("");
	};

	return (
		<div className="container d-flex justify-content-center align-items-center min-vh-100">
			<div className="card shadow-sm w-100" style={{maxWidth: "400px"}}>
				<div className="card-body p-4">
					<h5 className="card-title text-center mb-4 text-primary">
						{isJoinMode ? "Вход в комнату" : "Создание комнаты"}
					</h5>
					<form>
						<div className="mb-3">
							<label className="form-label">Ваше имя</label>
							<input
								type="text"
								className="form-control border-primary"
								placeholder="Введите имя"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						{isJoinMode && (
							<div className="mb-4">
								<label className="form-label">ID комнаты</label>
								<input
									type="text"
									className="form-control border-primary"
									placeholder="Введите ID комнаты"
									value={roomId}
									onChange={(e) => setRoomId(e.target.value)}
								/>
							</div>
						)}

						<div className="d-grid gap-3 mb-3">
							<button
								type="button"
								className="btn btn-primary py-2"
								onClick={isJoinMode ? handleJoinRoom : handleCreateRoom}
							>
								{isJoinMode ? "Присоединиться" : "Создать комнату"}
							</button>
						</div>

						<div className="text-center">
							<button type="button" className="btn btn-link text-primary" onClick={toggleMode}>
								{isJoinMode ? "Создать новую комнату" : "Присоединиться к комнате"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

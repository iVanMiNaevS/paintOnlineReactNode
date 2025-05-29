import {makeAutoObservable} from "mobx";

class AuthState {
	username = "";
	sessionId: string | null = null;
	socket: WebSocket | null = null;
	constructor() {
		makeAutoObservable(this);
	}

	setUsername(username: string) {
		this.username = username;
	}

	setSessionId(sessionId: string) {
		this.sessionId = sessionId;
	}

	setSocket(socket: WebSocket) {
		this.socket = socket;
	}
}
export default new AuthState();

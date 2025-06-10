import { makeAutoObservable } from "mobx";

class CanvasState {
    canvas: HTMLCanvasElement | null = null;
    undoList: string[] = [];
    redoList: string[] = [];
    isSyncing = false; // Флаг для предотвращения рекурсии
    private undoTimeout: NodeJS.Timeout | null = null;
    private readonly MAX_HISTORY = 50;

    constructor() {
        makeAutoObservable(this);
    }

    // Добавляем состояние в стек undo с ограничением истории
    pushToUndo(data: string) {
        if (this.undoList.length >= this.MAX_HISTORY) {
            this.undoList.shift();
        }
        this.undoList.push(data);
    }

    pushToRedo(data: string) {
        this.redoList.push(data);
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    // Основной метод для синхронизированного undo
    syncUndo(socket: WebSocket, sessionId: string) {
        if (this.isSyncing) return;
        
        if (this.undoTimeout) clearTimeout(this.undoTimeout);
        
        this.undoTimeout = setTimeout(() => {
            if (this.undoList.length > 0 && this.canvas) {
                this.isSyncing = true;
                const state = this.undoList.pop();
                
                if (state) {
                    // 1. Сохраняем ТЕКУЩЕЕ состояние в redo стек
                    const currentState = this.canvas.toDataURL();
                    this.pushToRedo(currentState);
                    
                    // 2. Отправляем состояние для отмены на сервер
                    socket.send(JSON.stringify({
                        type: "undoRedo",
                        sessionId,
                        state,
                        action: "undo"
                    }));
                    
                    // 3. Применяем состояние локально
                    this.applyState(state);
                }
                this.isSyncing = false;
            }
        }, 100);
    }

    // Основной метод для синхронизированного redo
    syncRedo(socket: WebSocket, sessionId: string) {
        if (this.isSyncing) return;
        
        if (this.redoList.length > 0 && this.canvas) {
            this.isSyncing = true;
            const state = this.redoList.pop();
            
            if (state) {
                // 1. Сохраняем ТЕКУЩЕЕ состояние в undo стек
                const currentState = this.canvas.toDataURL();
                this.pushToUndo(currentState);
                
                // 2. Отправляем состояние для повтора на сервер
                socket.send(JSON.stringify({
                    type: "undoRedo",
                    sessionId,
                    state,
                    action: "redo"
                }));
                
                // 3. Применяем состояние локально
                this.applyState(state);
            }
            this.isSyncing = false;
        }
    }

    // Общий метод для применения состояния
    private applyState(state: string) {
        const ctx = this.canvas?.getContext('2d');
        if (!ctx || !this.canvas) return;

        const img = new Image();
        img.onload = () => {
					if(this.canvas)
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = state;
    }

    // Очистка при размонтировании
    destroy() {
        if (this.undoTimeout) clearTimeout(this.undoTimeout);
    }
}

export default new CanvasState();
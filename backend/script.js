
const button = document.querySelector('button')

const socket = new WebSocket('ws://localhost:3000');

button.addEventListener('click', async (e) => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'connect',
            msg: 'connect',
            id: "dfdf"
        }));
    } else {
        console.error('WebSocket не подключён!');
    }
})

socket.addEventListener('open', () => {
    console.log('WebSocket подключён');
});


socket.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    console.log('Ответ сервера:', msg.msg);
});


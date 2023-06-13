const socket = io();
socket.emit('message', 'Hola, me estoy comunicando a traves de websockets')
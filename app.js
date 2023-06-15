import express from 'express';
import __dirname from './utils.js';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';

const app = express();

 // Inicio del servidor
 const PORT = 8080;
 const httpServer = http.createServer(app);
 httpServer.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
  console.log(path.join(__dirname, 'views'));
  console.log(path.join(__dirname, 'public'));
});
const socketServer = new Server(httpServer);


// Configuración de Handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// Configuración del directorio de vistas
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', viewsRouter);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Configuración del servidor de archivos estáticos









// Configuración de las rutas y lógica del servidor

// Configuración del servidor de WebSockets
socketServer.on('connection', socket => {
  console.log('Un nuevo cliente se ha conectado.');


  socket.on('message',data=>{
    console.log(data);
  })

// Evento que se dispara cuando se recibe un mensaje del cliente.

 socket.broadcast.emit('user_connected', `User ${socket.id} has connected.`);

 // Emite un mensaje a todos los clientes excepto al que se acaba de conectar.

 socket.emit('individual', 'Bienvenido!');

 // Envía un mensaje individual al cliente que se acaba de conectar.

// // Evento para manejar la desconexión de un cliente
// socketServer.on('disconnect', () => {
//   console.log('Un cliente se ha desconectado.');
// });
});

import express from 'express';
import __dirname from './utils.js'
// import productsRouter from './routes/products.router.js';
// import cartsRouter from './routes/carts.router.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js'

const app = express();
const http = createServer(app);
const io = new Server(http);
const hbs = handlebars.create();


// Configuración de las rutas y lógica del servidor

// Configuración del servidor de WebSockets
io.on('connection', (socket) => {
  console.log('Un nuevo cliente se ha conectado.');



// Evento para manejar la desconexión de un cliente
socket.on('disconnect', () => {
  console.log('Un cliente se ha desconectado.');
});
});

// Configuración de Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use('/', viewsRouter);
app.use(express.json());


// Configuración del directorio de vistas
app.set('views', path.join(__dirname, 'views'));
// Configuración del servidor de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// // Rutas para el manejo de productos
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);


 // Inicio del servidor
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => console.log(`Listening on ${PORT} 8080`));
const socketServer = new Server(httpServer)

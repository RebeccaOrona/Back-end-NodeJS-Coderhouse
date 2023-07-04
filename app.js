import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import __dirname from './utils.js';
import { addProduct, deleteProduct } from './managers/ProductManager.js';



const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Configurar el motor de plantillas Handlebars
app.engine(
  'handlebars',
  handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el servidor de Socket.io
io.on('connection', socket => {
  console.log('New client connected');

  // Escuchar el evento 'newProduct' enviado por el cliente y emitir 'productCreated' a todos los clientes
  socket.on('newProductData', async (newProductData) => {
    // Lógica para agregar el nuevo producto a la lista
    const createdProduct = addProduct(newProductData);
    
    // Verificar si se pudo agregar el producto correctamente
    if (createdProduct) {
      // Emitir el evento 'productCreated' a todos los clientes con el nuevo producto
      io.emit('productCreated', await createdProduct);
    }
  });
  
  // Escuchar el evento 'productDeleted' enviado por el cliente y emitir 'productDeleted' a todos los clientes
  socket.on('deleteProduct', (productId) => {
    // Lógica para eliminar el producto de la lista
    const deletedProduct = deleteProduct(productId);
  
  
    // Verificar si se pudo eliminar el producto correctamente
    if (deletedProduct) {
      // Emitir el evento 'productDeleted' a todos los clientes con el ID del producto eliminado
      io.emit('productDeleted', productId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Configurar el router para /api/products
app.use('/api/products', productsRouter);

// Configurar el router para /api/carts
app.use('/api/carts', cartsRouter);

// Configurar el router para /api/views
app.use('/api/views', viewsRouter);


// Iniciar el servidor
httpServer.listen(8080, () => {
  console.log('Server is running on port 8080');
});

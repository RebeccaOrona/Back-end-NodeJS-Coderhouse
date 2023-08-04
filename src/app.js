import express from 'express';
import session from 'express-session';
import http from 'http';
import axios from 'axios';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import sessionsRouter from './routes/sessions.router.js';


const mongoUrl = 'mongodb+srv://becca:123@coderhousebackend.gbvr1iq.mongodb.net/?retryWrites=true&w=majority';
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const connection = mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
app.use(session({
    store: new MongoStore({
        mongoUrl: mongoUrl,
        ttl: 3600
    }),
    secret: "CoderSecretSHHHHH",
    resave: false,
    saveUninitialized: false
}))

app.engine(
    'handlebars',
    handlebars.engine({
      defaultLayout: 'main',
      layoutsDir: path.join(__dirname, 'views/layouts'),
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
      },
    })
  );
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Configurar el servidor de Socket.io
io.on('connection', socket => {
    socket.emit('newClientConnected')
    
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
  
    socket.on('cartCreated', (cartId) => {
      console.log(cartId);
      socket.emit('cartCreated', cartId);
    })
  
      socket.on('addToCart', async (data) => {
        try {
          console.log(data);
          const cartId = data.cartId; // Obtén el ID del carrito del usuario actual
          console.log(cartId);
          const productId = data.productId;
          console.log(productId);
          // Make a POST request to add the product to the cart
          await api.post(`/api/carts/${cartId}/product/${productId}`);
          
          // Emit the 'productAddedToCart' event to all clients
          io.emit('productAddedToCart', productId);
        } catch (error) {
          // Handle the error if the request fails
          console.error('Failed to add product to cart:', error);
        }
      });
    
    
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

// Configurar el router para views
app.use('/', viewsRouter);
// Configurar el router para /api/products
app.use('/api/products', productsRouter);

// Configurar el router para /api/carts
app.use('/api/carts', cartsRouter);

// Configurar el router para /api/sessions
app.use('/api/sessions', sessionsRouter);

httpServer.listen(8080, () => {
    console.log('Server is running on port 8080');
  });
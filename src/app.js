import express from 'express';
import session from 'express-session';
import http from 'http';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import env from './config-middlewares/enviroment.js';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import initializePassport from './config-middlewares/passport.config.js';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import userRouter from './routes/users.router.js';
import chatRouter from './routes/chat.router.js'; 
import { getMockingProducts } from './controllers/products.controller.js';
import errorHandler from './config-middlewares/error.index.js';


const sessionSecret = env.sessionSecret;
const mongoUrl = env.mongoUrl;
const app = express();
app.get('/mockingproducts', getMockingProducts);
const PORT = env.port;
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const connection = mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json());
app.use(errorHandler)
app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}
  ));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


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
app.use(cookieParser());
initializePassport();

app.use(passport.initialize());
app.use(session({
  store: new MongoStore({
      mongoUrl: mongoUrl,
      mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
      ttl: 3600
  }),
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.session());




// Configurar el servidor de Socket.io
io.on('connection', async socket => {
    socket.emit('newClientConnected')
    
    console.log('New client connected');
  
    socket.on('cartCreated', (cartId) => {
      console.log(cartId);
      socket.emit('cartCreated', cartId);
    })
  
      socket.on('addToCart', async (data) => {
        try {
          console.log(data);
          const productId = data.productId;
          
          // Emit the 'productAddedToCart' event to all clients
          io.emit('productAddedToCart', productId);
        } catch (error) {
          // Handle the error if the request fails
          console.error('Failed to add product to cart:', error);
        }
      });
    
      socket.on('userData', (userData) => {
        console.log(userData);
      });

      socket.on('chat message', (message) => {
        io.emit('chat message', message);
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

// Configurar el router para /api/users
app.use('/api/users', userRouter);

app.use('/api/chat', chatRouter);

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  
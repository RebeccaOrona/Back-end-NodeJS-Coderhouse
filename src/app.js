import express from 'express';
import session from 'express-session';
import http, { request } from 'http';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import env from './config-middlewares/environment.js';
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
import errorHandler from './config-middlewares/error.index.js';
import { addLogger, serverLogger } from './config-middlewares/logger.js';


const sessionSecret = process.env.SESSION_SECRET;
const mongoUrl = process.env.MONGO_URL;
const app = express();
const PORT = process.env.PORT || 8080;
app.use(addLogger);
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const connection = mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json());
// app.use(errorHandler);
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
    serverLogger.info('New client connected');
  
    socket.on('cartCreated', (cartId) => {
      socket.emit('cartCreated', cartId);
    })
  
      socket.on('addToCart', async (data) => {
        try {
          const productId = data.productId;
          
          // Emit the 'productAddedToCart' event to all clients
          io.emit('productAddedToCart', productId);
        } catch (error) {
          // Handle the error if the request fails
          serverLogger.error('Failed to add product to cart:', error);
        }
      });

      socket.on('chat message', (message) => {
        io.emit('chat message', message);
      });
  
    socket.on('disconnect', () => {
      serverLogger.info('Client disconnected');
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

app.get('/loggerTest', (req,res) => {
  req.logger.debug('Debug!')
  req.logger.http('Http!')
  req.logger.info('Info!')
  req.logger.warning('Warning!')
  req.logger.error('Error!')
  req.logger.fatal('Fatal!')
  res.send({ message: 'Prueba de Logger!' });
})


httpServer.listen(PORT, () => {
  serverLogger.info(`Server is running on port ${PORT}`);
});

  
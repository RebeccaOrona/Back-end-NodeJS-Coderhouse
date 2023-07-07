import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io'; //Recuerda que este {Server} es propio de websockets.

const app = express();
const httpServer = app.listen(8080,()=>console.log("Listening on PORT 8080"));

const io = new Server(httpServer); //io sera un servidor para trabajar con sockets, ¿por qué ahora lo llamamos "io*?
//Configuramos todo lo referente a plantillas.
app.engine('handlebars',handlebars.engine());
app.set ('views', __dirname+ '/views');
app.set ('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));//Recuerda que es importante para tener archivos y js y css en plantillas
app.use('/',viewsRouter);

let messages = [] //Los mensajes se almacenaran aqui
io.on('connection',socket=>{
    console.log("Nuevo cliente conectado")

    socket.on('message',data => {
        
        messages.push(data) //Guardamos el objeto en la "base";
        io.emit('messageLogs',messages) //Reenviamos instantáneamente los logs actualizados.
        
    })
    socket.on('requestMessageLogs', () => {
        // Enviar los registros de mensajes existentes al cliente que lo solicitó
        socket.emit('messageLogs', messages);
      });
      socket.on('userAuthenticated', (newUser)=> {
        Swal.fire({
            icon:"info",
            title:"Nuevo usuario conectado",
            text:`Usuario: ${newUser}`,
            toast:true,
            position:"top-right",
            showConfirmButton: false,
            timer: 3000
        })
      })
})
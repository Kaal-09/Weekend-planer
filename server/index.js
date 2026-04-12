import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './src/routes/user.routes.js'
import { connectDB } from './src/utils/utils.js'
import cookieParser from 'cookie-parser'
import { Server } from "socket.io";
import http from 'http'

dotenv.config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser());

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send("Server listening")
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('joinRoom', async (userName) => {
        console.log(`${userName} is joining the room`);
        
        await socket.join('groupROOM')
    });
    
    socket.on("send_message", (data) => {
        console.log("Message:", data);
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    });
});

const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    connectDB()
})
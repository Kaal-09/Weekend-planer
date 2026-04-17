import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './src/routes/user.routes.js'
import { connectDB } from './src/utils/utils.js'
import cookieParser from 'cookie-parser'
import http from 'http'
import { initSocket } from './src/utils/socket.js'

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
app.use('/api/message', userRoutes);

app.get('/', (req, res) => {
    res.send("Server listening")
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    connectDB()
})
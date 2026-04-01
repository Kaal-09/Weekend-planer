import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './src/routes/user.routes.js'
import { connectDB } from './src/utils/utils.js'

dotenv.config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send("Being gay is a mental disorder")
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    connectDB()
})
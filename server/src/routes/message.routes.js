import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { sendMessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.post('/send/:friendId', verifyJWT, sendMessage);
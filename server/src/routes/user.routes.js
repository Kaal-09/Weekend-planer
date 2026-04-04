import express from 'express'
import { createUser, loginUser, logoutUser, refreshAccessToken } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
// another way to add routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);

export default router;
import express from 'express'
import { createUser, getUserByEmail, loginUser, logoutUser, refreshAccessToken, getleanUserByEmail, updateUser } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
// another way to add routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/getuserByEmail/:userEmail').get(getUserByEmail);
router.route('/getleanuserByEmail/:userEmail').get(getleanUserByEmail);
router.patch("/update/:email", updateUser);

export default router;
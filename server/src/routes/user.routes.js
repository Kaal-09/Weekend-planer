import express from 'express'
import { createUser, getUserByEmail, loginUser, logoutUser, refreshAccessToken, getleanUserByEmail, updateUser, getSuggestedUsers, addUserById, getMyFriends } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { getMessages, sendMessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
// another way to add routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/getuserByEmail/:userEmail').get(getUserByEmail);
router.route('/getleanuserByEmail/:userEmail').get(getleanUserByEmail);
router.patch("/update/:email", upload.single('avatar'), updateUser);
router.get("/getSuggestedUsersMatchingPrefix/:query", getSuggestedUsers);
router.post("/addUserById/:query", verifyJWT, addUserById);
router.get("/friends", verifyJWT, getMyFriends);
router.get('/:friendId', verifyJWT, getMessages);
router.post('/send/:friendId', verifyJWT, sendMessage);

export default router;
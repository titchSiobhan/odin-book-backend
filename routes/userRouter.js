import express from 'express'
import jwt from 'jsonwebtoken';
import upload from '../middleware/multer.js';
import * as verify from '../middleware/verify.js';

import * as friendController from '../controllers/friendController.js'
import * as userController from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/user/add-friend/:friendId/', verify.verifyToken, friendController.sendFriendRequest);

userRouter.post('/user/accept/:friendId', verify.verifyToken ,friendController.acceptFriend),

userRouter.post('/user/block/:friendId', verify.verifyToken, friendController.block)

userRouter.post('/user/unblock/:friendId', verify.verifyToken, friendController.unblock)

userRouter.post('/user/delete/:friendId', verify.verifyToken, friendController.deleteFriend);

userRouter.get('/friends', verify.verifyToken, friendController.friendList)

userRouter.get('/search',  friendController.search)

userRouter.put('/user/private', verify.verifyToken, userController.setToPrivate)
userRouter.put('/user/public', verify.verifyToken, userController.setToPublic);

userRouter.get('/user/profile/:userId', verify.optionalVerifyToken, userController.GetUser)

userRouter.get('/user/profile/friend/:userId', verify.verifyToken, friendController.getFriendShip)

userRouter.post('/user/profile/update', verify.verifyToken, upload.single('image'),  userController.uploadProfilePicture)


export default userRouter
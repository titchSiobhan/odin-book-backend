import express from 'express'
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/verify.js';

import * as friendController from '../controllers/friendController.js'

const userRouter = express.Router();


userRouter.post('/user/add-friend/:friendId/', verifyToken, friendController.sendFriendRequest);

userRouter.post('/user/accept/:friendId', verifyToken ,friendController.acceptFriend),

userRouter.post('/user/block/:friendId', verifyToken, friendController.block)

userRouter.post('/user/unblock/:friendId', verifyToken, friendController.unblock)

userRouter.post('/user/delete/:friendId', verifyToken, friendController.deleteFriend)

export default userRouter
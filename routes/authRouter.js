import express from 'express'
import upload from '../middleware/multer.js'
import * as authController from '../controllers/authController.js'
import {verifyToken} from '../middleware/verify.js'

import prisma from '../lib/prisma.js'

const authRouter = express.Router()

authRouter.post('/sign-up',  authController.signUp)

authRouter.post('/login', authController.login)

authRouter.get('/me', verifyToken, authController.me)

export default authRouter
import express from 'express'
import * as authController from '../controllers/authController.js'
import verifyToken from '../middleware/verify.js'
import prisma from '../lib/prisma.js'

const authRouter = express.Router()

authRouter.post('/sign-up', authController.signUp)

authRouter.post('/login', authController.login)

authRouter.get('/me', verifyToken, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        select: {
             id: true,
            userName: true,
            email: true,
            firstName: true,
            isPublic: true,
            sentRequests: true,
            receivedRequests: {include:
                {receiver: {select: {userName: true}},
                requester:  {select: {userName: true}}
            },
        }}
    })
    res.json({user})
})

export default authRouter
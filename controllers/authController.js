import bcrypt from "bcryptjs";
import prisma from '../lib/prisma.js'
import jwt from 'jsonwebtoken'



async function  signUp(req, res) {
    const {userName, email, firstName, password} = req.body;

    const userCheck = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    

    if (userCheck) return res.json({error:'Email already in use'})

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                userName,
                email,
                firstName,
                password: hashedPassword
            }
        })
        return res.json({message: 'userCreated', user})
}

async function login(req, res) {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    }) 

    if (!user) {
        return res.json({message: 'Incorrect email'})
    }


    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.json({error: 'Incorrect password'})

        const token = jwt.sign(
            {
                user: {
                    id: user.id,
                    userName: user.userName
                }, 
            }, process.env.JWT_SECRET, 
            {expiresIn: '2hr'}
        )

        return res.json({user, token})
 }

export {
    signUp, login
}
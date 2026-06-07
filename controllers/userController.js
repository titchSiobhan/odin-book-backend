import prisma from '../lib/prisma.js'

async function setToPrivate(req, res){
    const userId = req.user.id;

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            isPublic: false
        }
    })
    res.json({user})
}

async function setToPublic(req, res) {
    const userId = req.user.id;

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            isPublic: true
        }
    })
    res.json({user})
}

async function GetUser(req, res) {
    const {userId }= req.params;

    const getUser = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            firstName: true,
            userName: true,
            post: true,
            isPublic: true,
            id: true,
            receivedRequests: true,
            sentRequests: true,
            
        }
    })
    res.json({user: getUser})
}

export {
    setToPrivate, setToPublic, GetUser
}
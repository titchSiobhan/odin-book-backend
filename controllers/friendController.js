import prisma from '../lib/prisma.js';

async function sendFriendRequest(req, res) {
	const userId = req.user.id;
	const newFriend = req.params.friendId;

    if (userId === newFriend) return res.json({error: 'you cant friend yourself'})
	const friend = await prisma.friends.create({
		data: {
			requesterId: userId,
			receiverId: newFriend,
		},
	});
	res.json(friend);
}

async function acceptFriend(req, res) {
	const userId = req.user.id;
	const otherId = req.params.friendId;

    const request = await prisma.friends.findFirst({
        where: {
            OR: [
                {requesterId: otherId, receiverId: userId},
                {requesterId: userId, receiverId: otherId}
            ],
            status: 'pending'
        }
    })

    if (!request) {
        return res.status(404).json({message: 'No friend request found'})
    }
	const accept = await prisma.friends.update({
        where: {
            id: request.id
        },
        data: {
            status: 'accepted'
        }
    })
	res.json({ accept });
}

async function block(req, res){
    const userId = req.user.id;
    const otherId = req.params.friendId;

    const existing = await prisma.friends.findFirst({ 
       where: {
            OR: [
                {requesterId: otherId, receiverId: userId},
                {requesterId: userId, receiverId: otherId}
            ],
        },
    })

if (existing && (existing.requesterId === otherId && existing.receiverId === userId)){
     await prisma.friends.delete({
        where:{
           id: existing.id
        }
    })
}
    const blocked = await prisma.friends.upsert({
    where: {
            requesterId_receiverId:{
            requesterId: userId, receiverId: otherId
            }
        },
        update: {
            status: 'block'
        },
        create: {
            requesterId: userId,
            receiverId: otherId,
            status: 'blocked'
        }
    })
    res.json({blocked})
 }

 async function unblock(req, res) {
    const userId = req.user.id;
    const otherId = req.params.friendId;

    const unblock = await prisma.friends.delete({
       where: {
            requesterId_receiverId:{
            requesterId: userId, receiverId: otherId
            }
        },
    })
    res.json({message: 'User unblocked'})
 }


 async function deleteFriend(req, res) {
    const userId = req.user.id;
    const otherId = req.params.friendId;

    const existing = await prisma.friends.findFirst({
        where: {
            OR: [
                {requesterId: otherId, receiverId: userId},
                {requesterId: userId, receiverId: otherId}
            ],
        },
    });

    const deleteUser = await prisma.friends.delete({
        where: {
            id: existing.id
        }
    })
    res.json({message: 'user unfriended'})
 }

export { sendFriendRequest, acceptFriend, block, unblock, deleteFriend };

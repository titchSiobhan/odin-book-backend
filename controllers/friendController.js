import prisma from '../lib/prisma.js';

async function sendFriendRequest(req, res) {
	const userId = req.user.id;
	const newFriend = req.params.friendId;

	if (userId === newFriend)
		return res.json({ error: 'you cant friend yourself' });
	const friend = await prisma.friends.create({
		data: {
			requesterId: userId,
			receiverId: newFriend,
		},
	});
	res.json(friend);
}

async function friendList(req, res) {
	const userId = req.user.id;

	const friends = await prisma.friends.findMany({
		where: {
			OR: [{ receiverId: userId }, { requesterId: userId }],
		},
		select: {
			id: true,
			requester: true,
			receiver: true,
			status: true,
			
		},
	});
	res.json(friends);
}
async function search(req, res) {
	const query = req.query.q;

	const users = await prisma.user.findMany({
		where: {
			OR: [
				{ userName: { contains: query, mode: 'insensitive' } },
				{ firstName: { contains: query, mode: 'insensitive' } },
				{
					email: {
						contains: query,
						mode: 'insensitive',
					},
				},
			],
		},
		select: {
			userName: true,
			id: true,
			firstName: true,
			post: true,
		},
		take: 15,
	});
	res.json({ users });
}

async function acceptFriend(req, res) {
	const userId = req.user.id;
	const otherId = req.params.friendId;

	const request = await prisma.friends.findFirst({
		where: {
			OR: [
				{ requesterId: otherId, receiverId: userId },
				{ requesterId: userId, receiverId: otherId },
			],
			status: 'pending',
		},
	});

	if (!request) {
		return res.status(404).json({ message: 'No friend request found' });
	}
	const accept = await prisma.friends.update({
		where: {
			id: request.id,
		},
		data: {
			status: 'accepted',
		},
	});
	res.json({ accept });
}

async function block(req, res) {
	const userId = req.user.id;
	const otherId = req.params.friendId;

	const existing = await prisma.friends.findFirst({
		where: {
			OR: [
				{ requesterId: otherId, receiverId: userId },
				{ requesterId: userId, receiverId: otherId },
			],
		},
	});

	if (
		existing &&
		existing.requesterId === otherId &&
		existing.receiverId === userId
	) {
		await prisma.friends.delete({
			where: {
				id: existing.id,
			},
		});
	}
	const blocked = await prisma.friends.upsert({
		where: {
			requesterId_receiverId: {
				requesterId: userId,
				receiverId: otherId,
			},
		},
		update: {
			status: 'block',
		},
		create: {
			requesterId: userId,
			receiverId: otherId,
			status: 'blocked',
		},
	});
	res.json({ blocked });
}

async function unblock(req, res) {
	const userId = req.user.id;
	const otherId = req.params.friendId;

	const unblock = await prisma.friends.delete({
		where: {
			requesterId_receiverId: {
				requesterId: userId,
				receiverId: otherId,
			},
		},
	});
	res.json({ message: 'User unblocked' });
}

async function deleteFriend(req, res) {
	const userId = req.user.id;
	const otherId = req.params.friendId;

	const existing = await prisma.friends.findFirst({
		where: {
			OR: [
				{ requesterId: otherId, receiverId: userId },
				{ requesterId: userId, receiverId: otherId },
			],
		},
	});
 if (!existing) {
    return res.status(404).json({error:'friendShip not found'})
 }
	const deleteUser = await prisma.friends.delete({
		where: {
			id: existing.id,
		},
	});
	res.json({ message: 'user unfriended' });
}

async function getFriendShip(req, res) {
	const otherId = req.params.userId;
	const userId = req.user.id;

	const friendship = await prisma.friends.findFirst({
		where: {
			OR: [
				{ requesterId: otherId, receiverId: userId },
				{ requesterId: userId, receiverId: otherId },
			],
			
		},
        select: {
      id: true,
      requesterId: true,
      receiverId: true,
      status: true,
      requester: {
        select: { id: true, userName: true }
      },
      receiver: {
        select: { id: true, userName: true }
      }
    }
	});
	res.json({ friendship });
}
export {
	sendFriendRequest,
	acceptFriend,
	block,
	unblock,
	deleteFriend,
	search,
	friendList,
	getFriendShip,
};

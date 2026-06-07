import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

async function createPost(req, res) {
	const { postBody } = req.body;
	const user = req.user;

	const post = await prisma.posts.create({
		data: {
			author: { connect: { id: req.user.id } },
			postBody,
		},
		include: {
			author: {
				select: {
					id: true,
					userName: true,
					isPublic: true,
				},
			},
			likes: true,
		},
	});
	res.json(post);
}

async function getPostsGlobal(req, res) {
	const viewerId = req.user?.id;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const post = await prisma.posts.findMany({
		// where: {
		// 	author: {isPublic: true}
		// },
		where: {
			OR: [
				{
					author: {
						isPublic: true,
					},
				},
				viewerId && {
					authorId: viewerId,
				},

				viewerId && {
					author: {
						isPublic: false,
						OR: [
							{
								receivedRequests: {
									some: {
										status: 'accepted',
										requesterId: viewerId,
									},
								},
							},

							{
								sentRequests: {
									some: {
										status: 'accepted',
										receiverId: viewerId,
									},
								},
							},
						],
					},
				},
			].filter(Boolean),
		},

		orderBy: { createdAt: 'desc' },
		skip: (page - 1) * limit,
		take: limit,
		include: {
			author: true,
			likes: true,
			comments: {
				include: {
					author: {
						select: {
							id: true,
							userName: true,
						},
					},
				},
			},
		},
	});
	res.json({ post });
}

async function friendsOnlyPosts(req, res) {
	const userId = req.user.id;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const friendPost = await prisma.posts.findMany({
		where: {
			author: {
				OR: [
					{
						receivedRequests: {
							some: {
								status: 'accepted',
								requesterId: userId,
							},
						},
					},

					{
						sentRequests: {
							some: {
								status: 'accepted',
								receiverId: userId,
							},
						},
					},
				],
			},
			
		},
		orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
			include: {
				author: true,
				likes: true,
				comments: {
					include: {
						author: {
							select: {
								id: true,
								userName: true,
							},
						},
					},
				},
			},
	});
	res.json({friendPost})
}
async function getPost(req, res) {
	const postId = req.params.postId;

	const post = await prisma.posts.findUnique({
		where: {
			id: postId,
		},

		include: {
			comments: {
				include: { likes: true },
			},
		},
	});
	res.json({ post });
}

async function userPosts(req, res) {
	const authorId = req.params.userId;
	const post = await prisma.posts.findMany({
		where: { authorId },
		include: {
			author: {
				select: {
					id: true,
					userName: true,
					firstName: true,
					isPublic: true,
				},
			},
			comments: true,
		},
		orderBy: { createdAt: 'desc' },
	});
	console.log('author id', authorId);

	res.json({ post: post });
}

async function likePost(req, res) {
	const userId = req.user.id;
	const postId = req.params.postId;

	const like = await prisma.likePost.create({
		data: {
			userId,
			postId,
		},
	});
	res.json({ like });
}

export { createPost, userPosts, getPostsGlobal, likePost, getPost, friendsOnlyPosts };

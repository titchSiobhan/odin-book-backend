import cloudinary from '../lib/cloudinary.js';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

async function createPost(req, res) {
	try {
		const { postBody } = req.body;
		const user = req.user;
		if (!req.file) {
			const post = await prisma.posts.create({
					data: {
						author: { connect: { id: req.user.id } },
						postBody,
						image: null
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
				return res.json(post);
		}

		//if photo

		const stream = cloudinary.uploader.upload_stream(
			{
				folder: 'post_image',
			},
			async (error, result) => {
				if (error) return res.status(500).json({ error });

				const post = await prisma.posts.create({
					data: {
						author: { connect: { id: req.user.id } },
						postBody,
						image: result.secure_url,
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
			},
		);
		stream.end(req.file.buffer)
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

async function getPostsGlobal(req, res) {
	const viewerId = req.user?.id;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const post = await prisma.posts.findMany({
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
							profileImage: true
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
							profileImage: true
						},
					},
				},
			},
		},
	});
	res.json({ friendPost });
}
async function getPost(req, res) {
	const postId = req.params.postId;

	const post = await prisma.posts.findUnique({
		where: {
			id: postId,
		},

		include: {
			comments: {
				include: {
					author: {
						select: {
							id: true,
							userName: true,
							profileImage: true
						},
					},
				},
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
			comments: {
				include: {
					author: {
						select: {
							id: true,
							userName: true,
							profileImage: true
						},
					},
				},
			},
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


async function deletePost(req, res) {
	const {postId} = req.params;
	const userId = req.user.id
const deleteComments = await prisma.comments.deleteMany({
	where: {
		postId: postId
	}
});
	const postDelete = await prisma.posts.delete({
		where: {
			id: postId
		}
	})
	res.json({message: 'post deleted'})
}
export {
	createPost,
	userPosts,
	getPostsGlobal,
	likePost,
	getPost,
	friendsOnlyPosts,
	deletePost
};

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
	});
	res.json({ post });
}

async function getPostsGlobal(req, res) {
	const user = req.user;

	const post = await prisma.posts.findMany({
		include: {
			author: {
				select: { isPublic: true, userName: true },
			},
			comments: true,
		},
		orderBy: { createdAt: 'desc' },
	});
	res.json({ post });
}

async function getPost(req, res) {
    const postId = req.params.postId;

    const post = await prisma.posts.findUnique({
        where: {
            id: postId
        },
        include:{
            comments: {
                include: {likes: true}
            }
        }
    })
    res.json({post})
}

async function userPosts(req, res) {
	const authorId = req.params.authorId;
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

	res.json({ post });
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

export { createPost, userPosts, getPostsGlobal, likePost, getPost };

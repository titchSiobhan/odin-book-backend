import express from 'express';
import verifyToken from '../middleware/verify.js';
import * as postController from '../controllers/postController.js'
import * as commentController from '../controllers/commentController.js'

const postRouter =express.Router() 

postRouter.post('/create-post', verifyToken, postController.createPost)

postRouter.get('/home', postController.getPostsGlobal)

postRouter.get('/post/:postId', postController.getPost)

postRouter.get('/user/page/:authorId',  postController.userPosts)

postRouter.post('/post/:postId/add-comment', verifyToken,  commentController.postComment)

postRouter.post('/comment/:commentId/like', verifyToken, commentController.likeComment)

postRouter.post('/post/:postId/like', verifyToken, postController.likePost)



export default postRouter
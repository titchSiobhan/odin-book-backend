import express from 'express';
import * as verify from '../middleware/verify.js';

import * as postController from '../controllers/postController.js'
import * as commentController from '../controllers/commentController.js'

const postRouter =express.Router() 

postRouter.post('/create-post', verify.verifyToken, postController.createPost)

postRouter.get('/home', verify.optionalVerifyToken, postController.getPostsGlobal)

postRouter.get('/home/friends', verify.verifyToken, postController.friendsOnlyPosts)

postRouter.get('/post/:postId', postController.getPost)

postRouter.get('/user/page/:userId',  postController.userPosts)

postRouter.post('/post/:postId/add-comment', verify.verifyToken,  commentController.postComment)

postRouter.post('/comment/:commentId/like', verify.verifyToken, commentController.likeComment)

postRouter.post('/post/:postId/like', verify.verifyToken, postController.likePost)



export default postRouter
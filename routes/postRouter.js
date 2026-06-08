import express from 'express';
import upload from '../middleware/multer.js';
import * as verify from '../middleware/verify.js';

import * as postController from '../controllers/postController.js'
import * as commentController from '../controllers/commentController.js'

const postRouter =express.Router() 

postRouter.post('/create-post', verify.verifyToken, upload.single('image'), postController.createPost)

postRouter.get('/home', verify.optionalVerifyToken, postController.getPostsGlobal)

postRouter.get('/home/friends', verify.verifyToken, postController.friendsOnlyPosts)

postRouter.get('/post/:postId', postController.getPost)

postRouter.get('/user/page/:userId',  postController.userPosts)

postRouter.post('/post/:postId/add-comment', verify.verifyToken,  commentController.postComment)

postRouter.post('/comment/:commentId/like', verify.verifyToken, commentController.likeComment)

postRouter.post('/post/:postId/like', verify.verifyToken, postController.likePost)

postRouter.delete('/post/delete/:postId', verify.verifyToken, postController.deletePost)

postRouter.delete('/comment/delete/:postId/commentId', verify.verifyToken, commentController.deleteComment)



export default postRouter
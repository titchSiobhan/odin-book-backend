import prisma from '../lib/prisma.js'


async function postComment(req, res) {
    const postId = req.params.postId;
    const {commentText} = req.body;
    const userId = req.user.id


   const comment = await prisma.comments.create({
  data: {
    postId,
    commentText,
    authorId: userId
  },
  include: {
    author: {
      select: {
        id: true,
        userName: true
      }
    }
  }
});

    res.json(comment)
}


async function getComments(req, res) {
    const { postId } = req.params.postId
    

    const comments = await prisma.comments.findMany({
        where: {
            postId
        },
        orderBy: {createdAt: 'desc'}
    })
    res.json(comment)
}

async function likeComment(req, res) {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const like = await prisma.likeComment.create({
        data: {
            userId,
            commentId
        }
    })
    res.json({like})
}

export {
    postComment, getComments, likeComment
}
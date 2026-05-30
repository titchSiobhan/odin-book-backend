import prisma from '../lib/prisma.js'


async function postComment(req, res) {
    const postId = req.params.postId;
    const {commentText} = req.body;
    const userId = req.user.id


    const comment = await prisma.comments.create({
        data: {
            postId: postId,
            commentText, 
            authorId: userId
        }
    })
    res.json({comment})
}


async function getComments(req, res) {
    const { postId } = req.params.postId

    const comments = await prisma.comments.findMany({
        where: {
            postId
        },
        orderBy: {createdAt: 'desc'}
    })
}

export {
    postComment, getComments
}
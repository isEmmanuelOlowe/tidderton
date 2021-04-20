import axios from 'axios';
const jwt = require('jsonwebtoken');
import {getCommentResponse, getSuitableHeaders} from '../../utils'

// Request for individual post by ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {

        let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
        let authResponse = await axios.get(verificationUrl, {headers: getSuitableHeaders(req)})
        if (!authResponse.data.verified) {
            res.status(authResponse.data.statusCode).json({message: authResponse.data.message})
        }

        else {

            let commentData = await axios.get(process.env.BACKEND_HOST + "/comments/" + id);

            if (commentData.data.children) {

                let childComments = commentData.data.children
                let commentList = []

                for (let i = 0; i < childComments.length; i++) {
                    try {
                        let commentId = childComments[i]
                        let commentData = await axios.get(process.env.BACKEND_HOST + "/comments/" + commentId);
                        commentData = commentData.data
                        if (commentData.message === "Invalid Comment ID") {
                            console.log("Comment Used to Exist, Has Been Deleted Since")
                        }
                        else {
                            let formattedComment = getCommentResponse(commentData, commentId)
                            commentList.push(formattedComment)
                        }
                    } catch {
                        // commentList.push({message: "COMMENT USED TO EXIST, HAS BEEN DELETED "})
                        continue
                    }
                }

                let responseData = {
                    "_embedded": {
                        "commentList": commentList
                    },
                    "_links": {
                        "self": {
                        "href": process.env.FRONTEND_HOST + "/api/posts/" + id + "/comments"
                        }
                    }
                }

                res.status(200).json(responseData)
            }
        }
    }

    else if (req.method === "POST") {

        let replyContent = req.body.commentContent
        let username = req.body.username
        let userId = req.body.userId
        let user = {id: userId, username: username}
        let commentData = await axios.get(process.env.BACKEND_HOST + "/comments/" + id);
        let postID = commentData.data.postId

        let addChildCommentResponse = await axios.post(process.env.BACKEND_HOST + '/comments/addChild/',
                                                        {postID: postID, parent: id, comment: replyContent, user},
                                                        {headers: getSuitableHeaders(req)});

        if (addChildCommentResponse.data.statusCode !== 200) {
            res.status(addChildCommentResponse.data.statusCode).json({message: addChildCommentResponse.data.message})
        }
        else {
            let addedComment = addChildCommentResponse.data.comment
            let formattedComment = getCommentResponse(addedComment)
            res.status(200).json(formattedComment)
        }
    }
}

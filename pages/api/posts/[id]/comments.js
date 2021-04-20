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
            
            let data = await axios.get(process.env.BACKEND_HOST + "/posts/" + id);
            if (data.data.statusCode != 200) {
                res.status(data.data.statusCode).json({message: data.data.message});
            }

            else {
                
                let postContents = data.data.post
                let comments = postContents.comments

                let commentList = []


                for (let i = 0; i < comments.length; i++) {
                    try {
                        let commentId = comments[i]
                        let commentData = await axios.get(process.env.BACKEND_HOST + "/comments/" + commentId)
                        commentData = commentData.data

                        if (commentData.message === "Invalid Comment ID") {
                            // res.status(404).json({message: "Invalid Comment ID"});
                            console.log(`INVALID COMMENT ID [${commentId}], COMMENT USED TO EXIST, HAS BEEN DELETED`)
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
    else if (req.method == "POST") {

        let commentContent = req.body.commentContent
        let userId = req.body.userId
        let username = req.body.username
        const user = {username: req.body.username, id: req.body.userId}
        const addCommentResponse = await axios.post(process.env.BACKEND_HOST + '/posts/addComment', {user, postID: id, comment:commentContent}, {headers: getSuitableHeaders(req)});

        if (addCommentResponse.data.statusCode === 403) {
            res.status(403).json({message: "UNAUTHORIZED !!!!!!! " + addCommentResponse.data.message});
        }
        else {

            let message = addCommentResponse.data.message
            let commentData = addCommentResponse.data.newComment
            if (message === "Comment Added") {
                let commentId = addCommentResponse.data.commentID
                commentData = await axios.get(process.env.BACKEND_HOST + "/comments/" + commentId)
                commentData = commentData.data
                let formattedComment = getCommentResponse(commentData, commentId)
                res.status(200).json(formattedComment);
            }
            else {
                res.status(404).json(addCommentResponse.data);
            }
        }
    }
}

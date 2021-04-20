import axios from 'axios';
const jwt = require('jsonwebtoken');
import {getPostResponse, getSuitableHeaders} from '../../utils'

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

            // Fetch subforum based on ID.
            let sub = await axios.get(process.env.BACKEND_HOST + "/sub/" + id);

            if (sub.data.statusCode != 200) {
                res.status(sub.data.statusCode).json({message: sub.data.message})
            }

            // If sub was found then extract list of all of its posts.
            else if (sub.data.details) {

                let postList = [];
                let posts = sub.data.details.posts
                for (let i = 0; i < posts.length; i++) {
                    // Construct respnse.
                    let postId = posts[i]
                    try {
                        let post = await axios.get(process.env.BACKEND_HOST + "/posts/" + postId)
                        if (post.data.statusCode == 200) {
                            let formattedPost = getPostResponse(post.data, postId)
                            postList.push(formattedPost);
                        }
                    }
                    catch {
                        continue
                    }
                }

                let responseData = {
                    "_embedded": {
                        "postList": postList
                    },
                    "_links": {
                        "self": {
                            "href": process.env.FRONTEND_HOST + "/api/subforums/" + id + "/posts"
                        }
                    }
                }
                // Return user with OK respnse code.
                res.status(200).json(responseData);
            }
        }
    }

    // TO DO, need to use ID of sub effectively
    // issues with user not already being in db
    else if (req.method === "POST") {
        let title = req.body.postTitle
        let post = req.body.postContents
        const user = {username:req.body.username, id:req.body.userId}
        const addPostResponse = await axios.post(process.env.BACKEND_HOST + '/posts/addPost', {user, title, post, subID: id}, {headers: getSuitableHeaders(req)});

        if (addPostResponse.data.statusCode != 200) {
            res.status(addPostResponse.data.statusCode).json({message: addPostResponse.data.message})
        }

        else {
            let postId = addPostResponse.data.postID
            let postContents = addPostResponse.data
            postContents = await axios.get(process.env.BACKEND_HOST + "/posts/" + postId)
            postContents = postContents.data
            let formattedPost = getPostResponse(postContents, postId)
            res.status(200).json(formattedPost);
        }
    }
}

import axios from 'axios';
import {getPostResponse, getVoteList, getSuitableHeaders} from '../../utils'

// Request for individual User by ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
    let authResponse = await axios.get(verificationUrl, {headers: getSuitableHeaders(req)})
    if (!authResponse.data.verified) {
        res.status(authResponse.data.statusCode).json({message: authResponse.data.message})
    }

    else if (req.method === "GET") {
        // Fetch user based on ID in request.
        let postData = await axios.get(process.env.BACKEND_HOST + "/posts/allPosts/");
        postData = postData.data
        let postList = [];
        for (let i = 0; i < postData.length; i++) {
            let post = postData[i]
            if (post.user != undefined) {
                if (post.user.userID === id) {
                    let cleanPost = getPostResponse(post, post._id)
                    // Add post entry to the list of posts.
                    postList.push(cleanPost);
                }
            }
        }

        // If user was found then construct JSON response conforming to protocol.
            
        // Create the final response including the list of posts.
        let responseData = {
            "_embedded": {
                "postList": postList
            },
            "_links": {
                "self": {
                    "href": process.env.FRONTEND_HOST + "/api/users/" + id + "/posts"
                }
            }
        }
        // Return user with OK respnse code.
        res.status(200).json(responseData);
    }
}
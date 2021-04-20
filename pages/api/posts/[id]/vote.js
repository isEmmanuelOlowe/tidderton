import axios from 'axios';
import {getPostResponse, getSuitableHeaders} from '../../utils'

// Request for individual post by ID.
export default async (req, res) => {
    
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "PUT") {

        let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
        let suitableHeaders = getSuitableHeaders(req)
        let authResponse = await axios.get(verificationUrl, {headers: suitableHeaders})
        if (!authResponse.data.verified) {
            res.status(authResponse.data.statusCode).json({message: authResponse.data.message})
        }

        else {

            let postData = await axios.get(process.env.BACKEND_HOST + "/posts/" + id)

            if (postData.data.statusCode === 404) {
                res.status(postData.data.statusCode).json({message: postData.data.message})
            }   

            else {
            
                let isUpvote = req.body.isUpvote
                let userId = suitableHeaders['user-id']
                let serverUrl = suitableHeaders['server-url']
                let path = "/api/users/" + userId
                let requestType = "get"
                
                let signingUrl = `${process.env.BACKEND_HOST}/signatures/sign`
                let suitableHeadersOtherServer =  await axios.get(signingUrl, {params: {type: requestType, path: path, userId: userId}})
                suitableHeadersOtherServer = suitableHeadersOtherServer.data
                let getUserDetails = await axios.get(serverUrl + path, {headers: suitableHeadersOtherServer})

                let username = getUserDetails.data.username
                let user = {username: username, id: userId}

                if (isUpvote) {
                    let addUpvoteResponse = await axios.post(process.env.BACKEND_HOST + '/posts/upvote', {user, id}, {headers: suitableHeaders})
                    res.status(200).json({message: "UPDATED VOTE"})
                }

                else {
                    let addDownvoteResponse = await axios.post(process.env.BACKEND_HOST + '/posts/downvote', {user, id}, {headers: suitableHeaders})
                    res.status(200).json({message: "UPDATED VOTE"})
                }
            }
        }
    }
}

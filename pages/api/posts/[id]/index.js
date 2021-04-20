import axios from 'axios';
import {getPostResponse, getSuitableHeaders} from '../../utils'

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
        
            // Fetch post based on ID.
            let postData = await axios.get(process.env.BACKEND_HOST + "/posts/" + id);
            let statusCode = postData.data.statusCode
            
            if (statusCode != 200) {
                res.status(statusCode).json({message: postData.data.message});
            }

            // If post was found then construct JSON response conforming to protocol.
            else {
                
                // Construct respnse.
                let postReponse = getPostResponse(postData.data, id)
                res.status(200).json(postReponse);
            }
        }
    }
    else if (req.method == "PATCH") {
        
        let title = req.body.postTitle
        let body = req.body.postContents

        let user = {id: "remote-id-" + Date.now(), username: "remote"}
        
        let postData = await axios.patch(process.env.BACKEND_HOST + "/posts/" + id, {user, title: title, body: body}, {headers: getSuitableHeaders(req)})
        let statusCode = postData.data.statusCode
        if (statusCode != 200) {
            res.status(statusCode).json({message: postData.data.message})
        }
        
        else {
            res.status(200).json({message: "Post Updated"})
        }
    }

    else if (req.method == "DELETE") {

        // Fetch post based on ID.
        let postData = await axios.delete(process.env.BACKEND_HOST + "/posts/" + id, {headers: getSuitableHeaders(req)})
        let statusCode = postData.data.statusCode
        if (statusCode != 200) {
            res.status(statusCode).json({message: postData.data.message})
        }
        else {
            res.status(200).json({message: "Post Deleted"})
        }
    }
}

import axios from 'axios';
import {getSubforumResponse, getSuitableHeaders} from '../../utils'

// Request for individual Sub by ID.
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

        // Fetch subforum based on ID.
        let sub = await axios.get(process.env.BACKEND_HOST + "/sub/" + id, {headers: getSuitableHeaders(req)});
        
        let statusCode = sub.data.statusCode
        if (sub.data.statusCode != 200) {
            res.status(statusCode).json({message: sub.data.message})
        }

        // If sub was found then construct JSON response conforming to protocol.
        else if (sub.data.details) {
            
            // Construct respnse.
            let forum = getSubforumResponse(sub.data.details)

            // Return user with OK respnse code.
            res.status(200).json(forum);

        }
    }
}

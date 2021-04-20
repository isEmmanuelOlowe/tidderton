import axios from "axios";
import {getForumResponse, getSuitableHeaders} from '../../utils'

// Request for individual forum by ID.
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

        // If forum was found then construct JSON response conforming to protocol.
        if (id == process.env.TIDDERTON_ID) {
            // Construct respnse.
            let forum = getForumResponse()

            // Return forum with OK respnse code.
            res.status(200).json(forum);

        }
        // Case where forum not found.
        else {
            res.status(404).json({message: "Forum Not Found"});
        }
    }
}

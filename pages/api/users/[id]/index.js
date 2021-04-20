import axios from 'axios';
import {getUserResponse, getSuitableHeaders} from '../../utils'

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
        // Fetch user based on ID.
        let userData = await axios.get(process.env.BACKEND_HOST + "/users/" + id);
        
        // If user was found then construct JSON response conforming to protocol.
        if (userData.data.details) {
            // Construct response
            let user = getUserResponse(userData.data.details, id)
            res.status(200).json(user);

        }
        // Case where user not found.
        else {
            res.status(404).json({msg: userData.data.message});
        }
    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(404).json({msg: "Invalid Request"});
    }
}

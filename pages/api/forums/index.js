import axios from 'axios';
import {getForumResponse, getSuitableHeaders} from '../utils'

// Request for list of forums.
export default async (req, res) => {

    console.log(`Incoming Request From ${req.headers.host}`)

    let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
    let authResponse = await axios.get(verificationUrl, {headers: getSuitableHeaders(req)})
    
    if (!authResponse.data.verified) {
        res.status(authResponse.data.statusCode).json({message: authResponse.data.message})
        
    }

    else if (req.method === "GET") {

        // Construct respnse.
        let forum = getForumResponse()

        let responseData = {
            "_embedded": {
                "forumList": [forum]
            },
            "_links": {
                "self": {
                    "href": process.env.FRONTEND_HOST + "/api/forums"
                }
            }
        }
        // Return forum with OK respnse code.
        res.status(200).json(responseData);
    }
}

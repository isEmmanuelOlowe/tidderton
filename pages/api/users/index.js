import axios from 'axios';
import {getSuitableHeaders, getUserResponse} from '../utils'

// Request for List of Users.
export default async (req, res) => {
    
    let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
    let authResponse = await axios.get(verificationUrl, {headers: getSuitableHeaders(req)})
    if (!authResponse.data.verified) {
        res.status(authResponse.data.statusCode).json({message: authResponse.data.message})
    }
    else if (req.method === "GET") {

        // Fetch users.
        let users = await axios.get(process.env.BACKEND_HOST + "/users/allUsers");
     
        // If user data was found then construct JSON response conforming to protocol.
        if (users.data) {
            // Construct respnse.
            let userList = [];

            let user;
            for (user of users.data) {
    
                // Extract each user from the retrieved list and format them to comply with the protocol.
                let cleanUser = getUserResponse(user, user._id)
                userList.push(cleanUser);
            }

            let responseData = {
                '_embedded': {
                    'userList': userList 
                },
                '_links': {
                    "self": {
                        "href": process.env.FRONTEND_HOST + "/api/users"   
                    }
                }
            }

            // Return users with OK respnse code.
            res.status(200).json(responseData);
       
        } 
        else {
            // Case where users not found.
            res.status(404).json({msg: "users not found"});
        }
    }  
}
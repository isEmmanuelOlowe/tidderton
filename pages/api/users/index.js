import axios from 'axios';

// Request for List of Users.
export default async (req, res) => {

    if (req.method === "GET") {

        // Fetch users.
        let users = await axios.get(process.env.BACKEND_HOST + "/users/allUsers");
     
        // If user data was found then construct JSON response conforming to protocol.
        if (users.data) {
            // Construct respnse.

            var responseData = [];

            var user;
            for (user of users.data) {
                
                // Extract each user from the retrieved list and format them to comply with the protocol.
                let cleanUser = {
                    "id": user._id,
                    "username": user.username,
                    "_links": {
                        "self": {
                            "href": process.env.FRONTEND_HOST + "/api/users/" + user._id    
                        }, 
                        "users": {
                            "href": process.env.FRONTEND_HOST + "/api/users" 
                        }
                    }    
                }
                responseData.push(cleanUser);
            }

            // Return users with OK respnse code.
            res.status(200).json(responseData);
       

        
        } 
        else {
            // Case where users not found.
            res.status(404).json({msg: "users not found"});
        }
    }  
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}
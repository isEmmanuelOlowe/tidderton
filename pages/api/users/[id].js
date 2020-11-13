import axios from 'axios';

// Request for individual User by ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {
        // Fetch user based on ID.
        let data = await axios.get(process.env.BACKEND_HOST + "/users/" + id);
        
        // If user was found then construct JSON response conforming to protocol.
        if (data.data.details) {
            // Construct respnse.
            let user = {
                "id":       data.data.details._id,
                "username": data.data.details.username,
                "_links": {
                    "self": {
                        "href": process.env.FRONTEND_HOST + "/api/users/" + id
                    }, 
                    "users": {
                        "href": process.env.FRONTEND_HOST + "/api/users" 
                    }
                }
            }
            
            // Return user with OK respnse code.
            res.status(200).json(user);
        
        }
        // Case where user not found.
        else {
            res.status(404).json({msg: "user not found"});
        }

        
    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}
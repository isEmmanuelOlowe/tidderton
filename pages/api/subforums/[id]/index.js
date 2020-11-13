import axios from 'axios';

// Request for individual Sub by ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {

        // Fetch subforum based on ID.
        let sub = await axios.get(process.env.BACKEND_HOST + "/sub/" + id);
                
        // If sub was found then construct JSON response conforming to protocol.
        if (sub.data.details) {
            // Construct respnse.
            let forum = {
                
                "id":   sub.data.details._id,
                "subforumName": sub.data.details.title,
                "forumId": 1,   // TODO make this env variable for forum ID
                "_links": {
                    "self": {
                        "href": process.env.FRONTEND_HOST + "/api/subforums/" + id
                    }, 
                    "forum": {
                        "href": process.env.FRONTEND_HOST + "/api/forums/" + 1 
                    },
                    "posts": {
                        "href": process.env.FRONTEND_HOST + "/api/subforums/1/posts" 
                    }
                }
            }
            
            // Return user with OK respnse code.
            res.status(200).json(forum);
        
        }
        // Case where user not found.
        else {
            res.status(404).json({msg: "forum not found"});
        }

        
    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}
import axios from 'axios';

// Request for individual post by ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {
        // Fetch post based on ID.
        let data = await axios.get(process.env.BACKEND + "/posts/" + id);
       
        // If post was found then construct JSON response conforming to protocol.
        if (data.data.details) {
        
            // Construct respnse.
            let post = {
                "id":           data.data.details._id,
                "postTitle":    data.data.details.title,
                "postContents": data.data.details.body,
                "userId":       "tidder@" + data.data.details.username, // TODO update to fetch user ID
                "subforumId":   data.data.details.sub,          // TODO update to fetch sub ID
                
                
                "_links": {
                    "self": {
                        "href": process.env.FRONTEND_HOST + "/api/posts/" + id
                    },
                    "subforum": {
                        "href": process.env.FRONTEND_HOST + "/api/subforums/" + data.data.details.sub
                    },
                    "forum": {
                        "href": process.env.FRONTEND_HOST + "/api/forums/1"
                    },
                    "user": {
                        "href": process.env.FRONTEND_HOST + "/api/users/" + "tidder@" + data.data.details.username, // TODO update to fetch user ID
                    },
                    "comments": {
                        "href": ""  // TODO add routes for comments
                    }
                }
            }
              // Return post with OK respnse code.
              res.status(200).json(post);
             // Case where user not found.
           

        
        }
        else {
            res.status(404).json({msg: "post not found"});
        }
    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}

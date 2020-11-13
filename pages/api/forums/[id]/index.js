// Request for individual forum by ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {
                
        // If forum was found then construct JSON response conforming to protocol.
        if (id == 1) {
            // Construct respnse.
            let forum = {
                
                "id":   1,
                "forumName": "Tidderton",
                "_links": {
                    "self": {
                        "href": process.env.FRONTEND_HOST + "/api/forums/" + id 
                    }, 
                    "forums": {
                        "href": process.env.FRONTEND_HOST + "/api/forums" 
                    },
                    "subforums": {
                        "href": process.env.FRONTEND_HOST + "/api/forums/" + id + "/subforums"
                    }       
                }   
            }          
            
            // Return forum with OK respnse code.
            res.status(200).json(forum);
        
        }
        // Case where forum not found.
        else {
            res.status(404).json({msg: "forum not found"});
        }

    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}
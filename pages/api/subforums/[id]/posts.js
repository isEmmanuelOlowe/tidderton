import axios from 'axios';

export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {

        // Fetch subforum based on ID.
        let sub = await axios.get(process.env.BACKEND_HOST + "/sub/" + id);

        // If sub was found then extract list of all of its posts.
        if (sub.data.details) {

            var postList = [];

            var post;
            for (post of sub.data.details.Posts) {
                    // Construct respnse.
                let cleanPost = {
                    "id":           post._id,
                    "postTitle":    post.title,
                    "postContents": post.body,
                    "userId":       "tidder@" + post.username, // TODO update to fetch user ID
                    "subforumId":   post.sub,          // TODO update to fetch sub ID
                    
                    "_links": {
                        "self": {
                            "href": process.env.FRONTEND_HOST + "/api/posts/" + post._id
                        },
                        "subforum": {
                            "href": process.env.FRONTEND_HOST + "/api/subforums/" + post.sub
                        },
                        "forum": {
                            "href": process.env.FRONTEND_HOST + "/api/forums/" + 1
                        },
                        "user": {
                            "href": "" // TODO add 
                        },
                        "comments": {
                            "href": "" // TODO add comment routes
                        }
                    }
                }
                postList.push(cleanPost);
            }           
            
            // Return user with OK respnse code.
            res.status(200).json({"_embedded": { "postList": postList}});
        
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
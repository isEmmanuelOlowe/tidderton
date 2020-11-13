import axios from 'axios';

// Request for list of subforums of given forum ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    if (req.method === "GET") {

        // Fetch subforum based on ID.
        let subs = await axios.get(process.env.BACKEND_HOST + "/sub/allSubs");

        // If sub was found then extract list of all of its posts.
        if (subs.data) {

            var subforumList = [];

            var forum;
            for (forum of subs.data) {
                // Construct respnse.
                let cleanForum = {
            
                    "id":   forum._id,
                    "subforumName": forum.title,
                    "forumId": 1,   // TODO make this env variable for forum ID
                    "_links": {
                        "self": {
                            "href": process.env.FRONTEND_HOST + "/api/subforums/" + forum._id
                        }, 
                        "forum": {
                            "href": process.env.FRONTEND_HOST + "/api/forums/" + 1
                        },
                        "posts": {
                            "href": process.env.FRONTEND_HOST + "/api/subforums/" + forum._id + "/posts" 
                        }
                    }
                }
                subforumList.push(cleanForum);
            }           
            
            // Return user with OK respnse code.
            res.status(200).json({"_embedded": { "subforumList": subforumList}});
        
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
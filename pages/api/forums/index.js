// Request for list of forums.
export default async (req, res) => {

    if (req.method === "GET") {
                        
        // Construct respnse.
        let forum = {
            
            "id":   1,
            "forumName": "Tidderton",
            "_links": {
                "self": {
                    "href": process.env.FRONTEND_HOST + "/api/forums/" + 1 // TODO extract to var
                }, 
                "forums": {
                    "href": process.env.FRONTEND_HOST + "/api/forums" 
                },
                "subforums": {
                    "href":  process.env.BACKEND_HOST + "/api/forums/1/subforums"
                }       
            }   
        }
        
        let responseData = {
            "_embedded": {
                "forumList": [
                    {
                        forum
                    }
                ]
            }
        }   
        
        // Return forum with OK respnse code.
        res.status(200).json(responseData);

    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}
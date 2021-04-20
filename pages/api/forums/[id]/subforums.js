import axios from 'axios';
import {getSubforumResponse, getSuitableHeaders} from '../../utils'

// Request for list of subforums of given forum ID.
export default async (req, res) => {
    // Extract ID from request URL.
    const {
        query: { id },
    } = req;

    let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
    let authResponse = await axios.get(verificationUrl, {headers: getSuitableHeaders(req)})
    if (!authResponse.data.verified) {
        res.status(authResponse.data.statusCode).json({message: authResponse.data.message})

    }
    else if (req.method === "GET") {

        if (id == process.env.TIDDERTON_ID) {
            // Fetch subforum based on ID.
            let subs = await axios.get(process.env.BACKEND_HOST + "/sub/allSubs", {headers: getSuitableHeaders(req)});

            // If sub was found then extract list of all of its posts.
            if (subs.data) {

                var subforumList = [];

                var forum;
                for (forum of subs.data) {

                    // Constructing response.
                    let cleanForum = getSubforumResponse(forum)
                    subforumList.push(cleanForum);
                }

                let responseData = {
                    "_embedded": {
                        "subforumList": subforumList
                    },
                    "_links": {
                        "self": {
                            "href": process.env.FRONTEND_HOST + "/api/forums/" +  process.env.TIDDERTON_ID + "/subforums"
                        }
                    }
                }
                // Return user with OK respnse code.
                res.status(200).json(responseData);

            }
        }
        // Case where user not found.
        else {
            res.status(404).json({message: "Forum Not Found"});
        }
    }
}

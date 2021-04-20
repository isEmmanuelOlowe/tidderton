import axios from 'axios';
import {getCommentResponse, getSuitableHeaders} from '../../utils'

// Request for individual User by ID.
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
      // Fetch user comments based on user's ID.
      let commentData = await axios.get(process.env.BACKEND_HOST + "/comments/userComments/" + id);

      if (commentData) {

            let commentList = [];
            let comment;
            for (comment of commentData.data.comments) {
                let cleanComment = getCommentResponse(comment, comment._id);
                commentList.push(cleanComment);
            }

            let responseData = {
                '_embedded': {
                    'commentList': commentList
                },
                'links': {
                    'self': {
                        'href': process.env.FRONTEND_HOST + '/api/users/' + id + '/comments'
                    }
                }

            }

            res.status(200).json(responseData);
        }
        else {
            res.status(404).json({msg: "user not found"});
        }
    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "Forbidden no permission or error."});
    }
}

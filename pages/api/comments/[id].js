import axios from 'axios';
import {getVoteList, getCommentResponse, getSuitableHeaders} from '../utils'

//Request for a single comment using its id
export default async (req, res) => {
  // Extract id from request URL.
  const {
      query: { id },
  } = req;

  if(req.method === "GET") {

    let verificationUrl = `${process.env.BACKEND_HOST}/signatures/verify`
    let authResponse = await axios.get(verificationUrl, {headers: getSuitableHeaders(req)})
    if (!authResponse.data.verified) {
        res.status(authResponse.data.statusCode).json({message: authResponse.data.message})
    }

    else {
      let commentData = await axios.get(process.env.BACKEND_HOST + "/comments/" + id)
      commentData = commentData.data

      if (commentData.message === "Invalid Comment ID") {
        res.status(404).json({message: "Invalid Comment ID"});
      }
      else {
        let responseData = getCommentResponse(commentData, id)
        res.status(200).json(responseData)
      }
    }
  }

  else if (req.method === "PATCH") {

      let commentContent = req.body.commentContent
      let user = {id: "remote-id-" + Date.now(), username: "remote"}

      let commentData = await axios.patch(process.env.BACKEND_HOST + "/comments/" + id, {user, commentContent}, {headers: getSuitableHeaders(req)})

      commentData = commentData.data
      if(commentData.statusCode != 200) {
        res.status(commentData.statusCode).json({message:commentData.message});
      }
      else {
        res.status(200).json({message: "Comment updated"})
      }

  }

  else if (req.method === "DELETE") {

    let commentData = await axios.delete(process.env.BACKEND_HOST + "/comments/" + id, {headers: getSuitableHeaders(req)})
    commentData = commentData.data
    if(commentData.statusCode != 200) {
      res.status(commentData.statusCode).json({message:commentData.message});
    }
    else {
      res.status(200).json({message: "Comment deleted"})
    }
  }
}

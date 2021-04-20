function getSuitableHeaders(req) {

  try {
    let myHeaders = new Headers(req.headers);
    let signatureInput = myHeaders.get('signature-input')
    let signature = myHeaders.get('signature')
    let target = `${req.method.toLowerCase()} ${req.url}`
    let currentDate = myHeaders.get('current-date')
    let userId = myHeaders.get('user-id')

    //extract server from header
    let inputParts = signatureInput.split('; ')
    let keyPath = inputParts[1].split('=')[1]
    let serverUrl = keyPath.split("/api")[0];
    let server = serverUrl.split("://")[1].split('.')[0]

    let suitableHeaders = {"signature-input": signatureInput, "signature": signature, "current-date":currentDate, "user-id":userId, "target": target, "key-path":keyPath, 
                            "server-url": serverUrl, "server": server}
    console.log(suitableHeaders.server)
    return suitableHeaders
  }
  catch {
    console.log("INVALID HEADER FORMATTING")
    return {"message": "INVALID HEADER FORMATTING"}
  }
}

function getVoteList(votes) {
    let voteList = [];
    let vote;
    for (vote of votes.upvotes) {

        let vote_url = vote.server_url || process.env.FRONTEND_HOST
        let cleanVote = {
            "isUpvote": true,
            "user": vote_url + "/api/users/" + vote.userID,
        }

        voteList.push(cleanVote);
    }
    for (vote of votes.downvotes) {

        let vote_url = vote.server_url || process.env.FRONTEND_HOST
        let cleanVote = {
            "isUpvote": false,
            "user": vote_url + "/api/users/" + vote.userID,
        }

        voteList.push(cleanVote);
    }

    return voteList
}

function getCommentResponse(commentData, id) {

    id = commentData._id
    let server_url = commentData.server_url ||  process.env.FRONTEND_HOST
    let responseData = {

        "id": commentData._id,
        "commentContent": commentData.commentContent,
        "createdTime": commentData.createdAt,
        "modifiedTime": commentData.updatedAt,
        "userId": commentData.userId,
        "username": commentData.username,
        "postId": commentData.postId,
        "downvotes": commentData.votes.downvotes.length,
        "upvotes": commentData.votes.upvotes.length,
        "_userVotes": getVoteList(commentData.votes),
        "_links": {
          "self": {
            "href": process.env.FRONTEND_HOST + "/api/comments/" + id,
          },
          "post": {
            "href": process.env.FRONTEND_HOST + "/api/posts/" + commentData.postId,
          },
          "subforum": {
            "href": process.env.FRONTEND_HOST + "/api/subforums/" + commentData.subId
          },
          "forum": {
            "href": process.env.FRONTEND_HOST + "/api/forums/" + process.env.TIDDERTON_ID
          },
          "user": {
            "href": server_url + "/api/users/" + commentData.userId
          },
          "childComments": {
            "href": process.env.FRONTEND_HOST + "/api/comments/" + id + "/comments"
          }
        }
      }
      if (commentData.parent) {
        responseData._links.parentComment = {"href": process.env.FRONTEND_HOST + "/api/comments/" + commentData.parent}
      }

    return responseData
}

function getForumResponse() {
    let forum = {
      "id":   process.env.TIDDERTON_ID,
      "forumName": "Tidderton",
      "_links": {
          "self": {
              "href": process.env.FRONTEND_HOST + "/api/forums/" + process.env.TIDDERTON_ID
          },
          "forums": {
              "href": process.env.FRONTEND_HOST + "/api/forums"
          },
          "subforums": {
              "href":  process.env.FRONTEND_HOST + "/api/forums/1/subforums"
          }
      }
  }
  return forum
}

function getSubforumResponse(sub) {
  let tidertonId = process.env.TIDDERTON_ID
  let res = {
      "id":   sub._id,
      "subforumName": sub.title,
      "forumId": tidertonId,
      "_links": {
          "self": {
              "href": process.env.FRONTEND_HOST + "/api/subforums/" + sub._id
          },
          "forum": {
              "href": process.env.FRONTEND_HOST + "/api/forums/" + tidertonId
          },
          "posts": {
              "href": process.env.FRONTEND_HOST + `/api/subforums/${sub._id}/posts`
          }
      }
  }
  return res
}

function getPostResponse (postData, id) {

    if (postData.post) {
      postData = postData.post
    }
    let server_url = postData.user.server_url || process.env.FRONTEND_HOST
    let post = {

      "id":           postData._id,
      "postTitle":    postData.title,
      "postContents": postData.body,
      "createdTime":  postData.createdAt,
      "modifiedTime": postData.updatedAt,
      "userId":       postData.user.userID,
      "username":     postData.user.username,
      "subforumId":   postData.subID,
      "downvotes":    postData.votes.downvotes.length,
      "upvotes":      postData.votes.upvotes.length,
      "_uservotes":   getVoteList(postData.votes),
      "postType": "text",
      "_links": {
          "self": {
              "href": process.env.FRONTEND_HOST + "/api/posts/" + id
          },
          "subforum": {
              "href": process.env.FRONTEND_HOST + "/api/subforums/" + postData.subID
          },
          "forum": {
              "href": process.env.FRONTEND_HOST + "/api/forums/1"
          },
          "user": {
              "href": server_url + "/api/users/" + postData.user.userID
          },
          "comments": {
              "href": process.env.FRONTEND_HOST + "/api/posts/" + id + "/comments"
          }
      }
  }
  return post
}

function getUserResponse(user, id) {

  let res = {
    "id":       user._id,
    "username": user.username,
    "createdTime":user.createdAt,
    "description": `Hi, I'm ${user.username} and I think Tidderton is a better server than yours`,
    "profileImageURL":"https://www.linkpicture.com/q/tidderton-logo.png",
    "_links": {
      "self": {
        "href": process.env.FRONTEND_HOST + "/api/users/" + id
      },
      "users": {
        "href": process.env.FRONTEND_HOST + "/api/users"
      }
    }
  }
  return res
}

module.exports = {getSuitableHeaders, getVoteList, getCommentResponse, getForumResponse, getSubforumResponse, getPostResponse, getUserResponse}

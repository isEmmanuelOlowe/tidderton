import {useEffect, useState} from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

 export default function Comment (props) {
    const [reply, setReply] = useState("");
    const [replyBox, setReplyBox] = useState("d-none");
    const [commentData, setCommentData] = useState([]);
    const [logged, setLogged] = useState(false);
    const handleReply = (e) => {
        setReply(e.target.value);
    }
    
    const addReply = () => {
        if (!(replyBox === "")) {
            setReplyBox("");
        }
        else {
            setReplyBox("d-none");
        }
    }

    const submitReply = async (e) => {
        e.preventDefault();   
        try {
            const { token } = parseCookies();
            let res = await axios.post(process.env.BACKEND_HOST + '/comments/addChild/', { token, postID: props.postID, parent: props.parentCommentID, comment: reply });
            let newCommentData = [...commentData]
            newCommentData.push(res.data.comment);
            setReplyBox("d-none");
            setCommentData(newCommentData);
        }
        catch (err) {
            console.log(err);
        }
    }

    const renderReplies = async () => {
        try {
            let commentsData = []
            for (let commentID in props.childComments) {
                let res = await axios.get(process.env.BACKEND_HOST + '/comments/' + props.childComments[commentID]);
                commentsData.push(res.data);
            }
            const {token} = parseCookies();
            if (token) {
                setLogged(true);
            }
            setCommentData(commentsData);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        renderReplies()
    }, [])
    return (
        <div style={comments}>
            <div className="row">
                <h3 className="col-6">{props.server}@{props.username}</h3>
                <h3 className="col-6">{props.createdAt}</h3>
                <p className="col-12">{props.content}</p>
                <div className="col">
                {logged && <h3 onClick={addReply} className="col-6">Reply</h3>}
                <form className={"form-group " + replyBox} onSubmit={submitReply}>
                    <div className="form-group">
                        <textarea placeholder="Enter Reply" onChange={handleReply} value={reply} type="text" className="form-control"/>
                    </div>
                    <button type="submit" className="btn btn-dark">Send</button>
                </form>
                {
                    commentData && commentData.map((comment) =>
                        <Comment postID={props.postID} key={comment._id} parentCommentID={comment._id} childComments={comment.children}  content={comment.commentContent} server={comment.server} username={comment.username} createdAt={comment.createdAt} />
                    )
                }
                </div>
            </div>
        </div>
    )
}

const comments = {
    paddingLeft: "5px",
    borderLeft: "solid 2px black",
    fontSize: "0.75rem",
    marginLeft: "10px"
}

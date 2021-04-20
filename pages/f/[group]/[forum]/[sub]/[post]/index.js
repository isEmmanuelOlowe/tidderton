import Layout from '../../../../../../components/layout';
import styles from '../../../../../../styles/Post.module.css';
import Comment from '../../../../../../components/comment';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import {parseCookies} from 'nookies';

export default function post() {
    const router = useRouter();
    const {group, forum, sub, post} = router.query;
    const [postData, setPost] = useState();
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState("");
    const [commentAdded, setCommentAdded] = useState({});
    const [replies, setReplies] = useState();
    const [logged, setLogged] = useState();
    const handleComment = (e) => {
        setCommentError("");
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment === "") {
            setCommentError("is-invalid")
        }
        else {
            try {
                const { userId, username } = parseCookies();
                const data = {
                    "path": "/api/posts/" + post + "/comments",
                    "type": "post",
                    "userId": userId,
                }
                let headersData = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data });
                let res = await axios.post("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/posts/" + post + "/comments", {username, userId, commentContent: comment });
                setCommentAdded({})
                setComment("");
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    const fetchData = async () => {
        try {
            const data = {
                "path": "/api/posts/" + post,
                "type": "get",
                "userId": "-1"
            }
            const data2 = {
                "path": "/api/posts/" + post + "/comments",
                "type": "get",
                "userId": "-1"
            }
            let headersData = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data });
            let headersData2 = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data2 });
            let res = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/posts/" + post, { headers: headersData.data });
            let res2 = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/posts/" + post + "/comments", {headers: headersData2.data});
            setReplies(res2.data._embedded.commentList);
            console.log(res2.data._embedded.commentList);
            res.data.total = res.data.upvotes - res.data.downvotes;
            console.log(res.data);
            setPost(res.data);
            const { token } = parseCookies();
            if (token) {
                setLogged(true);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (router.asPath !== router.route) {
            fetchData();
        }
    }, [router]);

    return (
        <Layout>
            <div className="container">
                <div className={styles.post + " " + styles.individual}>
                    <div className="row">
                        <div className={styles.votes + " col-1"} >
                            <div className="row">
                                {/* <div onClick="" className={"col-2 col-md-12 " + styles.vote + " " + upvote}>Up</div> */}
                                <div className="col-4 col-md-12">{postData && postData.total}</div>
                                {/* <div onClick="" className={"col-2 col-md-12 " + styles.vote + " " + downvote}>Down</div> */}
                            </div>
                        </div>
                        <div className="col-11">
                            <div className={styles.postContent + " row"}>
                                <h3 className="col-4">g/{group}</h3>
                                <h3 className="col-4">Post By {postData && postData.username}@{group}</h3>
                                <h3 className="col-4">{postData && postData.createdTime}</h3>
                                <h1 className="col-12">{postData && postData.postTitle}</h1>
                            </div>
                            <div className={styles.postTest}>
                                <p>{postData && postData.postContents}</p>
                            </div>
                        </div>
                    </div>
                </div>
                { logged && <form onSubmit={handleSubmit}>
                    <div className={styles.addComment + " form-group"}>
                        <div className="form-row align-items-center">
                            <div className="col-10">
                                <label className="sr-only" for="inlineFormInput">Comment</label>
                                <textarea type="text" value={comment} onChange={handleComment} className={"form-control mb-2 " + commentError} id={styles.commentBox} placeholder="Comment" />
                                <div className="invalid-feedback">
                                    Can't have empty comment.
                                    </div>
                            </div>
                            <div className="col-2">
                                <button type="submit" id={styles.commentButton} className="btn mb-2">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>}
                {
                    replies && replies.map((reply) =>
                    <div>
                        <div className="row">
                                <h5 style={{ color: "cc8e35"}} className="col-3">{reply.username}</h5>
                            <h5 className="col-3">{reply.createdTime}</h5>
                        </div>
                        <p>{reply.commentContent}</p>
                    </div>
                    )
                }

            </div>
        </Layout>
    )
}
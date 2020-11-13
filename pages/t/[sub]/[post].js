import { useEffect, useState } from 'react';
import axios from 'axios';
import Router, {useRouter} from 'next/router';
import Layout from '../../../components/layout'
import Comment from '../../../components/comment';
import styles from '../../../styles/Post.module.css';
import stylesSub from '../../../styles/Sub.module.css';
import Link from 'next/link';
import { parseCookies } from 'nookies';

export default function Post() {
    const router = useRouter();
    const {post} = router.query;
    const {sub} = router.query;
    const [postData, setPost] = useState({})
    const [subData, setSub] = useState({title: ""});
    const [notExists, setNotExists] = useState(false);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState("");
    const [commentAdded, setCommentAdded] = useState({});
    const fetchPost = async () => {
        try {
            let res = await axios.get(process.env.BACKEND_HOST + '/posts/' + post);
            res.data.noComments = res.data.comments.length
            res.data.count = res.data.votes.upvotes.length - res.data.votes.downvotes.length;
            setPost(res.data)
            if (res.data.sub === sub) {
                let res = await axios.get(process.env.BACKEND_HOST + '/sub', {params :{title: sub}});
                res.data.noMembers = res.data.members.length
                setSub(res.data);
            }
            else {
                throw err
            }
            setNotExists(false);
        }
        catch (err) {
            setNotExists(true);
        }
    }
    
    useEffect(() => {
        if (router.asPath !== router.route) {
            fetchPost();
        }
    }, [router, commentAdded])

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment === "") {
            setCommentError("is-invalid")
            console.log("gere")
        }
        else {
            try {
                const {token} = parseCookies();
                let res = await axios.post(process.env.BACKEND_HOST + '/posts/addComment', {token, postID: postData._id, comment})
                setCommentAdded({})
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <Layout notExists={notExists} heading={postData.title}>
            <div className={styles.sub + " container-fluid"}>
                Back to <Link href={"/t/" + postData.sub}><a>t/{postData.sub}</a></Link>
            </div>
            <div className={styles.container + " container"}>
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <div className={styles.post}>
                            <div className="row">
                                <div className={styles.votes + " col-1"} >
                                    <div className="row">
                                        <div className="col-2 col-md-12">Up</div>
                                        <div className="col-4 col-md-12">{postData.count}</div>
                                        <div className="col-2 col-md-12">Down</div>
                                    </div>
                                </div>
                                <div className="col-11">
                                    <div className={styles.postContent + " row"}>
                                        <h3 className="col-4">t/{postData.sub}</h3>
                                        <h3 className="col-4">Post By {postData.user && postData.user.server}@{postData.user && postData.user.username}</h3>
                                        <h3 className="col-4">{postData.createdAt}</h3>  
                                        <h1 className="col-12">{postData.title}</h1>
                                    </div>
                                    <div className={styles.postTest}>
                                        <p>{postData.body}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.addComment + " form-group"}>
                                <div className="form-row align-items-center">
                                    <div className="col-10">
                                    <label className="sr-only" for="inlineFormInput">Comment</label>
                                    <input type="text" value={comment} onChange={handleComment} className={"form-control mb-2 " + commentError} id={styles.commentBox} placeholder="Comment"/>
                                    <div className="invalid-feedback">
                                        Can't have empty comment.
                                    </div>
                                    </div>
                                    <div className="col-2">
                                        <button type="submit" id={styles.commentButton} className="btn mb-2">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className={styles.indicators + " col-12"}>
                            <div className={styles.indicator}>Comments: {postData.noComments}</div>
                            {
                                postData.comments && postData.comments.map((comment) =>
                                    <Comment _id={comment.id} body={comment.body}server={comment.server} username={comment.username} createdAt={comment.createdAt}/>
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.info + " col-12 col-lg-4"}>
                    <div className={stylesSub.about}>
                            <h2>About Community</h2>
                            <p>{subData.description}</p>
                            <div className="row">
                                <div className="col-4 col-lg-12">
                                    <h3>members</h3>
                                    <p>{subData.noMembers}</p>
                                </div>
                                <div className=" col-4 col-lg-12">
                                    <h3>Tidder Age</h3>
                                    <p>234 days</p>
                                </div>
                                <div className="col-4 col-lg-12">
                                    <h3>Owner</h3>
                                    <p>{subData.owner && subData.owner.server}@{subData.owner && subData.owner.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
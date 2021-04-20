import styles from '../styles/Post.module.css';
import axios from 'axios';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import {parseCookies} from 'nookies';

export default function Post(props) {
    const [postData, setPost] = useState({})
    const [notExists, setNotExists] = useState(false);
    const [votes, setVotes] = useState(0);
    const [upvote, setUpvote] = useState(styles.voteInactive);
    const [downvote, setDownvote] = useState(styles.voteInactive);

    const addUpvote = async () => {
        try {
            const { token } = parseCookies();
            let res = await axios.post(process.env.BACKEND_HOST + '/posts/upvote/', { token, id: postData._id });
            console.log(res.data);
            res.data = res.data.post;
            res.data.count = res.data.votes.upvotes.length - res.data.votes.downvotes.length;
            // console.log(res.data.count);

            if (votes > res.data.count) {
                setUpvote(styles.voteInactive);
            }
            else {
                setUpvote(styles.voteActive);
            }
            setVotes(res.data.count);
            setDownvote(styles.voteInactive);
        }
        catch (err) {
            console.log(err);
        }
    }

    const addDownvote = async () => {
        try {
            const { token } = parseCookies();
            let res = await axios.post(process.env.BACKEND_HOST + '/posts/downvote/', { token, id: postData._id });
            res.data = res.data.post;
            res.data.count = res.data.votes.upvotes.length - res.data.votes.downvotes.length;
            setVotes(res.data.count);
            if (votes < res.data.count) {
                setDownvote(styles.voteInactive);
            }
            else {
                setDownvote(styles.voteActive);
            }
            setUpvote(styles.voteInactive);
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchPost = async () => {
        try {
            let res = await axios.get(process.env.BACKEND_HOST + '/posts/' + props.postID);
            res.data = res.data.post
            res.data.noComments = res.data.comments.length
            res.data.count = res.data.votes.upvotes.length - res.data.votes.downvotes.length;
            setPost(res.data)
            setVotes(res.data.count);
            setNotExists(false);
            const { username } = parseCookies();

            if (res.data.votes.upvotes.some(user => user.server === "tidder" && user.username === username)) {
                setUpvote(styles.voteActive);
            }
            else if (res.data.votes.downvotes.some(user => user.server === "tidder" && user.username === username)) {
                setDownvote(styles.voteActive);
            }
        }
        catch (err) {
            console.log(err)
            setNotExists(true);
        }
    }

    useEffect(() => {
        fetchPost();
    }, []);
    
    return (
        <div className={styles.post + " " +styles.individual}>
        <div className="row">
            <div className={styles.votes + " col-1"} >
                <div className="row">
                    <div onClick={addUpvote} className={"col-2 col-md-12 " + styles.vote + " " + upvote}>Up</div>
                    <div className="col-4 col-md-12">{votes}</div>
                    <div onClick={addDownvote} className={"col-2 col-md-12 " + styles.vote + " "  + downvote}>Down</div>
                </div>
            </div>
            <div className="col-11">
                <div className={styles.postContent + " row"}>
                    <h3 className="col-4">t/{postData.sub}</h3>
                    <h3 className="col-4">Post By {postData.user && postData.user.server}@{postData.user && postData.user.username}</h3>
                    <h3 className="col-4">{postData.createdAt}</h3>
                    <Link href={'/t/' + postData.sub + '/' + postData._id}><a><h1 className="col-12">{postData.title}</h1></a></Link> 
                </div>
                <div className={styles.postTest}>
                    <p>{postData.body}</p>
                </div>
            </div>
        </div>
    </div>
    )
}
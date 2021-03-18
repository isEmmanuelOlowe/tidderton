import styles from '../styles/Post.module.css';
import axios from 'axios';
import Link from 'next/link';
import {useState, useEffect} from 'react';

export default function Post(props) {
    const [postData, setPost] = useState({})
    const [notExists, setNotExists] = useState(false);

    const upvote = async () => {
        // let res = await.get(process.env.BACKEND_HOST + '/posts/' + + props.postID + '')
        // let res = await axios.post(process.env.BACKEND_HOST);
    }

    const downvote = async () => {

    }

    const fetchPost = async () => {
        try {
            let res = await axios.get(process.env.BACKEND_HOST + '/posts/' + props.postID);
            res.data.noComments = res.data.comments.length
            res.data.count = res.data.votes.upvotes.length - res.data.votes.downvotes.length;
            setPost(res.data)
            setNotExists(false);
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
                    <div onClick={upvote} className={"col-2 col-md-12 " + styles.vote}>Up</div>
                    <div className="col-4 col-md-12">{postData.count}</div>
                    <div onClick={downvote} className={"col-2 col-md-12 " + styles.vote}>Down</div>
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
import Layout from '../../../components/layout';
import Post from '../../../components/post';
import axios from 'axios';
import {useRouter} from 'next/router';
import styles from '../../../styles/Sub.module.css';
import {useEffect, useState} from 'react';
import { parseCookies } from 'nookies';

export default function Sub() {
    const router = useRouter();
    const [subData, setSub] = useState({title: ""});
    const [notExists, setNotExists] = useState(false);
    const [btnType, setBtnType] = useState("d-none");
    const [serverStatus, setServerStatus] = useState("Join");
    const [isMember, setIsMember] = useState(false);
    const [noMembers, setMembers] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const {sub} = router.query;

    
    const fetchSub = async () => {
        try {
            let res = await axios.get(process.env.BACKEND_HOST + '/sub', {params :{title: sub}});
            setMembers(res.data.members.length);
            checkJoinedStatus(res.data.title);
            setSub(res.data);
            setNotExists(false);
        }
        catch{
            setNotExists(true)
        }
    }

    const checkJoinedStatus = async (title) => {
        try {
            const { token } = parseCookies();
            let res = await axios.get(process.env.BACKEND_HOST + "/sub/status", {params : {token, title}} );
            if (res.data.status) {
                setBtnType("btn-success");
                setServerStatus("Joined");
            }
            else {
                setBtnType("btn-warning");
                setServerStatus("Join");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const memberStatus = async () => {
        const { token } = parseCookies();
        if (serverStatus === "Join") {
            try {
                let res = await axios.post(process.env.BACKEND_HOST + "/sub/join", {token, title: subData.title});
                if (res.data.joined) {
                    setMembers(noMembers + 1);
                    setBtnType("btn-success");
                    setServerStatus("Joined");
                    v
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            let res = await axios.post(process.env.BACKEND_HOST + "/sub/leave", {token, title: subData.title});
            if (res.data.left) {
                setMembers(noMembers - 1);
                setBtnType("btn-warning");
                setServerStatus("Join");
            }
        }
    }

    useEffect(() => {
        if (router.asPath !== router.route) {
            fetchSub();
        }
    }, [router]);

    return (
        <Layout notExists={notExists} heading={"t/" + subData.title}>
            <div className={styles.sub + " align-middle"}>
            </div>
            <div className={styles.heading + " container"}>
                <div className = "row">
                    <img src="/logo.png"/>
                    <div className="col">
                        <h1 className="md-4">t/{subData.title}</h1>
                        <button onClick={memberStatus} type="mr-1" className={"btn " + btnType}>{serverStatus}</button>
                    </div>
                </div>
            </div>
            <div className={styles.posts + " container"}>
                <div className="row">
                <div className="col-lg-4 order-lg-1">
                        <div className={styles.about}>
                            <h2>About Community</h2>
                            <p>{subData.description}</p>
                            <div className="row">
                                <div className="col-4 col-lg-12">
                                    <h3>members</h3>
                                    <p>{noMembers}</p>
                                </div>
                                <div className=" col-4 col-lg-12">
                                    <h3>Tidder Age</h3>
                                    <p>{subData.createdAt}</p>
                                </div>
                                <div className="col-4 col-lg-12">
                                    <h3>Owner</h3>
                                    <p>{subData.owner && subData.owner.server}@{subData.owner && subData.owner.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        {
                            subData.posts && subData.posts.map((postID) => (
                                <Post key={postID} postID={postID}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}
import Layout from '../../../components/layout';
import Post from '../../../components/post';
import axios from 'axios';
import {useRouter} from 'next/router';
import styles from '../../../styles/Sub.module.css';
import {useEffect, useState} from 'react';

export default function Sub() {
    const router = useRouter();
    const [subData, setSub] = useState({title: ""});
    const [notExists, setNotExists] = useState(false);
    const {sub} = router.query;

    
    const fetchSub = async () => {
        try {
            let res = await axios.get(process.env.BACKEND_HOST + '/sub', {params :{title: sub}});
            res.data.noMembers = res.data.members.length
            setSub(res.data);
            setNotExists(false);
        }
        catch{
            setNotExists(true)
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
                    <h1 className="md-4">t/{subData.title}</h1>

                    <button type="sm-6 float-right button" class="btn btn-primary">Joined</button>
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
                                    <p>{subData.noMembers}</p>
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
                                <Post postID={postID}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}
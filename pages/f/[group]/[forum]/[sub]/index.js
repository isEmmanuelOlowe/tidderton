import Layout from '../../../../../components/layout';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';


export default function sub() {
    const router = useRouter();
    const { group, forum, sub } = router.query;
    const [subs, setSub] = useState();
    const [posts, setPosts] = useState();

    const fetchData = async () => {
        try {
            const data = {
                "path": "/api/subforums/" + sub,
                "type": "get",
                "userId": "-1"
            }
            const data2 = {
                "path": "/api/subforums/" + sub + "/posts",
                "type": "get",
                "userId": "-1"
            }

            let headersData = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data });
            let headersData2 = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data2 });
            let res = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/subforums/" + sub, { headers: headersData.data });
            let res2 = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/subforums/" + sub + "/posts", {headers: headersData2.data})
            console.log(res.data);
            console.log(res2.data);
            setSub(res.data);
            setPosts(res2.data._embedded.postList);
        } 
        catch(err) {

        }
    }

    useEffect(() => {
        if (router.asPath !== router.route) {
            fetchData();
        }
    }, [router]);

    return (
        <Layout>
        <br/>
        <br/>
        <div className="container">
                <h1> You have found Youself in: <span style={{ color: "#cc8e35"}}>{subs && subs.subforumName}</span></h1>
            <h3>Community Posts: </h3>
            <div className="row">
                    {
                        posts && posts.map((post) => (
                            <div style={{ backgroundColor: "#2c2c54", borderRadius: "15px", margin: "5px" }} className="col-5">
                                <h2>
                                    <Link href={"/f/" + group + "/" + forum + "/" + sub + "/" + post.id}><a><h2 style={{ color: "#cc8e35" }}>{post.postTitle}</h2></a></Link>
                                </h2>
                                <p>{forum.sub}</p>
                            </div>
                        ))
                    }
            </div>
        </div>
        </Layout>
    )
}
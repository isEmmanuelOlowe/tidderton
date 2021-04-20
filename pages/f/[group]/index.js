import {useState, useEffect} from 'react';
import Layout from '../../../components/layout';
import axios from 'axios';
import {useRouter} from 'next/router';
import Link from 'next/link';
export default function group() {
    const router = useRouter();
    const {group} = router.query;
    const [forums, setForums] = useState();

    const fetchData = async () => {
        try {
            const data = {
                "path": "/api/forums",
                "type": "get",
                "userId": "-1",
            }
            let headersData = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', {params: data});
            let res = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/forums", {headers: headersData.data});
            setForums(res.data._embedded.forumList);
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
            <br/>
            <br/>
            <h1>Welcome to {group}'s Forums</h1>
            <div className="row">
                {
                    forums && forums.map((forum) => (
                        <div style={{ backgroundColor: "#2c2c54", borderRadius: "15px", margin: "5px" }} className="col-5">
                        <h2>
                                <Link href={"/f/" + group + "/" + forum.id}><a><h2 style={{color: "#cc8e35"}}>{forum.forumName}</h2></a></Link>
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
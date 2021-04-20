import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../../../components/layout';
import Link from 'next/link';
export default function forum () {
    const router = useRouter();
    const { group, forum } = router.query;
    const [forumData, setForum] = useState([])
    const fetchData = async () => {
        try {
            const data = {
                "path": "/api/forums/" + forum,
                "type": "get",
                "userId": "-1",
            }

            const data2 = {
                "path": "/api/forums/" + forum + "/subforums",
                "type": "get",
                "userId": "-1",
            }
            let headersData = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data });
            let headersData2 = await axios.get(process.env.BACKEND_HOST + '/signatures/sign', { params: data2 });
            let res = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/forums/" + forum, { headers: headersData.data });
            let res2 = await axios.get("https://cs3099user-" + group + ".host.cs.st-andrews.ac.uk/api/forums/" + forum + "/subforums", { headers: headersData2.data });
            console.log(res.data);
            console.log(res2.data._embedded);
            const dataNew = {
                name: res.data.forumName,
                subForums: res2.data._embedded.subforumList,
            }
            setForum(dataNew);
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
                <h1>{forumData.name} by <Link href={"/f/" + group}><a>{group}</a></Link></h1>
                <div className="row">
                    {
                        forumData.subForums && forumData.subForums.map((subForum) => (
                            <div style={{ backgroundColor: "#2c2c54", borderRadius: "15px", margin: "5px" }} className="col-5">
                                <h2>
                                    <Link href={"/f/" + group + "/" + forum + "/" + subForum.id}><a><h2 style={{ color: "#cc8e35" }}>{subForum.subforumName}</h2></a></Link>
                                </h2>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}
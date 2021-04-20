import Layout from '../../components/layout';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function query() {

    const [subs, setSubs] = useState();
    const fetchData = async () => {
        try {
            let res = await axios.get(process.env.BACKEND_HOST + "/sub/allSubs/");
            console.log(res.data);
            if (!(res.data.length === 0)) {
                setSubs(res.data);
            }
            else {
                setSubs(false);
            }
        }
        catch (err) {

        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Layout heading={"Search"}>
            <br />
            <br />
            <div className="container">
                <h1>
                    Search results for: {query}
                </h1>
                {
                    !subs && <h1>Found Nothing</h1>
                }
                {subs && subs.map((sub) =>
                    <div style={{ backgroundColor: "#2c2c54", borderRadius: "5px", padding: "10px", margin: "5px" }}>
                        <Link href={"/t/" + sub.title}><a><h2 style={{ color: "#cc8e35" }}>t/{sub.title}</h2></a></Link>
                    </div>
                )}
            </div>
        </Layout>
    )
}
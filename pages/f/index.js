import Layout from '../../components/layout';
import styles from '../../styles/Sub.module.css';
import Link from 'next/link';
export default function Friends() {
    const groups = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11"];
    return (
        <Layout heading="Friends">
            <div className="container">
                <br/>
                <br/>
                <h1>Servers we are sad to know:</h1>
                <div className="row">
                {
                    groups.map((group) => (
                        <div style={{ backgroundColor: "#2c2c54", borderRadius: "15px", margin: "5px"}} className="col-5">
                            <Link href={"f/" + group}><a className={styles.sub}><h2 style={{ color: "#cc8e35"}}>f/{group}</h2></a></Link>
                        </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}
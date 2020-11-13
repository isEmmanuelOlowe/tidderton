import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Layout from '../components/layout'
import Router from 'next/router';
import styles from '../styles/Home.module.css'
import {parseCookies} from 'nookies';
export default function Home() {
  
  const [username, setUsername] = useState("");
  const [subs, setSubs] = useState([])
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(async () => {
    const {username} = parseCookies();
    if (username) {
      setUsername(username);
      try {
        let res = await axios.get(process.env.BACKEND_HOST + '/users/findUserSub', {params :{username: username}});
        setSubs(res.data.subscriptions);
        console.log(res.data.subscriptions);
      }
      catch (err){
        console.log(err);
      }
    }
  }, []);

  return (
    <Layout heading="The front page">
      <main>
        <div className="container">
          <div className="row">
            <div style={{backgroundColor: "#2c2c54", borderRadius: "5px", marginTop: "50px", padding: "15px"}} className="col-lg-9">
                <h1>Hello {username}</h1>
              <p>Welcome to tidderton a decentralised forum </p>
            </div>
            <div style={{backgroundColor: "#2c2c54", borderRadius: "5px", marginTop: "50px", padding: "15px"}} className="d-none d-lg-block col-lg-2 offset-lg-1">
              <h6>Popular Communities</h6>
              <hr style={{marginTop: "-1px", height:"1.6px", borderWidth:"0", color:"gray", backgroundColor:"gray"}}/>
              <Link href="/t/general"><a className={styles.sub}>t/General</a></Link>
              <Link href="/t/Tidder Forever"><a className={styles.sub}>t/Tidder Forever</a></Link>
              <br/>
              {sub => (<h6>Your Subs</h6>)}
              {sub => (<hr style={{marginTop: "-1px", height:"1.6px", borderWidth:"0", color:"gray", backgroundColor:"gray"}}/>)}
                {
                  subs.map((sub) => (
                      <Link href={"/t/" + sub.sub}><a className={styles.sub}>t/{sub.sub}</a></Link>
                  ))
                }
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

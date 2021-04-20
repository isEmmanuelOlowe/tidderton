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
  const [loggedIn, setLogged] = useState(false);
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(async () => {
    const {username} = parseCookies();
    if (username) {
      setUsername(username);
      try {
        let res = await axios.get(process.env.BACKEND_HOST + '/users/findUserSub', {params :{username: username}});
        setSubs(res.data.subscriptions);
        setLogged(true);
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
                <p>Welcome to Tidderton!</p>
                <p>The best decentralised forum on the Internet. Don't check out Friends and Family because this is the best it gets ;) </p>
              {loggedIn && <div>
                <h2>Bitcoin Giveaway!!!</h2>
                <p>Congratulations {username}!!! You have qualified to recieve free bitcoin. Send us 1 BTC and we will send you back 2 BTC. We are doubling your money send bitcoin to 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 now!!!.</p>
              </div>}
            </div>
            <div style={{backgroundColor: "#2c2c54", borderRadius: "5px", marginTop: "50px", padding: "15px"}} className="d-none d-lg-block col-lg-2 offset-lg-1">
              {/* <Link href="/t/general"><a className={styles.sub}>t/general</a></Link>
              <Link href="/t/Tidder Forever"><a className={styles.sub}>t/Tidder Forever</a></Link> */}
              {loggedIn && <h6>Your Subs</h6>}
              {loggedIn && <hr style={{marginTop: "-1px", height:"1.6px", borderWidth:"0", color:"gray", backgroundColor:"gray"}}/>}
              {
                subs.map((sub) => (
                  <div>
                    <Link href={"/t/" + sub.sub}><a className={styles.sub}>t/{sub.sub}</a></Link>
                  </div>
                ))
              }
              {loggedIn && <br/>}
              <h6>Popular Communities</h6>
              <hr style={{marginTop: "-1px", height:"1.6px", borderWidth:"0", color:"gray", backgroundColor:"gray"}}/>
                <Link href={"/t/general"}><a className={styles.sub}>t/general</a></Link>
                <Link href={"/t/tidder4ever"}><a className={styles.sub}>t/tidder4ever</a></Link>
              <br></br>
              <Link href="/f"><a><h6 style={{ color: "#cc8e35"}}>Friends & Family</h6></a></Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

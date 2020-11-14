import {useState, useEffect} from 'react';
import Layout from '../../../components/layout';
import Post from '../../../components/post';
import axios from 'axios';
import {useRouter} from 'next/router';

export default function User() {
  const router = useRouter();
  const {user} = router.query;
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [notExists, setNotExists] = useState(false);

  const fetchUser = async () => {
    try {
      let res = await axios.get(process.env.BACKEND_HOST + '/users/findUser', {params :{username: user}});
      setUsername(user);
      setPosts(res.data.posts);
      setNotExists(false);
    }
    catch (err){
      console.log(err);
      setNotExists(true)
    }
}

useEffect(() => {
    if (router.asPath !== router.route) {
        fetchUser();
    }
}, [router]);

  return (
    <Layout notExists={notExists} heading={username}>
      <div className="container">
        <div className="row align-items-center" style={{backgroundColor: "#2c2c54", padding: "20px", marginTop: "50px", borderRadius: "5px"}}>
          <img className="d-inline-block align-center col-2" style={{width:"10vw"}} src="/user.png/"/>
          <h1 style={{fontSize: "2rem"}} className="offset-1">tidder@{username}</h1>
        </div>
        {
                posts.map((postID) => (
                    <Post postID={postID.postID}/>
                ))
            }
      </div>
    </Layout>
  )
}

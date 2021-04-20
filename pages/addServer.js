import Layout from '../components/layout';
import {useEffect, useState} from 'react';

export default function addServer() {
    const [server, setServer] = useState("");
    const [password, setPassword] = useState("");

    const handleServer = (e) => {
        setServer(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = () => {
        e.preventDefault();
    }
    return (
        <Layout heading="Add Server">
            <div className="container">
                <br/>
                <br/>
                <form onSubmit={handleSubmit}>
                    <div class="form-group">
                        <label for="serverURL">Server URL</label>
                        <input type="url" class="form-control" onChange={handleServer} value={server} id="exampleInputEmail1" aria-describedby="urlHelp" placeholder="Enter Server URL"/>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" onChange={handlePassword} value={password} id="exampleInputPassword1" placeholder="Password"/>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
            </div>
        </Layout>
    )
}
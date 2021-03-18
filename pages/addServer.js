import Layout from '../components/layout';
import {useEffect, useState} from 'react';

export default function addServer() {
    return (
        <Layout heading="Add Server">
            <div className="container">
                <br/>
                <br/>
                <form>
                    <div class="form-group">
                        <label for="serverURL">Server URL</label>
                        <input type="url" class="form-control" id="exampleInputEmail1" aria-describedby="urlHelp" placeholder="Enter Server URL"/>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
                        <label class="form-check-label" for="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
            </div>
        </Layout>
    )
}
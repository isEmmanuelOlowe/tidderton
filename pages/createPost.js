import Layout from "../components/layout";
import axios from 'axios';
import {parseCookies} from 'nookies';
import {useEffect, useState} from 'react';
import Router from "next/router";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");
    const [post, setPost] = useState("");
    const [postError, setPostError] = useState("");
    const [valid, setValid] = useState("");
    const [subname, setSubname] = useState("");
    const [disable, setDisable] = useState("");
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(async () => {
        const {token} = parseCookies();
        try {
            const res = await axios.get(process.env.BACKEND_HOST + '/users/subscriptions/', {params: {token}});
            setSubscriptions(res.data)
        }
        catch (err) {
            console.log(err)
        }
    }, []);


    const handleTitle = (e) => {
        setTitle(e.target.value);
        if (e.target.value !== "") {
            setTitleError("");
            if (post !== "" && subname !== "") {
                setDisable("");
            }
        }
        else {
            setTitleError("is-invalid");
            setDisable("disabled");
        }
    }

    const handlePost = (e) => {
        setPost(e.target.value);
        if (e.target.value !== "") {
            setPostError("");
            if (title !== "" && subname !== "") {
                setDisable("");
            }
        }
        else {
            setPostError("is-invalid");
        }       
    }

    const handleSubname = (e) => {
        setSubname(e.target.value);
        setValid("");
        if (post !== "" && post !== "") {
            setDisable("");
        }
    }

    const handleSubmit = async (e) => {
        let error = false;
        e.preventDefault();
        const {token} = parseCookies();
        console.log(subname);
        if (title === "") {
            setTitleError("is-invalid");
            error = true;
        }
        if (subname === "") {
            setValid("is-invalid");
            error = true;
        }
        if (post === "") {
            setPostError("is-invalid");
            error = true;
        }
        if (!error) {
            try {
                const res = await axios.post(process.env.BACKEND_HOST + '/posts/addPost', {token, title, post, sub: subname.split("::")[1]});
                Router.push("/t/" + subname.split("::")[1] + '/' + res.data.postID);
            }
            catch (err) {
                console.log(err);
            }   
        }
        else {
            setDisable("disabled");
        }
    }

    return (
        <Layout heading="Create a Post">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="TitleHeading">Title:</label>
                        <input type="text" className={"form-control " + titleError} id="postTitle" value={title} onChange={handleTitle} placeholder="Make a title"/>
                        <div className="invalid-feedback">
                          Title can't be blank
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ChooseSub">Choose a Sub: </label>
                        <select value={subname} onChange={handleSubname} className={"form-control " + valid} id="subSelect">
                            <option value="" selected disabled hidden>Choose a sub</option>
                            {subscriptions.map(sub => (
                                <option>{sub.server}::{sub.sub}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                          You can only post to subs
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Create Post:</label>
                        <textarea className={"form-control " + postError} id="exampleFormControlTextarea1" value={post} onChange={handlePost} rows="8"></textarea>
                        <div className="invalid-feedback">
                            You can't have blank posts
                        </div>
                    </div>
                    <button disabled={disable} type="submit" className="btn btn-dark">Post</button>
                </form>
            </div>
        </Layout>
    )
}
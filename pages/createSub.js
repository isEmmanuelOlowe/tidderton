import Layout from '../components/layout';
import axios from 'axios';
import {useState} from 'react';
import {parseCookies} from 'nookies';
import Router from 'next/router';


export default function CreateSub() {
    const [subName, setSubName] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [error, setError] = useState("");
    const [valid, setValid] = useState("");
    const [disableButton, setDisabled]  = useState("");

    const subNameClean = () => {
        setError("");
        setValid("");
        setDisabled("");
    }

    const subNameError = (message) => {
        setError(message);
        setValid("is-invalid");
        setDisabled("disabled");
    }
    
    const handleSubNameChange = async (e) => {
        setSubName(e.target.value);
        //Perform some validation upon entered values
        let usernameRegex = /^[a-zA-Z0-9\-\=\_\$]+$/;
        if (e.target.value !== "" && !e.target.value.match(usernameRegex)) {
          subNameError("Your subname is not valid. Only characters A-Z, a-z, digits 0-9, Special Characters (=, -, _ $) and '-' are  acceptable.!")
        }
        else if (e.target.value !== ""){
          try {
            let res = await axios.get(process.env.BACKEND_HOST + '/sub/subname/' + e.target.value)
            if (res.data.message === "sub exists") {
                subNameError("Subname is taken")
            }
            else {
              subNameClean();
            }
          }
          catch (err) {
            subNameClean();
          }
        }
        else {
          subNameClean()
        }
      }

    const handleDescriptionChnage =(e) => {
        setDescription(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let error = false;
        if (subName === "") {
            setValid("is-invalid");
            subNameError("Your subname is not valid. Only characters A-Z, a-z, digits 0-9, Special Characters (=, -, _ $) and '-' are  acceptable.!")
            error = true;
        }
        if (description === "") {
            setDescriptionError("is-invalid");
            error = true;
        }
        if (!error) {
            try {
                const cookies = parseCookies();
                const token = cookies.token;
                let res = await axios.post(process.env.BACKEND_HOST + '/sub/create', {token, subName: subName.toLowerCase(), description})
                if (res.data.message === "added") {
                    Router.push("/t/" + subName.toLowerCase());
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            setDisabled("disabled");
        }
    }

    return(
        <Layout heading="Create A Sub">
            <div className="container">
                <h1>Create a New Sub</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="col-auto">
                            <label className="sr-only" for="inlineFormInputGroup">Name</label>
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">t/</div>
                                    </div>
                                    <input type="text" className={"form-control " + valid} value={subName} onChange={handleSubNameChange}id="inlineFormInputGroup" placeholder="Sub Name"/>
                                    <div className="invalid-feedback">
                                        {error}
                                    </div>
                                </div>
                            </div>
                            <div className="col-auto">
                                <label htmlFor="comment">Description:</label>
                                <textarea className={"form-control " + descriptionError} rows="5" value={description} onChange={handleDescriptionChnage} id="description"></textarea>
                                <div className="invalid-feedback">
                                    Can't have a blank post.
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-dark mb-2" disabled={disableButton}>Submit</button>
                        </div>
                </form>
            </div>
        </Layout>
    ); 
}
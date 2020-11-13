import Layout from '../components/layout';
import axios from 'axios';
import Router from 'next/router';
import React from 'react';
import {setCookie} from 'nookies';

export default class Login extends React.Component {
  state = {
    username: "",
    email: "",
    password1: "",
    password2: "",
    usernameError: "",
    emailError: "",
    password1Error: "",
    paassword2Error: "",
    inValidUsername: "",
    inValidEmail: "",
    inValidPassword1: "",
    invalidPassword2: "",
    buttonDisable: "",
  }

  userNameClean = () => {
    this.setState({usernameError: ""});
    this.setState({inValidUsername: ""});
    this.setState({buttonDisable: ""})
  }
  
  userNameError = (message) => {
    this.setState({usernameError: message});
    this.setState({inValidUsername: "is-invalid"});
    this.setState({buttonDisable: "disabled"})
  }
  //Handles Form input for the Username
  handleUsernameChange = async (e) => {
    this.setState({username: e.target.value});
    //Perform some validation upon entered values
    let usernameRegex = /^[a-zA-Z0-9\-\=\_\$]+$/;
    if (e.target.value !== "" && !e.target.value.match(usernameRegex)) {
      this.userNameError("Your username is not valid. Only characters A-Z, a-z, digits 0-9, Special Characters (=, -, _ $) and '-' are  acceptable.!")
    }
    else if (e.target.value !== ""){
      try {
        let res = await axios.get(process.env.BACKEND_HOST + '/users/username/' + e.target.value)
        if (res.data.message === "user exists") {
          this.userNameError("Username is taken")
        }
        else {
          this.userNameClean();
        }
      }
      catch {
        this.userNameClean();
      }
    }
    else {
      this.userNameClean()
    }
  }

  userEmailClean = () => {
    this.setState({inValidEmail: ""});
    this.setState({emailError: ""});
    this.setState({buttonDisable: ""});
  }

  userEmailError = (message) => {
    this.setState({emailError: message});
    this.setState({inValidEmail: "is-invalid"});
    this.setState({buttonDisable: "disabled"})
  }

  handleEmailChange = async (e) => {
    this.setState({email: e.target.value})
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!e.target.value.match(re)) {
      this.userEmailError("Not a Valid Email");
    }
    else if (e.target.value !== ""){
      try {
        let res = await axios.get(process.env.BACKEND_HOST + '/users/email/' + e.target.value)
        if (res.data.message === "user exists") {
          this.userEmailError("E-mail already in use");
        }
        else {
          this.userEmailClean();
        }
      }
      catch {
        this.userEmailClean();
      }
    }
    else {
      this.userEmailClean()
    }
  }

  //Handles Form inpurt for the Password
  handlePassword1Change = (e) => {
    this.setState({password1: e.target.value});
    if (this.state.password1.length < 5) {
      this.setState({inValidPassword1: "is-invalid"})
      this.setState({password1Error: "Password too short"})
      this.setState({buttonDisable: "disabled"})
    }
    else {
      this.setState({inValidPassword1: ""})
      this.setState({password1Error: ""});
      this.setState({buttonDisable: ""})

    }
    //Perform some validation upon entered values
  }

  //Handles Form inpurt for the Password
  handlePassword2Change = (e) => {
    this.setState({password2: e.target.value});
    //Perform some validation upon entered values
    if (e.target.value !== this.state.password1) {
      this.setState({inValidPassword1: "is-invalid"})
      this.setState({inValidPassword2: "is-invalid"})
      this.setState({password2Error: "Passwords do not match"});
      this.setState({buttonDisable: "disabled"})
      
    }
    else {
      this.setState({inValidPassword1: ""});
      this.setState({inValidPassword2: ""});
      this.setState({password2Error: ""});
      this.setState({buttonDisable: ""});
    }
  }

  //The submit initialises a pull request
  handleSubmit = async (e) => {
    //stops page refresh on submit
    e.preventDefault();
    //axios makes a pull request
    //insert the localhost:port as in quotation marks
    if (this.state.usernameError === "" && this.state.emailError === "" && this.state.password1Error === "" && this.state.paassword2Error === "") {
      const res = await axios.post(process.env.BACKEND_HOST + '/users/signUp', {username: this.state.username, email:this.state.email, password: this.state.password1});
      setCookie({}, 'token', res.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      setCookie({}, 'username', res.data.username, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      Router.push("/");
    }
  }

  render() {
    return (
      <Layout heading="Sign Up">
        <main>
          <div className="container">
            <div style={{minHeight:"94vh"}} className="row align-items-center">
              <div className="col-md-6">
                <h1>Sign Up</h1>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1"> tidder @</span>

                        <style jsx>{`
                            #basic-addon1 {
                              color: black;
                              background-color: #f7f1e3;
                              padding: 5px 5px 5px 10px;
                              letter-spacing:3px;
                            }
                        `}
                        </style>
                        </div>
                        <input type="text" className={"form-control " + this.state.inValidUsername} placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={this.state.username} onChange={this.handleUsernameChange}/>
                        <div className="invalid-feedback">
                          {this.state.usernameError}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                    <label htmlFor="exampleInputEmail">E-mail</label>
                    <input type="email" className={"form-control " + this.state.inValidEmail} placeholder="E-mail" aria-label="Username" aria-describedby="basic-addon1" value={this.state.email} onChange={this.handleEmailChange}/>
                        <div className="invalid-feedback">
                          {this.state.emailError}
                        </div>
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input type="password" className={"form-control " + this.state.inValidPassword1} id="exampleInputPassword1" placeholder="Password" value={this.state.password1} onChange={this.handlePassword1Change}/>
                      <div className="invalid-feedback">
                          {this.state.password1Error}
                      </div>
                      <label htmlFor="exampleInputPassword2">Re-enter Password</label>
                      <input type="password" className={"form-control " + this.state.inValidPassword2} id="exampleInputPassword2" placeholder="Password" value={this.state.password2} onChange={this.handlePassword2Change}/>
                      <div className="invalid-feedback">
                          {this.state.password2Error}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-light" disabled={this.state.buttonDisable}>Sign Up</button>
                  </form>
              </div>
              <div style={verticalLine} className="d-none d-md-block col-md-6 align-items-center">
                <img style={{width:"35vw"}} src="/logo.png"/>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    )
  }
}

const verticalLine = {
  borderLeft: "1px solid gray",
  height: "500px"
}

import Layout from '../components/layout';
import axios from 'axios';
import Router from 'next/router';
import React from 'react';
import {setCookie} from 'nookies';
export default class Login extends React.Component {
  
  state = {
    username: "",
    password: "",
    validity: "",
  }

  cleanValid = () => {
    if (this.state.validity === "is-invalid") {
      this.setState({validity: ""});
    }
  }

  //Handles Form input for the Username
  handleUsernameChange = (e) => {
    this.setState({username: e.target.value});
    this.cleanValid();
    //Perform some validation upon entered values
  }

  //Handles Form inpurt for the Password
  handlePasswordChange = (e) => {
    this.setState({password: e.target.value});
    this.cleanValid();
    //Perform some validation upon entered values
  }

  handleSubmit = async (e) => {
    //stop page refresh on submit
    e.preventDefault();
    //axios makes a pull request
    //insert the localhost:port as in quotation marks
    try {
      let res = await axios.post(process.env.BACKEND_HOST + '/users/sign-in', {username: this.state.username, password: this.state.password});
      if (res.data.username) {
        setCookie({}, 'token', res.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        setCookie({}, 'username', res.data.username, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })
      }
      Router.push("/")
    }
    catch (e) {
      this.setState({validity: "is-invalid"});
    }
  }

  render() {
    return (
      <Layout heading="Log back In">
        <main>
          <div className="container">
            <div style={{minHeight:"94vh"}} className="row align-items-center">
              <div className="col-md-6">
                <h1>Login</h1>
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">tidder @</span>
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
                        <input type="text" className={"form-control "+ this.state.validity} placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={this.state.username} onChange={this.handleUsernameChange}/>
                        <div className="invalid-feedback">
                          Invalid Login
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input type="password" className={"form-control " + this.state.validity} id="exampleInputPassword1" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                    </div>
                    <button type="submit" className="btn btn-light">login</button>
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

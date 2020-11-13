import React from 'react';
import Head from 'next/head';
import Link from "next/link";
import cookies from 'next-cookies'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Router from 'next/router';
import styles from '../styles/Layout.module.css'


function heading(str) {
  if (str) {
    return str + " :";
  }
}

export default class NavBar extends React.Component {
  
  state = {
    navBar: "",
    username: parseCookies().username || '',
    token: parseCookies().token || ''
  }


  handleLogout = (e) => {
    destroyCookie({}, 'username');
    destroyCookie({}, 'token')
    this.setState({username: ""});
    this.setState({token: ""})
    //Perform some validation upon entered values
  }


  //Please chand this cookie get may be a blocking function
  async navbarComponents() {
    try {
      var navItems;
      if (this.state.token !== "") {
        navItems = (<ul className="navbar-nav mr-auto">
        <li id={styles.userTab} className={styles.navDrop + " nav-item dropdown"}>
          <a className="nav-link dropdown-toggle row" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img className="d-inline-block align-self=center" style={{minWidth: "15px", width:"1.5rem", paddingRight:"10px"}} src="/user.png/"/>
            {this.state.username}
          </a>
          <div className={styles.nav +" dropdown-menu"} aria-labelledby="navbarDropdownMenuLink">
            <Link href={"/u/" + this.state.username}><a className={styles.navItem + " dropdown-item"} href=""> Profile</a></Link>
            <Link href="/"><a className={styles.navItem +" dropdown-item"} href="#">Settings</a></Link>
            <Link href="/"><a  className={styles.navItem + " dropdown-item"} onClick = {this.handleLogout}>Logout</a></Link>
          </div>
        </li>
        <li id={styles.userAdd} className={styles.navDrop + " nav-item dropdown"}>
            <a className="nav-link dropdown-toggle row" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            +
            </a>
            <div className={styles.nav +" dropdown-menu"} aria-labelledby="navbarDropdownMenuLink">
              <Link href="/createSub"><a className={styles.navItem + " dropdown-item"} href="">Create a Sub</a></Link>
              <Link href="/createPost"><a className={styles.navItem +" dropdown-item"} href="#">Create a Post</a></Link>
            </div>
          </li>
      </ul>);
      }
      else{
        navItems = (<ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link href="/login"><a className={styles.linkSpace + " nav-link"} >Login</a></Link>
        </li>
        <li className="nav-item">
          <Link href="/signup"><a className={styles.linkSpace + " nav-link"}>Sign Up</a></Link>
        </li>
      </ul> );
      }
      this.state.navItems = navItems;
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    this.navbarComponents()
  return(
    <div>
      <Head>
        <title>{heading(this.props.heading)}tidderton</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"/>
      </Head>

      <nav style={{backgroundColor:"#2c2c54"}} className="navbar navbar-expand-lg navbar-dark">
        <Link href="/"><img className="d-inline-block align-top" style={{width:"2rem"}} src="/logo.png/"/></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {this.state.navItems}
          <form className="form-inline md-form mt-0">
            <input autoComplete="off"  id={styles.navSearch} className="mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
          </form>
        </div>
      </nav>
      <main>
        {this.props.children}
      </main>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossOrigin="anonymous"></script>
    </div>
  )
  }
}
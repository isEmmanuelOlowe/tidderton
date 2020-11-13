import NavBar from './navbar';

export default function NotFound () {
    return (
    <NavBar heading="This page does not exist">
        <div className="container">
            <br/>
            <img style={{width: "30rem"}} src="/user.png"/>
            <br/>
            <br/>
            <h1 style={{color:"black"}}className="jumbotron">Try looking for a page that exists :/</h1>
        </div>
    </NavBar>
    )
}
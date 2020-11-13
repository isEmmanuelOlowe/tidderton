import NavBar from './navbar';

export default function Error () {
    return (
        <NavBar heading="Error Occurred">
            <div className="container">
                <br/>
                <img style={{width: "30rem"}} src="/user.png"/>
                <br/>
                <br/>
                <h1 style={{color:"black"}}className="jumbotron">An error has occured.</h1>
            </div>
        </NavBar>
    )
}
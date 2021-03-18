export default function comment (props) {
    console.log(props)
    return (
        <div style={comments} className="row">
            <h3 className="col-6">{props.server}@{props.username}</h3>
            <h3 className="col-6">{props.createdAt}</h3>
            <p className="col-12">{props.body}</p>
            <h3 className="col-6">Reply</h3>
        </div>
    )
}

const comments = {
    paddingLeft: "5px",
    borderLeft: "solid 2px black",
    fontSize: "0.75rem",
    marginLeft: "10px"
}
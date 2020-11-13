import NavBar from './navbar';
import NotFound from './not-found';
import Error from './error';

export default function Layout(props) {
  if(props.notExists) {
    return <NotFound/>
  }
  else if (props.error) {
    return <Error/>
  }
  else {
    return (<NavBar heading={props.heading}>
              {props.children}
            </NavBar>)
  }
}
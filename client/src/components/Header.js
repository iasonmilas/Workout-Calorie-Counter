import { CurrentUserContext } from "../hooks/CurrentUserContext";
import styled from "styled-components";
import { useContext } from "react";
import { Link } from "react-router-dom";


const Header = () => {
  const { currentUser, removeCurrentUser } = useContext(CurrentUserContext);

  return (
    <NavBar>
      {/* <span>Nice logo</span> */}
        {currentUser ? (
           <>
           <div id="hello">
           {/* <h2>Hello {currentUser.username}!</h2> */}
           <h2><Link to="/profile">Hello {currentUser.username}!</Link></h2>
          </div>
        <UserNav>
            
            <div id="user-id">
              
              <Link to="/create-records">Create-Log</Link>
              <Link to="/profile">Profile Page</Link>
              <a href="/#"
                onClick={() => {
                  removeCurrentUser();
                  window.location.replace("/login");
                } }
              >
                Logout
              </a>
            </div>
          </UserNav></>
        ) : (
          <NavMenu>
            <Link to="/login">Login</Link> 
            <Link to="/signup">Sign up</Link> 
            <Link to="/">Home</Link>
          </NavMenu>
        )}
     
    </NavBar>
  );
};


const NavBar = styled.nav`
left: 0vw;
margin-top: 0vw;
width: 8vw;
/* background-color: red; */
height: 100vh;
position: absolute;
top: 0vw;

#hello{
  position: absolute;
  left: 10vw;

}


h2 a {

text-decoration: none;
color: white;
font-size: 2vw;

}
`

const UserNav = styled.div`
display: flex;
flex-direction: column;
/* background-color: azure; */
width: 8vw;
top: 4vh;
left: 1vw;
/* color: black; */
display: flex;
flex-direction: column;
background-color: rgba(255, 255 , 255, .3);

padding-left: 1vw;
top: 0vh;
left: 0vw;
height: 100vh;
padding-right: 1vw;

a{
  font-size: 22px;
  margin-top: 8px;
  margin-bottom: 8px;
  color: black;
  text-decoration: none;
  width: 100%;
  display: block;
}
a .icon {
    opacity: 1;
    cursor: pointer;
} 
`



const NavMenu = styled.div`
display: flex;
flex-direction: column;
background-color: rgba(255, 255 , 255, .3);
width: 8vw;
padding-left: 1vw;
padding-right: 1vw;
top: 0vh;
left: 0vw;
height: 100vh;


 

a{
  font-size: 22px;
  margin-top: 8px;
  margin-bottom: 8px;
  color: black;
  text-decoration: none;
  width: 80px;
}

a .icon {
    opacity: 1;
    cursor: pointer;
} 
`
export default Header;

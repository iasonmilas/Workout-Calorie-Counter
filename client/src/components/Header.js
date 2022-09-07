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
width: 12vw;
/* background-color: red; */
height: 100vh;
position: absolute;
top: 0vw;

#hello{
  position: absolute;
  left: 15vw;
}

h2 a {
  text-decoration: none;
  color: white;
  font-size: 2vw;
}
`
const UserNav = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Viga&display=swap');
font-family: 'Viga', sans-serif;
display: flex;
flex-direction: column;
background-color: rgba(255, 255 , 255, .3);
width: 12vw;
padding-left: 1vw;
padding-right: 1vw;
top: 0vh;
left: 0vw;
height: 100vh;

 
a{
  font-size: 1.5vw;
  margin-top: 8px;
  margin-bottom: 8px;
  color: black;
  text-decoration: none;
  width: 8vw;
  text-align: center;
  border: 4px solid #858585;
  /* background-color: #858585; */
  border-radius: 4px;
  margin-left:auto;
  margin-right:auto;
}
/* a:hover{
  background-color: grey;
  color: black;
} */

a .icon {
  opacity: 1;
  cursor: pointer;
} 
`

const NavMenu = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Viga&display=swap');

font-family: 'Viga', sans-serif;
display: flex;
flex-direction: column;
background-color: rgba(255, 255 , 255, .3);
width: 12vw;
padding-left: 1vw;
padding-right: 1vw;
top: 0vh;
left: 0vw;
height: 100vh;

a{
  font-size: 24px;
  margin-top: 8px;
  margin-bottom: 8px;
  color: black;
  text-decoration: none;
  width: 8vw;
  text-align: center;
  border: 4px solid #858585;
  /* background-color: #858585; */
  border-radius: 4px;
  margin-left:auto;
  margin-right:auto;
}
a:hover{
  background-color: rgba(0, 0, 0, .3);
  color: black;
}

a .icon {
  opacity: 1;
  cursor: pointer;
} 
`
export default Header;

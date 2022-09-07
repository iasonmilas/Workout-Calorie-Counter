import {
    BrowserRouter,
    Route,
    Routes
  } from "react-router-dom";
import Home from "./Home";
import SignUp from "./SignUp";
import Login from "./Login";
import RecordForm from "./RecordForm";
import Profile from "./Profile";
import Header from "./Header";

const Router = () => {
    return (
        <BrowserRouter>
            
            <Routes>
                <Route exact path="/signup" element={<SignUp />}></Route>
                <Route exact path="/login" element={<Login />}></Route>
                <Route exact path="/" element={<Home /> }></Route>
                <Route exact path="/home" element={<Home /> }></Route>
                <Route exact path="/create-records" element={<RecordForm /> }></Route>
                <Route exact path="/profile" element={<Profile /> }></Route>
            </Routes>
            <Header />
        </BrowserRouter>
    )
};

export default Router;
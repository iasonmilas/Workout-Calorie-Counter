import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CurrentUserContext } from "../hooks/CurrentUserContext";
import { useContext } from "react";
import styled from "styled-components";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertPassword, setAlertPassword] = useState(null);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const location = useLocation();
  const { setCurrentuser } = useContext(CurrentUserContext);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // console.log("username: ", username);
    // console.log("password: ", password);
    if (!username || !password) {
      setError("Invalid username or password");
    } else {
      setLogin(true);
    }
  };

  useEffect(() => {
    // console.log("my login state ", login);
    if (login) {
      // console.log("calling api");
      fetch(
        `http://localhost:4000/users?username=${username}&password=${password}`
      )
        .then((resp) => resp.json())
        .then((data) => data[0])
        .then((data) => {
          // console.log(data);
          if (data && data?.username) {
            setCurrentuser({ ...data, id: data._id });

            navigate("/profile");
          } else {
            // set error
            setError("Invalid username or password");
          }
        }).catch(ex => setError("Invalid username or password"));
      setLogin(false);
    }
  }, [login, username, password, setError, setLogin, navigate, setCurrentuser]);

  return (
    <LoginPage>
      <div id="login-box">
        <div id="error-msg">
          {location?.state?.msg ? <p>{location.state.msg}</p> : ""}
        </div>
        <h3>Login</h3>
        <form onSubmit={handleSubmitForm}>
          <div id="login-info">
            <div className="label-value">
              <label>Username: </label>
              <div id="username-error" className="value-error">
                <input
                  type="text"
                  value={username}
                  name="username"
                  placeholder="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  required
                />
                {error ? <p className="error">{error}</p> : ""}
              </div>
            </div>
            <div className="label-value">
              <label>Password: </label>
              <div id="new-error" className="value-error">
                <input
                  type="password"
                  value={password}
                  name="password"
                  placeholder="password"
                  onChange={(e) => {
                    setAlertPassword(null);
                    setPassword(e.target.value);
                    if (password.length < 3) {
                      setAlertPassword("Password min length is 3 char");
                    }
                    if (password.length > 10) {
                      setAlertPassword("Password max length is 10 char");
                    }
                  }}
                  required
                />
                <p className="error">
                  {alertPassword !== null ? <span>{alertPassword}</span> : ""}
                </p>
              </div>
            </div>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </LoginPage>
  );
};

const LoginPage = styled.div`
  h3 {
    margin-bottom: 1vw;
    font-size: 2.5vw;
  }
  input {
    line-height: 1vw;
    height: 1vw;
    font-size: 1vw;
    margin-bottom: 0.1vw;
  }

  font-size: 1vw;

  .value-error {
    display: inline-block;
    position: relative;
  }

  div.label-value {
    position: relative;

    width: auto;
  }

  #login-box {
    width: 30%;
    margin-left: 35%;
    top: 17vh;
    text-align: center;
    font-size: 1.4vw;

    button {
      font-size: 20px;
    }
  }
  .error {
    /* background-color: black; */
    font-size: 0.7vw;
    display: block;
    color: red;
    position: absolute;
    right: -9.7vw;
    top: 0vw;
    /* background-color: blue; */
    /* float: right; */
    line-height: 1.7vw;
    /* margin-top: 1vw; */

    width: 9.5vw;
    text-align: left;
  }

  #login-info {
    margin-bottom: 20px;
    /* padding: 0 2vw 0 2vw; */
    padding-top: .75vw;
    padding-bottom: .75vw;
    border: .25vw solid white;
  }
  #error-msg {
    /* margin-bottom: 30px; */
  }
`;

export default Login;

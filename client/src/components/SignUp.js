import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // console.log(data);
    delete data.confirmPassword;
    fetch(`http://localhost:4000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        // console.log(data);
        if (data?.err) {
          setError("apiErr", { message: data.err });
          return;
        }
        navigate("/login", {
          state: { msg: "Your account was created sucessfully please login!" },
        });
      });
  };

  return (
    <SignUpform>
      <div id="signup-form">
        <h2>Fill in the form and join us!</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.apiErr && <p>{errors.apiErr?.message}</p>}
          <div id="form-section">
            <div id="login-info">
              <div id="label-info">
                <label>
                  Username:{" "}
                  {errors.username?.type === "required" && (
                    <p className="error">Username is required!</p>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: true,
                    pattern: /^[A-Za-z0-9-_]+$/i,
                  })}
                />

                {errors.username?.type === "pattern" &&
                  "username lettrer number or - _"}
              </div>
              <div>
                <label>Name: </label>
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name", {
                    pattern: /^[A-Za-z]+$/i,
                  })}
                />
                {errors.username?.type === "pattern" && "name is only lettrer"}
              </div>
              <div id="label-info">
                <label>
                  Email:{" "}
                  {errors.username?.type === "required" && (
                    <p className="error">Email is required!</p>
                  )}
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
              </div>
              <div id="label-info">
                <label>
                  Password:{" "}
                  {errors.username?.type === "required" && (
                    <p className="error">Password is required!</p>
                  )}
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                    minLength: 3,
                    maxLength: 10,
                  })}
                />
              </div>
              <div id="label-info">
                <label>
                  Confirm Password:{" "}
                  <p className="error" id="password-match">
                    {" "}
                  </p>{" "}
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    validate: (value) => {
                      if (value !== watch("password")) {
                        return <p className="error">Passwords don't match!</p>;
                      }
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            {/*#login-info-closing*/}
            <div id="user-info">
              <div id="label-info">
                <label>
                  Height:{" "}
                  {errors.height?.type === "required" && (
                    <p className="error">Height is required! </p>
                  )}
                </label>
                <input
                  type="number"
                  placeholder="Height in cm"
                  {...register("height", {
                    required: true,
                  })}
                />
              </div>
              <div id="label-info">
                <label>
                  Weight:{" "}
                  {errors.weight?.type === "required" && (
                    <p className="error">Weight is required!</p>
                  )}
                </label>
                <input
                  type="number"
                  placeholder="Weight in kg"
                  {...register("weight", {
                    required: true,
                  })}
                />
              </div>

              <div id="label-info">
                <label>Age:</label>
                <input type="number" placeholder="Age" {...register("age")} />
              </div>
            </div>
          </div>
          <button type="submit">SignUp</button>
        </form>
      </div>
    </SignUpform>
  );
};

const SignUpform = styled.div`

width: 80vw;
margin-left: 10vw;
  #signup-form .error,
  .error {
    font-size: 0.7vw;
    /* display: inline-block; */
    color: red;
    right: 0px;
    /* background-color: blue; */
    float: right;
    line-height: 1.4vw;
    /* margin-top: 1vw; */
    padding-right: 5px;
    margin: 0;
    margin-top: 0.4vw;

  }

  font-size: 1.5vw;

  input {
    height: 1vw;
    width: 8vw;
  }
  label {
    display: inline-block;
    width: 15vw;
    position: relative;
    clear: both;
  }
  #form-section {
    display: flex;
    flex-direction: row;
  }

  #signup-form {
    /* background-color: blue; */
    width: 70%;
    margin-left: 15%;
    top: 15vh;
    text-align: center;
  }

  #signup-form h2 {
      font-size: 40px;
  }

  #signup-form label {
    text-align: left;
  }

  #login-info {
    /* background-color: pink; */
    width: 50vw;
    border: 1px solid black;
    margin: 1vw 0 1vw 1vw;
    padding: 1vw;
    clear: both;
  }

  #user-info {
    /* background-color: orange; */
    width: 50vw;
    border: 1px solid black;
    margin: 1vw 1vw 1vw 0;
    padding: 1vw;
    clear: both;
  }
  #user-info, #login-info{

    border: .25vw solid white;
  }

  @media (max-width: 800px) {
    #form-section {
      flex-direction: column;
    }
    #form-section > div {
      width: 70vw;
      height: auto;
      position: relative;
    }
    label {
      display: block;
      width: 80%;
    }
    input {
      display: block;
      width: 80%;
    }
  }
`;

export default SignUp;

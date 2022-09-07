import { CurrentUserContext } from "../hooks/CurrentUserContext";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { isUserLogin, fatFormula } from "../util";
import Records from "./Records";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Profile = () => {
  const { currentUser, setCurrentuser } = useContext(CurrentUserContext);
  if (!isUserLogin(currentUser)) {
    // console.log("user not login route to login");
    window.location.replace("/login");
  }

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [updateNotification, setUpdateNotification] = useState(null);

  const onSubmit = (data) => {
    // console.log(data);
    delete data.confirmPassword;
    fetch(`http://localhost:4000/users/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((json) => {
        // console.log(json);
        setCurrentuser({
          ...currentUser,
          name: data?.name ? data.name : currentUser.name,
          age: data?.age ? data.age : currentUser.age,
          weight: data?.weight ? data.weight : currentUser.weight,
          height: data?.height ? data.height : currentUser.height,
        });
        setUpdateNotification("you profile has been updated");
        setTimeout(() => {
          setUpdateNotification(null);
        }, 5000);
      });
  };
  return (
    <CurrentUserInfo>
      
      <FormUserInfo onSubmit={handleSubmit(onSubmit)}>
        <div id="user-info">
          {currentUser ? (
            <div>
              <div>
              {updateNotification ? <p>{updateNotification}</p> : "" }
                <h2>Your current info</h2>
                
              </div>
              <div>
                <label>Username:</label>{" "}
                <input type="text" value={currentUser.username} disabled />
              </div>
              <div>
                <label>Email:</label>{" "}
                <input type="text" value={currentUser.email} disabled />
              </div>
              <div>
                <label>Name:</label>{" "}
                <input
                  type="text"
                  {...register("name")}
                  defaultValue={currentUser.name}
                />
              </div>
              <div>
                <label>Password:</label>{" "}
                <input
                  type="password"
                  {...register("password", {
                    minLength: 3,
                    maxLength: 10,
                  })}
                />
              </div>
              <div>
                <label>Confirm Password:</label>{" "}
                <input
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    validate: (value) => {
                      if (value !== watch("password")) {
                        return "Passwords don't match!";
                      }
                    },
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
              <div>
                <label>Age:</label>{" "}
                <input
                  type="number"
                  {...register("age")}
                  defaultValue={currentUser.age}
                />
              </div>
              <div>
                <label>Weight:</label>{" "}
                <input
                  type="number"
                  {...register("weight")}
                  defaultValue={currentUser.weight}
                />
              </div>
              <div>
                <label>Height:</label>{" "}
                <input
                  type="number"
                  {...register("height")}
                  defaultValue={currentUser.height}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div id="button-box">
          <button type="submit">Update</button>
        </div>
      </FormUserInfo>
      <div id="fat-calculator">
      <FatCalculator />
      </div>
      <div id="workouts">
      <TopDailyWorkout />
      <ReocrdByDate />
      </div>
    </CurrentUserInfo>
  );
};

const getRecordsByUserId = async (id) => {
    let resp = await fetch(
      `http://localhost:4000/records?userId=${id}`
    );
    return resp.json();
  };

const ReocrdByDate = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [records, setRecords] = useState(null);

  const now = moment().format("YYYY-MM-DD");
  const [date, setDate] = useState(now);
  const handleChange = (newDate) => {
    setDate(newDate.format("YYYY-MM-DD"));
  };

  useEffect(() => {
    // console.log(date);
    fetch(`http://localhost:4000/records?userId=${currentUser.id}&date=${date}`)
        .then((resp) => resp.json())
        .then((data) => {
          setRecords(data);
        });
  }, [date, currentUser.id]);

  return (
    <div>
     <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
          label="Calendar"
          inputFormat="YYYY/MM/DD"
          value={date}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        {records && records.length > 0 ?
    <Records
      title={"Workouts by selected date"}
      records={records}
      weight={currentUser.weight}
    /> : <h2>No workout for {date}</h2>
      }
    </LocalizationProvider>
    </div>
  );
}
//cssupdate
const FatCalculator = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [result, setResult] = useState();
  return (
    <>
    {result ? result : ""}
    <button onClick={() => {
      setResult(fatFormula(currentUser.weight, currentUser.height, currentUser.age));
    }}>Calculate Body Fat</button>
  </>
  )
}

const TopDailyWorkout = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [records, setRecords] = useState(null);

  useEffect(() => {
    getRecordsByUserId(currentUser.id).then((resp) =>
      setRecords(
        resp.sort((a, b) => b.totalCalorie - a.totalCalorie).slice(0, 3)
      )
    );
  }, [currentUser.id]);
  return (
    <Records
      title={"Top 3 days of workouts!"}
      records={records}
      weight={currentUser.weight}
    />
  );
};

const CurrentUserInfo = styled.div`
width: 80vw;
margin-left: 10vw;

#fat-calculator{
  position: absolute;
  top: 8vw;
  left: 5vw;
  display: flex;
  flex-direction: column-reverse;
  text-align: center;
  
}
#fat-calculator button{
  font-size: .75vw;

}

#workouts{
  /* background-color: aqua; */
  display: flex;
  flex-direction: row;
  width: 50vw;
  margin-left: 15vw;
  justify-content: space-evenly;
  margin-top: 1vw;
  gap: 2vw;
}
#user-info{

border-color: whitesmoke;
}

#workouts h2{

  margin-top: 1vw;
  margin-bottom: 1vw;
  color: black;
  font-size: 1.5vw;
}
#workouts > div{

  background-color: white;
  padding: 1vw;
  width: 20vw;
  border-radius: 1vw;
  opacity: .75;
}
#workouts div.MuiFormControl-root.MuiTextField-root{
  height: 4vw;
  /* background-color: bisque; */
}
#workouts > div:nth-child(1){

  padding: 5vw;
  
}
#workouts > div:nth-child(2){

padding: 1vw 5vw 0 5vw;

}

`
const FormUserInfo = styled.form`
/* background-color: blueviolet; */
width: 26vw;
margin-left: 27vw;



#user-info{
  border: .15vw solid white;
  margin-top: 2vh;
  margin-bottom: 1vh;
  display: inline-block;
  padding: 1vw;

  input {
    /* float: right; */
    /* display: flex; */
    /* align-items: flex-end; */
    height: 1vw;
    width: 9vw;
  }
  label {
    display: inline-block;
    width: 13vw;
    position: relative;
    clear: both;
    background-color: rgba(255, 255, 255, .5);
  }

  h2{
    color: white;
    font-size: 1.75vw;
    width: 100%;
    text-align: center;
    margin-bottom: 1vw;
  }

}

#button-box{
  /* background-color: red; */
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;

  button {
    font-size: 20px;
    display: inline-block;
    align-items: center;
  }
}

`


export default Profile;

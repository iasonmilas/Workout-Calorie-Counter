import { useState, useEffect } from "react";
import {  useForm } from "react-hook-form";
import styled from "styled-components";

const Home = () => {
  return <HomePage>

    <h1>Welcome to Calorie-Counter</h1>
    <div id="page">
    <Calculator />
    </div>
  </HomePage>;
};

const Calculator = () => {
  const [activities, setActivites] = useState(null);
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState();

  const onSubmit = (form) => {
    // console.log("form");
    let errors = document.getElementById("errors");
    // console.log(errors);
    errors.style.display ='none';
   
    errors.innerHTML = '';
    if(!form.duration){
      errors.style.display = 'block';
      errors.innerHTML += '<p>Please insert duration<p>';
    }
    if(!form.weight){
      errors.style.display = 'block';
      errors.innerHTML += '<p>Please insert your weight, don\'t be shy!<p>';
    }
    setResult(Math.round((form.activity*2.2*2.2) * (form.duration/60) * form.weight));
  };

  useEffect(() => {
    if (!activities) {
    fetch(`http://localhost:4000/activities`)
      .then((resp) => resp.json())
      .then((data) => {
        data.unshift({rate: ' ', activity: 'Select your activity!'});
        setActivites(data);
      });
    }
  }, [activities, setActivites]);

  return (
    <DecoratedCalculator>
    <div id="calculator">
    <h2>Try our calorie calculator</h2>
    <div id="errors"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div id="calculator-choice">
        <select {...register("activity")}>
          {activities?.map((item, index) => (
            <option key={index} value={item.rate}>
              {item.activity}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          {...register("duration", {
            pattern: /^[0-9]+$/,
          })}
          placeholder="Duration in min"
        />
        <input
          type="text"
          {...register("weight", {
            pattern: /^[0-9]+$/,
          })}
          placeholder="Weight in Kg"
        />
        </div>
        <button type="submit">Calculate</button>
      </form>
      </div>
      <div id="result">
      {result ? <h3>Calories burned: </h3> : ""}
      {result ? <div>{result}</div> : ""}

      </div>
    </DecoratedCalculator>
  );
};
const HomePage = styled.div`
text-align: center;



h1{
  /* margin: 5vh; */
  font-size: 3vw;
  
}

`
const DecoratedCalculator = styled.div`


#result{
  width: 50vw;
  margin-left: 25vw;
  text-align: center;
  margin-top: 12vw;
  height: 6vw;
  position: absolute;

}
#result > div{
  color: white;
  font-size: 5vw;
}
#result > h3{
  font-size: 2vw;

}
#calculator h2{

  font-size: 2vw;
}
#result > div{
  /* font-size: 3vw; */
  /* background-color: chartreuse; */
  width: 10vw;
  margin-left: 20vw;

}

#calculator{
/* background-color: aqua; */
width: 50vw;
margin-left: 25vw;
text-align: center;
height: 10vh;
margin-top: 20vh;
}
#calculator-choice{
  margin: 1vw;
}
#calculator-choice > *{
height: 2vw;
font-size: 1vw;
}

#calculator-choice > select{

  height: 2.3vw;
  width: 20vw;

}
#calculator-choice > input{
  width: 7vw;

}

`



export default Home;

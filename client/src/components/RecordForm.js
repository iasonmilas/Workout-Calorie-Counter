import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { CurrentUserContext } from "../hooks/CurrentUserContext";
import styled from "styled-components";
import  {isUserLogin} from "../util";
import Records from "./Records";

const createRecord = async (data) => {
  await fetch(`http://localhost:4000/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const updateRecord = async (data, id) => {
  await fetch(`http://localhost:4000/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const RecordForm = () => {
  const [activities, setActivites] = useState(null);
  const [activityMap, setActivityMap] = useState(null);
  const [refetch, setRefetch] = useState(true);
  const [record, setRecord] = useState(null);
  const { register, handleSubmit } = useForm();

  const { currentUser } = useContext(CurrentUserContext);

  if (!isUserLogin(currentUser)) {
    // console.log("user not login route to login");
    window.location.replace("/login");
  }

  const onSubmit = (data) => {
    const now = moment().format("YYYY-MM-DD");
    // console.log(data, now);
    fetch(`http://localhost:4000/records?userId=${currentUser.id}&date=${now}`)
      .then((resp) => resp.json())
      .then((resp) => resp[0])
      .then(async (resp) => {
        if (!resp || resp.length === 0) {
          const sendData = {
            userId: currentUser.id,
            date: now,
            weight: currentUser.weight,
            workouts: [
              {
                activityId: data.activity,
                duration: data.duration,
              },
            ],
          };
          await createRecord(sendData);
          setRefetch(true);
        } else {
          resp.activityId = data.activity;
          resp.duration = data.duration;
          // console.log("got response", resp);
          setRecord(resp);
        }
      });
  };

  useEffect(() => {
    if (record) {
      // console.log("update record ", record);
      const sendData = {
        weight: currentUser.weight,
        workout: {
          activityId: record.activityId,
          duration: record.duration,
        },
      };
      updateRecord(sendData, record._id).then(
        () => {
          setRecord(null);
          setRefetch(true);
        }
      )
    }
  }, [record, setRecord, currentUser.weight]);

  useEffect(() => {
    if (!activities) {
      fetch(`http://localhost:4000/activities`)
        .then((resp) => resp.json())
        .then((data) => {
          setActivites(data);
          setActivityMap(data.reduce((map, obj) => {
            map[obj._id] = obj
            return map;
          }));
        });
    }
  }, [activities, setActivites]);

  return (
    <RecordInput>
      <form id="recordactivity" onSubmit={handleSubmit(onSubmit)}>
        <div className="record-choice">
          <select {...register("activity")}>
            {activities?.map((item, index) => (
              <option key={index} value={item._id}>
                {item.activity}
              </option>
            ))}
          </select>
          <input
            type="text"
            {...register("duration")}
            placeholder="Duration in min"
          />
        </div>
        <div className="button">
          <button type="submit">Record</button>
        </div>
      </form>
      <RecordList refetch={refetch} setRefetch={setRefetch} activityMap={activityMap} />
    </RecordInput>
  );
};

const RecordList = ({ refetch, setRefetch, activityMap }) => {
  // console.log("record list compoinent", refetch);
  const [records, setRecords] = useState(null);
  const [item, setItem] = useState(null);
  const { currentUser } = useContext(CurrentUserContext);

  const now = moment().format("YYYY-MM-DD");

  useEffect(() => {
    if (refetch) {
      fetch(`http://localhost:4000/records?userId=${currentUser.id}&date=${now}`)
        .then((resp) => resp.json())
        .then((data) => {
          // console.log(data);
          setRecords(data);
          setItem(data);
          // console.log("new records", records, item, refetch);
        });
    }
    setRefetch(false);
  }, [refetch, setRefetch, setRecords, records, item, setItem, currentUser.id, now]);

  return (
    <RecordDiv>
    <Records title="Today's workout" records={records} weight={currentUser.weight} />
    </RecordDiv>
  );
};
const RecordDiv = styled.div`
left: 40vw;
background-color: white;
  padding: 1vw;
  width: 20vw;
  border-radius: 1vw;
  opacity: .75;

h2{
  color: black;
  font-size: 1.5vw;
  margin-bottom: 2vw;
}
`
const RecordInput = styled.div`
  #recordactivity {
    text-align: center;
    /* background-color: aqua; */
    width: 50vw;
    margin-left: 25vw;
  }
  .button button {
    
    font-size: 20px;
    display: inline-block;
    align-items: center;
    margin-bottom: 2vw;
  
    /* background-color: blueviolet; */
  }
  .record-choice {
    padding: 1vw;

    /* background-color: brown; */
    margin: 0vw 1vw 0vw 1vw;
    padding: 3vw 0 0 0;
    
  }
  .record-choice > * {
    height: 2vw;
    font-size: 1vw;
  }
  .record-choice select {
    padding: .5vw;
    height: 2.3vw;
    width: 20vw;
  }
  .record-choice > input {
    width: 7vw;
  }
`;

export default RecordForm;

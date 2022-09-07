import { useState, useEffect } from "react";
import calculatorformula from "../util";

const Records = ({ title, records, weight }) => {
  const [activityMap, setActivityMap] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:4000/activities`)
      .then((resp) => resp.json())
      .then((data) => {
        setActivityMap(
          data.reduce((map, obj) => {
            map[obj._id] = obj;
            return map;
          })
        );
      });
  }, []);

  // console.log(records);

  return (
    <div>
      {records && records.length > 0 ? (
        <>
          <h2>{title}</h2>
          <div>
            {records?.map((item, index) => (
              <ul key={index}>
                <li>Date: {item.date}</li>
                <li>Total carlories burned: {item.totalCalorie}</li>
                <ul>
                  {item?.workouts?.map((w, wi) => (
                    <li key={wi}>
                      <div>
                        Activity:{" "}
                        {activityMap ? activityMap[w.activityId]?.activity : ""}
                      </div>
                      <div>Duration: {w.duration} min</div>
                      <div>
                        Calories:{" "}
                        {activityMap
                          ? calculatorformula(
                              activityMap[w.activityId]?.rate,
                              w.duration,
                              weight
                            )
                          : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              </ul>
            ))}
            
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Records;

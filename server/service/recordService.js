const mongodb = require("../mongoClient");
const { ObjectId } = require("mongodb");
const recordCollection = mongodb.db.collection("records");
const activityCollection = mongodb.db.collection("activities");

const importRecords = async (req, res) => {
  const data = require("../data/record.json");
  const record = data.map((r) => {
    return {
      ...r,
      userId: new ObjectId(r.userId),
      workouts: [
        { ...r.workouts[0], activtyId: new ObjectId(r.workouts[0]) },
        { ...r.workouts[1], activtyId: new ObjectId(r.workouts[1]) },
      ],
    };
  });
  await recordCollection.insertMany(record);
  res.json({ success: "true" });
};

const findAllRecords = async (req, res) => {
  const userId = req.query.userId;
  const date = req.query.date;
  let query = {};

  if (userId) {
    query = { userId: userId };
  }

  if (date && userId) {
    query = {
      $and: [
        {
          date: date,
        },
        query,
      ],
    };
  }

  const records = await recordCollection.find(query).toArray();
  // console.log(records);
  res.json(records);
};

const findRecordById = async (req, res) => {
  // console.log("findRecordById");
  const id = req.params.id;
  // console.log(id);
  const records = await recordCollection.find({ _id: ObjectId(id) }).toArray();
  // console.log(records);
  res.json(records);
};

const findRecordsByUserId = async (req, res) => {
  // console.log("findRecordsByUserId");
  const id = req.params.id;
  // console.log(id);
  // let lookupCondition = {from:"activities", localField: "activityId", foreignField: "_id", as : "activity"};
  // let findCondition = { userId: id };
  const records = await recordCollection.find({ userId: id }).toArray();
  // let records = await recordCollection.aggregate([ {$match : findCondition }  , {$lookup: lookupCondition }]).toArray();
  // console.log(records);
  const activities = await activityCollection.find({ }).toArray();
  const activitiesById = [];
  for(let activity of activities){
    activitiesById[activity._id] = activity;
  }


let workouts = [];
  for(let record of records){
    for(let workout of record.workouts){
      // console.log(workout.duration);
      let activity = activitiesById[workout.activityId];
      workout.activity = activity.activity;
      workout.date = record.date;
      // console.log(workout);
      workouts.push(workout);
    }

  }


  res.json(workouts);

};

const createRecord = async (req, res) => {
  const newRecord = req.body;
  // console.log(newRecord);
  const activities = await mongodb.db
    .collection("activities")
    .find({ _id: ObjectId(newRecord.workouts[0].activityId) })
    .toArray();
  // console.log(activities);
  const { weight } = newRecord;
  delete newRecord.weight;
  const { insertedId } = await recordCollection.insertOne({
    ...newRecord,
    totalCalorie:
      calculatorformula(activities[0].rate, newRecord.workouts[0].duration, weight),
  });
  // console.log(insertedId);

  res.json({ id: insertedId });
};

const updateRecord = async (req, res) => {
  // console.log("updaterecord");
  const id = req.params.id;
  const { workout, weight } = req.body;
  // console.log(req.body);
  // console.log(workout.activityId);

  const existRecords = await recordCollection
    .find({ _id: ObjectId(id) })
    .toArray();
  if (existRecords.length < 1) {
    res.status(404).json({ err: "record not found id " + id });
    return;
  }
  const activities = await mongodb.db
    .collection("activities")
    .find({ _id: ObjectId(workout.activityId) })
    .toArray();
  // console.log(activities);

  const carB = calculatorformula(activities[0].rate, workout.duration, weight);

  await recordCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        workouts: existRecords[0].workouts
          ? [...existRecords[0].workouts, workout]
          : [workout],
        totalCalorie: existRecords[0].totalCalorie + carB,
      },
    }
  );
  res.json({ success: "true" });
};

const calculatorformula = (rate, duration, weight) => {
  return Math.round(rate * 2.2 * 2.2 * (duration / 60) * weight);
};

module.exports = {
  importRecords,
  findAllRecords,
  findRecordById,
  findRecordsByUserId,
  createRecord,
  updateRecord,
};

const { ObjectId } = require("mongodb");
const csvtojson = require("csvtojson");
const mongodb = require("../mongoClient");

const activityCollection = mongodb.db.collection("activities");

const importActivites = async (req, res) => {
  const json = await csvtojson({
    noheader: false,
    headers: ["activity", "130b", "155b", "180b", "205b", "rate"],
  }).fromFile("./data/exercise_dataset.csv");
  
  await activityCollection.deleteMany({});
  await activityCollection.insertMany(json);
  res.json({ success: "true" });
};

const findAllActivities = async (req, res) => {
  const activities = await activityCollection.find({}).toArray();
  res.status(200).json(activities);
};

const findActivityById = async (req, res) => {
  const id = req.params.id;
  const activity = await activityCollection
    .find({ _id: ObjectId(id) })
    .toArray();
  if (activity.length > 0) {
    res.status(200).json(activity);
  } else {
    res.status(404).json({ err: "activity not found id " + id });
  }
};

module.exports = {
  importActivites,
  findAllActivities,
  findActivityById,
};

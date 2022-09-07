"use strict";

const express = require("express");
const morgan = require("morgan");
const mongodb = require("./mongoClient");
const {
  importActivites,
  findAllActivities,
  findActivityById,
} = require("./service/activityService");
const {
  importUserData,
  findUserById,
  findAllUsers,
  createUser,
  updateUser,
} = require("./service/userService");
const {
  importRecords,
  findAllRecords,
  findRecordById,
  findRecordsByUserId,
  createRecord,
  updateRecord,
} = require("./service/recordService");
const cors = require("cors");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(cors())
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // activities endpoints
  .get("/import-activities", importActivites)
  .get("/activities", findAllActivities)
  .get("/activities/:id", findActivityById)

  // Users endpoints
  .get("/import-users", importUserData)
  .get("/users", findAllUsers)
  .get("/users/:id", findUserById)
  .post("/users", createUser)
  .patch("/users/:id", updateUser)

  //Record endpoints
  .get("/import-records", importRecords)
  .get("/records", findAllRecords)
  .get("/records/:id", findRecordById)
  .get("/user/:id/records/", findRecordsByUserId)
  .post("/records", createRecord)
  .patch("/records/:id", updateRecord)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));

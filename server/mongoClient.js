const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

class Mongo {
    constructor() {
        const dbClient = new MongoClient(MONGO_URI);
        dbClient.connect();
        this.db = dbClient.db("calorie-counter");
    }

    getDB = () => this.db
}

module.exports = new Mongo();
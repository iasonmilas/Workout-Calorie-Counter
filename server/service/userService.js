const mongodb = require("../mongoClient");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const userCollection = mongodb.db.collection("users");

const importUserData = async (req, res) => {
  const userData = require("../data/user.json");
  await userCollection.insertMany(userData);
  res.json({ success: "true" });
};

const findAllUsers = async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (username) {
    if (!password) {
        res.status(400).json({"err": "auth failed"});
        return
    }
    const users = await userCollection.find({ username: username }).toArray();
    if (users.length < 1) {
        res.status(400).json({"err": "auth failed"});
        return
    }
    const auth = bcrypt.compareSync(password, users[0].password)
    if (auth) {
        const usersWithoutPass = users.map(u => {
            delete u.password;
            return u; 
        });
        res.json(usersWithoutPass);
    } else {
        res.status(400).json({"err": "auth failed"});
    }
    return;
  }
  const users = await userCollection.find({}).toArray();
  res.json(users);
};

const findUserById = async (req, res) => {
  const id = req.params.id;
  const user = await userCollection.find({ _id: ObjectId(id) }).toArray();
  if (user.length > 0) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ err: "User not found id: " + id });
  }
};

const createUser = async (req, res) => {
  let newUser = req.body;
  const emailUsed = await userCollection
    .find({ email: newUser.email })
    .toArray();
  if (emailUsed.length > 0) {
    res
      .status(400)
      .json({ err: "Email has been signed up before: " + newUser.email });
    return;
  }
  const usernameUsed = await userCollection
    .find({ username: newUser.username })
    .toArray();
  if (usernameUsed.length > 0) {
    res
      .status(400)
      .json({ err: "Username is already taken " + newUser.username });
    return;
  }

  const hash = bcrypt.hashSync(newUser.password, saltRounds);

  newUser = { ...newUser, password: hash };
  const { insertedId } = await userCollection.insertOne(newUser);
  res.json({ id: insertedId });
};

const updateUser = async (req, res) => {
  const newUser = req.body;
  const id = req.params.id;

  const existUser = await userCollection.find({ _id: ObjectId(id) }).toArray();
  if (existUser.length < 1) {
    res.status(400).json({ err: "User does not exist id " + id });
  }
  await userCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        password: newUser?.password ? bcrypt.hashSync(newUser.password, saltRounds) : existUser[0].password,
        weight: newUser?.weight ? newUser.weight : existUser[0].weight,
        height: newUser?.height ? newUser.height : existUser[0].height,
        age: newUser?.age ? newUser.age : existUser[0].age,
        name: newUser?.name ? newUser.name : existUser[0].name,
      },
    }
  );
  res.json({ success: "true" });
};

module.exports = {
  importUserData,
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
};

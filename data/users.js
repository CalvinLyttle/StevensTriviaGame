const { user_collection } = require("../config/mongoCollections");
const bCrypt = require("bcrypt");
const saltRounds = 10;

const createUser = async (username, password) => {
  //username validation
  if (!username || !password) throw "Please provide username and password.";
  if (typeof username !== "string") throw "Invalid username.";

  //password validation
  if (typeof password !== "string" || password.trim().length < 8)
    throw "Invalid password - pasword should be atleast 8 char long.";

  const usersCollection = await user_collection();
  const alreadyExists = await usersCollection.findOne({
    username: username.toLowerCase(),
  });
  if (alreadyExists)
    throw "Username already exists - please provide another username.";

  const hashedPassword = await bCrypt.hash(password, saltRounds);

  const insertUser = await usersCollection.insertOne({
    username: username.toLowerCase(),
    password: hashedPassword,
  });
  if (insertUser.insertedCount === 0)
    throw "Could not create the user - Please contact Admin.";

  const userFound = await usersCollection.findOne({
    _id: insertUser.insertedId,
  });
  if (!userFound) throw "Could not find the user - Please contact Admin.";

  return { insertedUser: true };
};

const checkUser = async (username, password) => {
  //username validation
  if (!username || !password) throw "Please provide username and password.";
  if (typeof username !== "string") throw "Invalid username.";

  //password validation
  if (typeof password !== "string" || password.trim().length < 8)
    throw "Invalid password - pasword should be atleast 8 char long.";

  const usersCollection = await user_collection();
  const exists = await usersCollection.findOne({
    username: username.toLowerCase(),
  });
  if (!exists)
    throw `${username} is not registered with us - Click the link below to register.`;

  const comparePassword = await bCrypt.compare(password, exists.password);

  if (!comparePassword)
    throw "Please enter the correct password for the given username and login again. Thanks!";

  return { authenticatedUser: true };
};

module.exports = {
  createUser, // - parul
  checkUser, // - parul
  //welcomeScreen functions - Nidhi
  //question/answer functions - Calvin ? or maybe from public/js/questionsAnswers
  //scoreBoard functions - Joseph?
  //continue playing functions - Savil
};


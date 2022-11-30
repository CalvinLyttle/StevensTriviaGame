//login function - have the details in a form (userLogin handlebar)
// ??? create a json file and retrive the data from there OR create a mongo collection and retrive data?

const { user_collection } = require("../config/mongoCollections");
const bCrypt = require("bcrypt");
const saltRounds = 16;

const createUser = async (username, password) => {
  //username validation
  if (!username || !password) throw "Please provide username and password.";
  if (typeof username !== "string") throw "Invalid username.";
  if (username.includes(" "))
    throw "Invalid username - empty spaces are not allowed. Hint - 'SophieAniston' is valid & 'Sophie Aniston' is invalid.";

  //password validation
  if (typeof password !== "string" || password.trim().length < 6)
    throw "Invalid password - pasword should be atleast 6 char long.";
  if (password.includes(" "))
    throw "Invalid password - empty spaces are not allowed.";

  const regexUpperCase = /[A-Z]/;
  const regexNumber = /[0-9]/;
  const regexSpecialChar = /[!@#\$%\^\&*\)\(+=._-]/;
  if (
    password.search(regexUpperCase) === -1 ||
    password.search(regexNumber) === -1 ||
    password.search(regexSpecialChar) === -1
  )
    throw "Invalid password - atleast one uppercase,one number and one speacial char is required.";

  const usersCollection = await user_collection();
  //console.log('user collection from db ...', usersCollection);
  const alreadyExists = await usersCollection.findOne({
    username: username.toLowerCase(),
  });
  if (alreadyExists)
    throw "Email already exists - please provide another email.";

  const hashedPassword = await bCrypt.hash(password, saltRounds);
  //console.log('hashed password..', hashedPassword)

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
  if (username.includes(" "))
    throw "Invalid username - empty spaces are not allowed. Hint - 'SophieAniston' is valid & 'Sophie Aniston' is invalid.";

  //password validation
  if (typeof password !== "string" || password.trim().length < 6)
    throw "Invalid password - pasword should be atleast 6 char long.";
  if (password.includes(" "))
    throw "Invalid password - empty spaces are not allowed";

  const regexUpperCase = /[A-Z]/;
  const regexNumber = /[0-9]/;
  const regexSpecialChar = /[!@#\$%\^\&*\)\(+=._-]/;
  if (
    password.search(regexUpperCase) === -1 ||
    password.search(regexNumber) === -1 ||
    password.search(regexSpecialChar) === -1
  )
    throw "Invalid password - atleast one uppercase,one number and one speacial char is required.";

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


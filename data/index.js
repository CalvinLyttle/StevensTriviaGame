//Here you will require data files and export them.
const usersData = require('./users');
const questions = require('../questions.json');

function chooseQuestion(){
  let qs = questions["q"];
  return qs[Math.floor(Math.random() * qs.length)];
}

module.exports = {
  chooseQuestion,
  users: usersData,
};
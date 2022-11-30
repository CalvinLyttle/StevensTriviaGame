const routesAPI = require('./routesAPI');

const constructorMethod = (app) => {
  app.use('/', routesAPI);
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = constructorMethod;
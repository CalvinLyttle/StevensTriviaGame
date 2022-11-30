//Here you will require route files and export the constructor method.

const routes = require('./routesAPI');

const constructorMethod = (app) => {
  app.use('/', routes);
  
  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = constructorMethod;
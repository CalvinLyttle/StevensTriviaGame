const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());

app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true      
    })
  );

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use((req,res,next) => {
    console.log('Current Timestamp: ', new Date().toUTCString());
    console.log('Request Method: ', req.method);
    console.log('Request Route: ', req.originalUrl);
    //console.log('user is..',req.session.usernameInput);
    console.log(`${req.session.usernameInput ? "Authenticated" : "Not-Authenticated"}`)

    next();
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
/*
Here is where you'll set up your server.
*/
// const express = require('express');
// const app = express();
// const static = express.static(__dirname + '/public');
// const configRoutes = require('./routes');

// app.use;
// app.use('/public', static);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// configRoutes(app);

// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log('Your routes will be running on http://localhost:3000');
// });



//lab 10

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


// app.use('/protected', (req,res,next) => {
//     if(!req.session.usernameInput) {
//         res.status(403).render('forbiddenAccess', {
//             title: "Forbidden"
//         })
//     }else{
//         next();
//     }
// })

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
  console.log("Server has been initialized!");
  console.log('Your routes will be running on http://localhost:3000');
});
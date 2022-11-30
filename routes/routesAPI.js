//all the routing calls will be here 
//get, post
const express = require('express');
const data = require('../data');
const usersData = data.users;
const router = express.Router();

// home page - need to auth?
router.get("/", async (req, res) => {
    //if a user is authenticated -- redirect to /private
    // else -- render to login page
    // let user = req.session.user;
    if (req.session.user) {
      // if user is authenticated
      res.redirect("/welcome");
    } else {
      //  not authenticated
      // console.log("LOGIN")
      return res.status(403).render("main", {
        title: "Stevens Trivia",
      });
    }
  });

router.get("/welcome", async (req, res) => {
//if a user is authenticated -- redirect to /private
// else -- render to login page
// let user = req.session.user;
if (req.session.user) {
    // if user is authenticated
    res.status(200).render("/trivia");
} else {
    //  not authenticated
    // console.log("LOGIN")
    return res.status(400).render("main", {
    title: "Stevens Trivia",
    });
}
});

// unsure
router.get("/trivia", async (req, res) => {
    //if a user is authenticated -- redirect to /private
    // else -- render to login page
    // let user = req.session.user;
    if (req.session.user) {
        // if user is authenticated
        res.status(200).render("/trivia");
    } else {
        //  not authenticated
        // console.log("LOGIN")
        return res.status(400).render("main", {
        title: "Stevens Trivia",
        });
    }
    });

 


router.get("/logout", async (req, res) => {
    req.session.destroy();
    // res.send('Logged out');
    res.redirect("/");
    });
module.exports = router;

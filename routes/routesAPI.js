const express = require("express");
const router = express.Router();
let userData = require("../data/users");
const datafuncs = require("../data/index");
const { generateLeaderboardData } = require("../public/js/leaderboard");

//this is the root route '/'
router.route("/").get(async (req, res) => {
  //if the user is already logged in(authenticated) and goes to '/welcome'
  if (req.session.emailInput) {
    res.redirect("/welcome");
    return;
  }
  res.render("userLogin", {
    title: "Login or Registrer to Begin",
  });
});

// after the user login/register successfully, '/welcome' page will be displayed.
router.route("/welcome").get(async (req, res) => {
  console.log("username in welcome page..", req.session.usernameInput)
  res.render("welcomePage", {
    title: "Welcome",
    name: req.session.usernameInput
  });
});

router
  .route("/trivia/:attempted/:correct")
  .get(async (req, res) => {
    if (req.session.usernameInput) {
      // if user is authenticated
      let question = datafuncs.chooseQuestion();
      let {attempted, correct} = req.params;
      if (attempted === "10"){
        res.redirect(`/gameResults/${attempted}/${correct}`);
        return;
      }
      res.render("triviaQuestionsAnswers",
      {
        attempted: parseInt(attempted)+1,
        correct: correct,
        corrInc: parseInt(correct)+1,
        question: question.question,
        a1: question.guesses[0],
        a1Right: question.guesses[0] === question.answer,
        a2: question.guesses[1],
        a2Right: question.guesses[1] === question.answer,
        a3: question.guesses[2],
        a3Right: question.guesses[2] === question.answer,
        a4: question.guesses[3],
        a4Right: question.guesses[3] === question.answer,
        right: question.answer
      });
      return;
    }
    //  not authenticated -
    res.render("userLogin", {
      title: "Login or Registrer to play the Trivia Game.",
    });
  });

router
  .route("/register")
  .get(async (req, res) => {
    // if authenticated - goes to '/welcome' page
    if (req.session.usernameInput) {
      res.redirect("/welcome");
      return;
    }
    res.render("userRegister", {
      title: "SignUp",
    });
  })
  .post(async (req, res) => {
    
    const { usernameInput, passwordInput } = req.body;
    if (!usernameInput || !passwordInput) {
      // console.log("inside register post method...", usernameInput);
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Please enter an email, username and password to register for the Trivia Game.",
      });
      return;
    }
    if (typeof usernameInput !== "string") {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Invalid username",
      });
      return;
    }
    if (
      typeof passwordInput !== "string" ||
      passwordInput.trim().length < 8
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error:
          "Invalid password - password should be atleast 8 char long.",
      });
      return;
    }

    try {
      let result = await userData.createUser(usernameInput, passwordInput);
      if (result.insertedUser) {
        req.session.usernameInput = usernameInput;
        res.status(200).redirect("/welcome");

      } else {
        res.status(500).json({ error: "Internal Server Error - please contact Admin." });
      }
    } catch (error) {
      res.status(500).render("userRegister", {
        title: "SignUp",
        error: error.message ? error.message : error,
      });
    }
  });

router.route("/login").post(async (req, res) => {
  //code here for POST
  const { usernameInput, passwordInput } = req.body;
  if (!usernameInput || !passwordInput) {
    //console.log("inside login ...", req.body.passwordInput);
    res.status(400).render("userLogin", {
      title: "Login",
      error: "Please enter username and password to login into the Trivia Game.",
    });
    return;
  }
  if (
    typeof usernameInput !== "string"
  ) {
    res.status(400).render("userLogin", {
      title: "Login",
      error: "Invalid username.",
    });
    return;
  }
  if (
    typeof passwordInput !== "string" ||
    passwordInput.trim().length < 8 
  ) {
    res.status(400).render("userLogin", {
      title: "Login",
      error:
        "Invalid password - password should be atleast 8 char long.",
    });
    return;
  }

  try {
    let result = await userData.checkUser(usernameInput, passwordInput);
    if (result.authenticatedUser) {
      req.session.usernameInput = usernameInput;
      res.status(200).redirect("/welcome");
    }
  } catch (error) {
    res.status(500).render("userLogin", {
      title: "Login",
      error: error.message ? error.message : error,
    });
  }
});


router.route("/gameResults/:attempted/:correct").get(async (req, res) => {
  if (req.session.usernameInput) { //render -- handlebars
    let score = (parseInt(req.params.correct)/parseInt(req.params.attempted))*100;
    console.log(score);
    let leaderboard = generateLeaderboardData(req.session.usernameInput, score);
    console.log(leaderboard)
    res.status(200).render("gameResults", {
      name: req.session.usernameInput,
      score: score,
      title: "Results",
      u1Name: leaderboard[0].playerName,
      u1Score: leaderboard[0].score,
      u2Name: leaderboard[1].playerName,
      u2Score: leaderboard[1].score,
      u3Name: leaderboard[2].playerName,
      u3Score: leaderboard[2].score,
      u4Name: leaderboard[3].playerName,
      u4Score: leaderboard[3].score
    });
    // res.redirect('/gameResults');
    // req.session.destroy();
    // res.redirect("/");
  } else {
    let score = req.gameScore ? req.gameScore : 10;
    console.log(`Score: ${score}`);
    generateLeaderboardData("Mike", 25);
    res.status(400).render('error', {
      error: 'Could Not Load Game Results'
    });
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.render("logout", {
    title: "Logout",
  });
});

module.exports = router;

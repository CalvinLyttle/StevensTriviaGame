const express = require("express");
const router = express.Router();
let userData = require("../data/users");

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
  // if (req.session.usernameInput) {
  //   res.render("/welcomePage",{
  //     title:"Welcome,",
  //     name: req.session.usernameInput
  //   });
  //   return;
  // } else {
  //   //  not authenticated - go back to login screen
  //   res.status(400).render("userLogin", {
  //     //title: "Login",
  //     error:
  //       "Please Login again to access the Trivia Game.",
  //   });
  //   return;
  //   // return res.status(400).render("main", {
  //   //   title: "Stevens Trivia",
  //   // });
  // }
});

// this route shows the Question/Answers page - we might not need this route - can display questions
// and answers from Welcome Page only. 
// hence, commenting it for now.

/*router
  .route("/trivia")
  .get(async (req, res) => {
    if (req.session.usernameInput) {
      // if user is authenticated
      res.render("triviaQuestionsAnswers");
      return;
    }
    //  not authenticated -
    res.render("userLogin", {
      title: "Login or Registrer to play the Trivia Game.",
    });
  })
  .post(async (req, res) => {
    //display the question answers and post the answers into a form ??? TBD
    // all the necessary functions will be called from here, functions that are defined in 'data/users'
  }); 
  */

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
    if (typeof usernameInput !== "string" || usernameInput.includes(" ")) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Invalid username - Hint 'SophieAniston' is valid & 'Sophie Aniston' is invalid.",
      });
      return;
    }
    if (
      typeof passwordInput !== "string" ||
      passwordInput.trim().length < 6 ||
      passwordInput.includes(" ")
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error:
          "Invalid password - password should be atleast 6 char long,and should not not include epmty spaces.",
      });
      return;
    }
    const regexUpperCase = /[A-Z]/;
    const regexNumber = /[0-9]/;
    const regexSpecialChar = /[!@#\$%\^\&*\)\(+=._-]/;
    if (
      passwordInput.search(regexUpperCase) === -1 ||
      passwordInput.search(regexNumber) === -1 ||
      passwordInput.search(regexSpecialChar) === -1
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error:
          "Invalid password - atleast one uppercase,one number and one speacial char is required.",
      });
      return;
    }

    try {
      let result = await userData.createUser(usernameInput, passwordInput);
      if (result.insertedUser) {
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
    typeof usernameInput !== "string" ||
    usernameInput.includes(" ")
  ) {
    res.status(400).render("userLogin", {
      title: "Login",
      error: "Invalid username - Hint 'SophieAniston' is valid & 'Sophie Aniston' is invalid.",
    });
    return;
  }
  if (
    typeof passwordInput !== "string" ||
    passwordInput.trim().length < 6 ||
    passwordInput.includes(" ")
  ) {
    res.status(400).render("userLogin", {
      title: "Login",
      error:
        "Invalid password - password should be atleast 6 char long and should not include epmty spaces.",
    });
    return;
  }
  const regexUpperCase = /[A-Z]/;
  const regexNumber = /[0-9]/;
  const regexSpecialChar = /[!@#\$%\^\&*\)\(+=._-]/;
  if (
    passwordInput.search(regexUpperCase) === -1 ||
    passwordInput.search(regexNumber) === -1 ||
    passwordInput.search(regexSpecialChar) === -1
  ) {
    res.status(400).render("userLogin", {
      title: "Login",
      error:
        "Invalid password - atleast one uppercase,one number and one speacial char is required.",
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

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.render("logout", {
    title: "Logout",
  });
});

module.exports = router;

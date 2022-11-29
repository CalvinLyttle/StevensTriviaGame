//all the routing calls will be here 
//get, post

//require express, express router and bcrypt.
const express = require("express");
const router = express.Router();
let userData = require("../data/users");

router.route("/").get(async (req, res) => {
  //if the user is already logged in(authenticated) and goes to localhost:3000
//   if (req.session.usernameInput) {
//     //console.log("inside / get..", req.session.usernameInput);
//     res.redirect("/protected");
//     return;
    //   }
  res.render("userLogin", {
    title: "Login",
  });
});

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.usernameInput) {
      res.redirect("/protected");
      return;
    }
    res.render("userRegister", {
      title: "SignUp",
    });
  })
  .post(async (req, res) => {
    //code here for POST
    const { usernameInput, passwordInput } = req.body;
    if (!usernameInput || !passwordInput) {
     // console.log("inside register post method...", usernameInput);
      res.status(400).render("userRegister", {
        title: "SignUp",
        error: "Please enter email and password to log-in the Trivia Game.",
      });
      return;
    }
    if (
      typeof usernameInput !== "string" ||
      usernameInput.includes(" ")
    ) {
      res.status(400).render("userRegister", {
        title: "SignUp",
        error:
          "Invalid email.",
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
          "Invalid password - password should be atleast 6 char long, a string and does not include epmty spaces.",
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
        res.status(200).redirect("/");
      } else {
        res.status(500).json({ error: "Internal Server Error" });
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
    console.log("inside login ...", req.body.passwordInput);
    res.status(400).render("userLogin", {
      title: "Login",
      error: "Please enter email and password to log-in the Trivia Game.",
    });
    return;
  }
  if (
    typeof usernameInput !== "string" ||
    usernameInput.trim().length < 4 ||
    usernameInput.includes(" ")
  ) {
    res.status(400).render("userLogin", {
      title: "Login",
      error:
        "Invalid username - username should be atleast 4 char long, a string and does not include epmty spaces.",
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
        "Invalid password - password should be atleast 6 char long, a string and does not include epmty spaces.",
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
    //console.log("result after login..", result);
    if (result.authenticatedUser) {
      req.session.usernameInput = usernameInput;
      res.status(200).redirect("/protected");
    }
  } catch (error) {
    res.status(500).render("userLogin", {
      title: "Login",
      error: error.message ? error.message : error,
    });
  }
});

router.route("/protected").get(async (req, res) => {
  //code here for GET
  //console.log("redirected to protect");
  res.render("private", {
    title: "Protected",
    name: req.session.usernameInput,
    dateTime: new Date().toUTCString(),
  });
});


module.exports = router;

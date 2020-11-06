const createError = require("http-errors");
const passport = require("passport");

module.exports.doGoogleLogin = (req, res, next) => {
  const passportController = passport.authenticate(
    "google",
    {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    },
    (error, user) => {
      if (error) {
        next(error);
      } else {
        req.session.userId = user._id;
        res.redirect("/");
      }
    }
  );

  passportController(req, res, next);
};

module.exports.googleCallback = (req, res, next) => {
  const passportGoogleCallback = passport.authenticate(
    "google",
    {
      successRedirect: "/tours",
      failureRedirect: "/login",
    },
    (error, user) => {
      req.session.userId = user._id;
      res.redirect("/");
    }
  );
  passportGoogleCallback(req, res, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createError(400, "Missing credentials");
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw createError(400, "Wrong credentials");
      } else {
        return user.checkPassword(password).then((match) => {
          if (!match) {
            throw createError(400, "Wrong credentials");
          } else {
            req.session.user = user;
            res.json(user);
          }
        });
      }
    })
    .catch((e) => next(e));
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.status(204).json();
};

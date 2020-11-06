const passport = require("passport");
const User = require("../models/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const randomPassword = () => Math.random().toString(36).substring(7);

const google = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.ABSOLUTEURI}/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.googleID": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: profile.provider + randomPassword(),
            social: {
              googleID: profile.id,
            },
            activation: {
              active: true,
            },
          });

          newUser
            .save()
            .then((user) => {
              console.log("user", user);
              next(null, user);
            })
            .catch((err) => {
              next(err);
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(google);

module.exports = passport.initialize();

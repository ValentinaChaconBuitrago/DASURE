const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoUtils = require("../db/MongoUtils");
const passportInit = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "https://dasure.herokuapp.com/auth/callback"
            },
            function (accessToken, refreshToken, profile, cb) {
                let imageUrl = "https://www.twago.es/img/2018/default/no-user.png";
                if (profile.photos && profile.photos.length) {
                    imageUrl = profile.photos[0].value;
                }
                mongoUtils
                    .findOrCreateDocumentPromise("application", "users", {
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        photo: imageUrl
                    })
                    .then(user => cb(null, user));
            }
        )
    );

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
};
module.exports.passportInit = passportInit;

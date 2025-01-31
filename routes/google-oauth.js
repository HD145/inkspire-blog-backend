require('dotenv').config()

const express = require("express");
const passport = require('../common/google-config'); 
const JWT = require("jsonwebtoken");

const app = express();

const oAuthRouter = express.Router();

oAuthRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

oAuthRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = JWT.sign({ username: req.user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        console.log("tokk", req);

    
        res.cookie('token', token, {
            httpOnly: false,
            secure: true,
            maxAge: 3600000,
            sameSite: 'none',
        });

        res.redirect(process.env.FRONTEND_URL);
    }
);


module.exports = {
    oAuthRouter
}
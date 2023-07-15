const express = require('express');
const { registerUser, loginUser, logoutUser, isUserAuthenticated, setAsGuest } = require('../../controllers/userController/userControl');
const userRouter = express.Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').get(logoutUser)
userRouter.route('/').get(isUserAuthenticated)
userRouter.route('/guest').get(setAsGuest)
module.exports = {userRouter}
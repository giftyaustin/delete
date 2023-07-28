const { User } = require("../models/userModel");
const { CustomError } = require("../errorHandling/customError");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("./tryCatch");

exports.isUserAuthorized = tryCatch(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new CustomError("Not authorized to perform this action", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded);

  if (!user) {
    return next(
      new CustomError("user signed out, try logging in again", 401)
    );
  }
  req.user = user
  next();
});
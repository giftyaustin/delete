const { User } = require("../models/userModel");
const { Product } = require("../models/productModel");
const { CustomError } = require("../errorHandling/customError");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("./tryCatch");

exports.isAuthorized = tryCatch(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new CustomError("Not authorized to perform this action", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded);

  if (!user || user.role !== "admin") {
    return next(
      new CustomError("user have no authorization to perform the action", 401)
    );
  }
  req.user = user
  next();
});

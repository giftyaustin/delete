const express = require("express");
const { isUserAuthorized } = require("../../middlewares/isUserAuthorized");
const {
  addToCart,
  getCart,
  deleteCartItem,
  deleteEntireCart,
  changeProductQantity,
  sendPopulatedCartResponse,
} = require("../../controllers/cartController/cartController");
const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(isUserAuthorized, getCart, sendPopulatedCartResponse)
  .delete(isUserAuthorized, deleteEntireCart)
  .put(isUserAuthorized, changeProductQantity);
cartRouter
  .route("/:id")
  .post(isUserAuthorized, addToCart, sendPopulatedCartResponse)
  .delete(isUserAuthorized, deleteCartItem, sendPopulatedCartResponse)
 
module.exports = { cartRouter };

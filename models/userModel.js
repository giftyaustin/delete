const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter valid email",
    },
  },
  password: { type: String, required: true, minLength: 8 , select:false},
  role: { type: String, default: "user" },
  avatar: { public_id: { type: String }, url: { type: String } },
});




userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
      next()
    }
    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.sendJWT= async function(req, res, next){

    const token = jwt.sign(this.id, process.env.JWT_SECRET)
    
    res.cookie('token', token, {httpOnly:true, sameSite:'Strict'})
 
    return res.json({
      success:true,
      message: 'token sent sucessfully'
    })
}

const User = mongoose.model("User", userSchema);
module.exports = { User };

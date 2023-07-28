const { CustomError } = require('../../errorHandling/customError');
const { tryCatch } = require('../../middlewares/tryCatch')
const {User} = require('../../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { sendMail } = require('../../utils/sendMail');
const { deleteOtpStoreUser, otpStore } = require('../../utils/deleteOtpStore');





// registeration 
exports.registerUser=tryCatch(async (req, res, next)=>{

    const user = await User.findOne({email:req.email})
    if(user){
        res.status(409).json({
            success:false,
            message:'Email already exists'
        })
    }
    else{ 
        next()
    }

})

// otp delivery
exports.sendOtp = tryCatch(async (req, res, next)=>{
    const otp = Math.ceil(Math.random()*10000)
    const info = await sendMail(otp, req.body.email)
    if(info){
        otpStore[req.body.email] = otp;

        deleteOtpStoreUser(req.body.email)
        res.json({
            success:true,
            message: 'OTP sent successfully',
            ps:`If you haven't received the mail please double the email you have entered`
        })
    }
    
})

// otp verification 
exports.verifyOtp = tryCatch(async (req, res, next)=>{
    const otp = req.params.otp
    if(otpStore[req.body.email]!==undefined && otpStore[req.body.email]===Number(otp)){
        const newUser = await User.create(req.body)
        await newUser.save()
        newUser.sendJWT(req, res, next)
    }
    else{
        res.json({
            success:false,
            message: 'Invalid otp'
        })
    }
})



// login user
exports.loginUser=tryCatch( async (req, res, next)=>{
   
    const user = await User.findOne({email:req.body.email}).select('+password');
    if(!user){
        return next(new CustomError('Invalid email or password'), 401)
    }
    const isPasswordMatched = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordMatched){
        return next(new CustomError('Invalid email or password', 401))
    }
    user.sendJWT(req, res, next)
})

// logout User
exports.logoutUser=tryCatch(async(req, res, next)=>{
  
    res.cookie('token', {}, {httpOnly:true, expires:new Date(Date.now())})
    res.json({
        message:'logged out Successfully'
    })
})

// is user authenticated
exports.isUserAuthenticated = tryCatch(async(req, res, next)=>{
    
    const token = req.cookies.token;
    if (!token) {
      return next(new CustomError("Not authorized to perform this action", 401));
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const user = await User.findById(decoded);
  
    if (!user) {
      return next(
        new CustomError("user have no authorization to perform the action", 401)
      );
    }
    res.json({
        authorized:true,
        user:user
    })

})

exports.setAsGuest=tryCatch((req, res, next)=>{
   
    res.cookie('token', '', {httpOnly:true,sameSite:'Strict', expires: new Date(Date.now())})
    return res.json({message:''})
})
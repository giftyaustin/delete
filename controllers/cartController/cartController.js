const { tryCatch } = require("../../middlewares/tryCatch");
const {Cart} = require("../../models/cartModel");

exports.addToCart=tryCatch(async (req, res, next)=>{
 
    let cart = await Cart.findOne({user:req.user.id}) 
   
   
    if(cart){
       
        const isPreviousProduct = cart.items.find(item=>item.product.toString()===req.params.id)
        if(isPreviousProduct){
            isPreviousProduct.quantity +=req.body.quantity || 1
            await cart.save()
            req.message = 'increased the product quantity in the cart'
            next()
        }
        else{
            cart.items.push({product:req.params.id, quantity:req.body.quantity})
            await cart.save()
            req.message='added new item to the cart'
            next()
        }
        
    }
    else{
        var newCart = await Cart.create({user:req.user.id, items:[{product:req.params.id, quantity:req.body.quantity}]})
        await newCart.save()
        req.message = 'cart created and added product successfully'
        next()
    }
})


exports.getCart= tryCatch(async (req, res, next)=>{
    const cart = await Cart.findOne({user:req.user.id})
    if(cart){
        next()
    }
    else{
        return res.status(200).json({
            items:[],
            message:'no products in the product'
        })
    }
})

exports.deleteCartItem=tryCatch(async (req, res, next)=>{
    let cart = await Cart.findOne({user:req.user.id})
    console.log(req.params.id)
    cart.items = cart.items.filter((c)=>{
        return c.product.toString()!==req.params.id})
    await cart.save()
    req.message = 'removed product from cart successfully'
    next()
})

exports.changeProductQantity=tryCatch(async (req, res, next)=>{
    let cart = await Cart.findOne({user:req.user.id})
    cart.items[req.body.itemIndex].quantity+=req.body.changeBy
    await cart.save()
    return res.json({
        message: 'changed product quantity'
    })
})

exports.deleteEntireCart=tryCatch(async (req, res, next)=>{
    let cart = await Cart.findOne({user:req.user.id})
    cart.items=[]
    await cart.save()
    return res.status(200).json({
        items: cart.items
    })
})


exports.sendPopulatedCartResponse = tryCatch(async (req, res, next) => {
  
      const populatedCart = await Cart.findOne({user:req.user.id})
        .populate('items.product')
        .exec();
  
      res.status(200).json({
        items: populatedCart.items,
        totalDiffProducts: populatedCart.items.length,
        message: req.message || 'fetched cart'
      })

     
  })
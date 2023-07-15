exports.tryCatch = (func)=>(req, res, next)=>{
    Promise.resolve(func(req, res, next)).catch(next)
}
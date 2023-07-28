const otpStore = {}

const deleteOtpStoreUser = (key)=>{
    setTimeout(()=>{
        delete otpStore[key]
    }, 60000)
}

module.exports= {otpStore, deleteOtpStoreUser}
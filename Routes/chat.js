const express=require('express')
const chatCont=require('../Controller/chat')
const userAuth=require('../Middleware/auth')
const router=express.Router()




router.post("/postChat",userAuth.authenticate,chatCont.postAddChat)
//router.post("/getChat",userAuth.authenticate,chatCont.getChats)





module.exports=router
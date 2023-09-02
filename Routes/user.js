const express=require('express')
const userCont=require('../Controller/user')
const router=express.Router()




router.post("/signUp",userCont.postSignUp)
router.post('/login',userCont.postLogin)



module.exports=router
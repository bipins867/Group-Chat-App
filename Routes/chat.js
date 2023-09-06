const express=require('express')
const chatCont=require('../Controller/chat')
const userAuth=require('../Middleware/auth')
const multer = require('multer');

const storage=multer.memoryStorage();
const uploads=multer({storage})


const router=express.Router()




router.post("/postChat",userAuth.authenticate,chatCont.postAddChat)

router.post('/postFile',userAuth.authenticate,uploads.array('file'),chatCont.postAddFile)
router.get("/getChat",userAuth.authenticate,chatCont.getChats)





module.exports=router
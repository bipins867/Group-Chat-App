const express=require('express')
const groupCont=require('../Controller/group')
const userAuth=require('../Middleware/auth')
const multer = require('multer');

const storage=multer.memoryStorage();
const uploads=multer({storage})

const router=express.Router()




router.post("/createGroup",userAuth.authenticate,groupCont.postCreateGroup)
router.get("/addGroup/:groupUID",userAuth.authenticate,groupCont.getAddGroup)
router.post('/postChat/:groupId',userAuth.authenticate,groupCont.postAddChat)
router.post('/postFile/:groupId',userAuth.authenticate,uploads.array('file'),groupCont.postAddFile)
router.get('/getChat/:groupId',userAuth.authenticate,groupCont.getChats)
router.get('/getGroups',userAuth.authenticate,groupCont.getGroups)

router.get('/getGroupMembers/:groupId',userAuth.authenticate,groupCont.getGroupMembers)
router.get('/removeGroupMember/:groupId/:userId',userAuth.authenticate,userAuth.userTypeAuthenticate,groupCont.removeMembersFromGroup)
router.get('/updateMemberType/:groupId/:userId/:memberType',userAuth.authenticate,userAuth.userTypeAuthenticate,groupCont.updateGroupMemberType)



module.exports=router
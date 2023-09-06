
const sequelize=require('../database')
const uuid=require('uuid')
const UserGroup=require('../Models/UserGroup')
const Group=require('../Models/Group')
const User=require('../Models/User')
const Sequelize=require('sequelize')
const serverSocket=require('../Server-Socket/server')
const awsServer=require('../Utils/awsServer')


exports.postCreateGroup=async(req,res,next)=>{
    const groupName=req.body.groupName
    const transaction=await sequelize.transaction();
    try{
        const groupUID=uuid.v4();
        //console.log(req.user)
        let obj={groupName:groupName,createdBy:req.user.id,groupUID:groupUID}
        
        const group=await Group.create(obj,{transaction:transaction})
        await group.addUser(req.user.id,{
            through:{
                memberType:"admin"
            },
            transaction:transaction
        })

        transaction.commit()

        res.json({groupId:group.id,userId:req.user.id,groupUID:groupUID,groupName:group.groupName})
    }
    catch(err){
        transaction.rollback();
        console.log(err)
        res.status(404).status("Something Went Wrong")
    }
    
    
}

exports.getAddGroup=async(req,res,next)=>{
    const groupUID=req.params.groupUID;
    
    try{
        
        const group=await Group.findOne({where:{groupUID:groupUID}})
        const user=await group.getUsers({where:{id:req.user.id}})
        
        
        
        if(user.length!=0){
            res.status(201).json({message:"User is already the member of group"})
        }
        else{
            const result=await group.addUser(req.user.id,{
                through:{
                    memberType:"member"
                },
            })
            
            res.json({groupId:group.id,userId:req.user.id,groupUID:groupUID,groupName:group.groupName})
        }
    }
    catch(err){
        console.log(err);
        res.status(404).json({error:"Something Went Wrong"})
    }
    
}

exports.postAddChat=async(req,res,next)=>{
    
    const chat=req.body.chat;
    const groupId=req.params.groupId;
    
    try{
        const group=await Group.findOne({where:{id:groupId}})
        obj={chat:chat,userId:req.user.id,userName:req.user.name}
        const result=await group.createGroupchat(obj)
        const groupdId=group.groupUID
        console.log(groupId)
        serverSocket.io.to(groupdId).emit('Recieved',chat,groupdId,req.user.id,req.user.name)
        res.json({message:"Message Sent"})

    }
    catch(err){
        console.log(err)
        res.status(404).json({error:"Something went wrong"})
    }
}


exports.postAddFile=async(req,res,next)=>{
    const file=req.files[0];
    const groupId=req.params.groupId;
    try{
        res.json({message:"File Sent"})
        const fileContent=file.buffer.toString()
        const ctime=new Date().getTime()
        const fileName=ctime+'-'+file.originalname;
        const awsResponse=await awsServer.upload2S3(fileContent,fileName)
        const fileUrl=awsResponse.Location;
        const group=await Group.findOne({where:{id:groupId}})
        obj={chat:fileUrl,userId:req.user.id,userName:req.user.name,isFile:1}
        const result=await group.createGroupchat(obj)
        const groupdId=group.groupUID
        
        
        serverSocket.io.to(groupdId).emit('RecievedFile',fileUrl,groupdId,req.user.id,req.user.name,true)
        
    }
    catch(err){
        console.log(err)
        res.status(405).json({error:"Something went wrong !"})
    }
    
}

exports.getChats=async(req,res,next)=>{
    const groupId=req.params.groupId;
    const lastChatId=req.query.lastChatId;
    
    

    try{
        if(!lastChatId){
            throw new Error("Something went wrong LastChatId not found")
        }
        const chatAr=[]
        const group=await Group.findByPk(groupId)
        if(!group){
            throw new Error("Soemthing went wrong")
        }
        const chats=await group.getGroupchats({where:{
            id:{
                [Sequelize.Op.gt]:lastChatId
            }
        }});
        
        res.json({chat:chats,userId:req.user.id})
    }
    catch(err){
        console.log(err)
        res.status(403).json({error:"Something went wrong"})
    }
}

exports.getGroups=async(req,res,next)=>{
    
   
    try{
       
        const result=await req.user.getGroups()
        
        
        res.json(result)
    }
    catch(err){
        console.log(err)
    }
}

exports.getGroupMembers=async(req,res,next)=>{
    const groupId=req.params.groupId;
    
    //console.log("SOME ERROR MAY BE",groupId)
    try{
        const userAr=[]
        const users=await UserGroup.findAll({where:{GroupId:groupId}})
        //console.log(users)
        for(const user of users){
            const newUser=await User.findByPk(user.UserId)
            const obj={userId:newUser.id,userName:newUser.name,memberType:user.memberType}
            userAr.push(obj)
        }

        res.json({users:userAr,groupId:groupId})
    }
    catch(err){
        console.log(err);
        res.status(402).json({error:"Something went wrong"})
    }
}

exports.removeMembersFromGroup=async(req,res,next)=>{
    const groupId=req.params.groupId;
    const userId=req.params.userId;

    try{
        
        const result=await UserGroup.destroy({where:{
            GroupId:groupId,
            UserId:userId
        }})
        
        res.json({message:'Successfully Removed From Group'})
    }
    catch(err){
        console.log(err)
        res.status(405).json({error:"Something went wrong"})
    }
}

exports.updateGroupMemberType=async(req,res,next)=>{
    const groupId=req.params.groupId;
    const memberType=req.params.memberType;
    const userId=req.params.userId;

    try{
        
        obj={memberType:memberType}
        const result=await UserGroup.update(obj,{where:{
            GroupId:groupId,
            UserId:userId
        }})
        
        res.json(result)
    }
    catch(err){
        console.log(err)
        res.status(405).json({error:"Something went wrong"})
    }
}
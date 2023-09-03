
const User=require('../Models/User')
const Chat=require('../Models/Chat')
const sequelize = require('../database');
const Sequelize=require('sequelize');
const { use } = require('../Routes/chat');

exports.postAddChat=async(req,res,next)=>{
    const chat=req.body.chat;
    try{
        const result=await req.user.createChat({chat:chat})

        res.json(result)
    }
    catch(err){
        console.log(err)
        res.status(404).json({error:"Something went wrong"})
    }
    
}

exports.getChats=async(req,res,next)=>{
    const userId=req.user.id;
    
    
    try{
        const chatAr=[]

        const chats=await Chat.findAll()
        for(const chat of chats){
            
            const us=await chat.getUser()
            
            const data={chat:chat.chat,userId:chat.UserId,name:us.name}
            
            chatAr.push(data)
        }
        res.json({chat:chatAr,userId:userId})
    }catch(err){
        console.log(err)
        res.status(401).json({error:"Something went wrong"})
    }
    
}
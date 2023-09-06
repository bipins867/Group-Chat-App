
const User=require('../Models/User')
const Chat=require('../Models/Chat')
const sequelize = require('../database');
const Sequelize=require('sequelize');
const serverSocket=require('../Server-Socket/server')


exports.postAddChat=async(req,res,next)=>{
    const chat=req.body.chat;
    try{
        const result=await req.user.createChat({chat:chat})

        serverSocket.io.to('global-chats').emit('Recieved',chat,'global-chats',req.user.id)
        res.json({message:"Message Sent"})

        
    }
    catch(err){
        console.log(err)
        res.status(404).json({error:"Something went wrong"})
    }
    
}

exports.getChats=async(req,res,next)=>{
    const userId=req.user.id;
    const lastChatId=req.query.lastChatId
    
    
    try{

        if(!lastChatId){
            throw new Error("SOMEHITNG WENT WRONG")
        }
        
        
        const chatAr=[]

        const chats=await Chat.findAll({where:{
            id:{
                [Sequelize.Op.gt]:lastChatId
            }
        }})
        for(const chat of chats){
            
            const us=await chat.getUser()
            
            const data={id:chat.id,chat:chat.chat,userId:chat.UserId,userName:us.name}
            
            chatAr.push(data)
        }
        res.json({chat:chatAr,userId:userId})
    }catch(err){
        console.log(err)
        res.status(401).json({error:"Something went wrong"})
    }
    
}

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
    //console.log("USED ID ",userId)
    const sqlQuery = `select chats.chat,users.name,users.id as userId from chats,users where chats.UserId=users.id`;
    try{
        const chat=await sequelize.query(sqlQuery,{type:Sequelize.QueryTypes.SELECT})
        res.json({chat,userId:userId})
    }catch(err){
        console.log(err)
        res.status(401).json({error:"Something went wrong"})
    }
    
}
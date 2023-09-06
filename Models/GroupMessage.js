const Sequelize=require('sequelize')
const sequelize=require('../database')

module.exports=sequelize.define('Groupchat',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    chat:Sequelize.STRING,
    userId:Sequelize.INTEGER,
    userName:Sequelize.STRING,
    isFile:{
        type:Sequelize.BOOLEAN,
        defaultValue:0
    }
    
})
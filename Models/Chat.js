const Sequelize=require('sequelize')
const sequelize=require('../database')

module.exports=sequelize.define('Chat',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    
    chat:Sequelize.STRING,
    isFile:{
        type:Sequelize.BOOLEAN,
        defaultValue:0
    }
})
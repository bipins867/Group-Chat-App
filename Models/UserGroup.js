const Sequelize=require('sequelize')
const sequelize=require('../database')

module.exports=sequelize.define('Usergroup',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    
    memberType:Sequelize.STRING
    
})
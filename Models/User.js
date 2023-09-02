const Sequelize=require('sequelize')
const sequelize=require('../database')

module.exports=sequelize.define('User',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        unique:true,
    },
    phone:Sequelize.STRING,
    password:Sequelize.STRING,
})
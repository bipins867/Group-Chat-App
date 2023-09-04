const Sequelize=require('sequelize')
const sequelize=require('../database')

module.exports=sequelize.define('Group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    
    groupName:Sequelize.STRING,
    groupUID:Sequelize.STRING,
    createdBy:Sequelize.INTEGER,  //User Id of the person
    

})
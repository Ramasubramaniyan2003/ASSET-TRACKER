const {Sequelize}=require('sequelize');
const {sequelize}=require('../config/db')
const {DataTypes}=require('sequelize');
const Admin=sequelize.define('admins',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userName:{
        type:DataTypes.STRING,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
    }
});

module.exports={Admin}
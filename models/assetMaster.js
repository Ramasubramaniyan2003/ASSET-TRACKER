const {sequelize}=require('../config/db')
const{DataTypes}=require('sequelize');

const assetMaster=sequelize.define('assets',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        unique:true,
        autoIncrement:true
    },
    serial_no:{
        type:DataTypes.STRING,
        unique:true,
    },
    name:{
        type:DataTypes.STRING,
    },
    model:{
        type:DataTypes.STRING
    },
    make:{
        type:DataTypes.STRING,
    },
    type:{
        type:DataTypes.STRING
    },
    scrapstatus:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.TEXT
    }

})
module.exports={assetMaster};
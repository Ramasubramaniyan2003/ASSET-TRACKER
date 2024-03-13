const {DataTypes,Association, INTEGER, STRING}=require('sequelize');
const {sequelize}=require('../config/db');


const employees= sequelize.define('employees',{
    id:{
     type: DataTypes.INTEGER,
      primaryKey:true,
      unique:true,
      autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
    },
    email:{
       type: DataTypes.STRING
    },
    contact:{
       type: DataTypes.STRING,
       unique:true
    },
    branch:{
        type:DataTypes.STRING
    },
    address:{
     type:DataTypes.STRING
    },
    joinDate:{
        type:DataTypes.STRING
    },
    endDate:{
        type:DataTypes.STRING
        
    },
    salary:{
        type:DataTypes.STRING
    },
    photo:{
        type:DataTypes.BLOB
    },
    department:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:"Inactive"
        
    }
})

module.exports={employees}
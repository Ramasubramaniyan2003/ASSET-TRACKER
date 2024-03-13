const { Sequelize } = require('sequelize')
const sequelize=new Sequelize('asset_tracker','postgres','cse@1234',{
    host:'localhost',
    port:5000,
    dialect:'postgres'
})
const connection= async ()=>{
    await sequelize.authenticate()
    console.log("connected");
}


module.exports={sequelize,connection};
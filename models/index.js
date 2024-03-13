const {employees}=require('./employee')
const{Admin}=require('./admin')
const {sequelize}=require('../config/db');
const{assetCategory}=require('./assetCategory')

sequelize.sync().then(
    console.log("all the tables created")
)
module.exports={Admin,employees,assetCategory}
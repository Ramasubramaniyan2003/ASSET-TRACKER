const { employees } = require('./employee')
const { Admin } = require('./admin')
const { sequelize } = require('../config/db');
const { assetCategory } = require('./assetCategory')
const { assetMaster } = require('./assetMaster');
const { assetHistory } = require('./assetHistory');

assetCategory.hasMany(assetMaster);
assetMaster.hasMany(assetHistory);

sequelize.sync().then(
    console.log("all the tables created")
)
module.exports = { Admin, employees, assetCategory, assetMaster, assetHistory }
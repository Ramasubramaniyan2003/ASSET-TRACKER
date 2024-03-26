const { employees } = require('./employee')
const { Admin } = require('./admin')
const { sequelize } = require('../config/db');
const { assetCategory } = require('./assetCategory')
const { assetMaster } = require('./assetMaster');
const { assetHistory } = require('./assetHistory');
const{Sample}=require('./sample')
const{Sample1}=require('./sample1')

// sample table
Sample.hasMany(Sample1)
Sample1.belongsTo(Sample)

assetCategory.hasMany(assetMaster);
assetMaster.belongsTo(assetCategory);
assetMaster.hasMany(assetHistory);
assetHistory.belongsTo(assetMaster)
employees.hasMany(assetHistory);
assetHistory.belongsTo(employees);
employees.hasMany(assetMaster)
assetMaster.belongsTo(employees);

sequelize.sync().then(
    console.log("all the tables created")
)
module.exports = { Admin, employees, assetCategory, assetMaster, assetHistory ,Sample,Sample1}
const { employees } = require('./employee')
const { Admin } = require('./admin')
const { sequelize } = require('../config/db');
const { assetCategory } = require('./assetcategory')
const { assetMaster } = require('./assetmaster');
const { assetHistory } = require('./assethistory');

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
module.exports = { Admin, employees, assetCategory, assetMaster, assetHistory }
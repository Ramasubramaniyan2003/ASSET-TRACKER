const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize');

const assetHistory = sequelize.define('assethistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    transaction: {
        type: DataTypes.STRING
    },
    issueto: {
        type: DataTypes.STRING
    },
    issuedate: {
        type: DataTypes.DATE,
    },
    reason: {
        type: DataTypes.STRING
    }
})
module.exports = { assetHistory };
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db')

const assetCategory = sequelize.define('assetcategory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }

})
module.exports = { assetCategory };
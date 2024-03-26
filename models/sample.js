const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize');
const Sample = sequelize.define('Sample', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Sample: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    }
});

module.exports = { Sample }
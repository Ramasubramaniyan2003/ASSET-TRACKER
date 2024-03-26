const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize');
const Sample1 = sequelize.define('Sample1', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SampleTable: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    }
});

module.exports = { Sample1 }
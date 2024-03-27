const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db')
const { DataTypes } = require('sequelize');
const bcrypt=require('bcrypt')
const Admin = sequelize.define('admins', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    }
});

// async function admininsert() {
//     const hashedpassword = await bcrypt.hash('admin', 10)
//     await Admin.create({ 'userName': 'admin', 'password':hashedpassword })
// }
// admininsert()
module.exports = { Admin }
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'roles',
    timestamps: false
});

module.exports = Role;
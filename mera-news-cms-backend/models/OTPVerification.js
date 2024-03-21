const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const OTPVerification = sequelize.define('OTPVerification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'otpverifications'
});

module.exports = OTPVerification;
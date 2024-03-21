const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ScheduledNews = sequelize.define('ScheduledNews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'schedulednews'
});

module.exports = ScheduledNews;
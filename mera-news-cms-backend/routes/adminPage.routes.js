const { getDataForAdminDashboard } = require("../controllers/adminPage.controller")


const adminPageRouter = require("express").Router();

adminPageRouter.route('/getDataForAdminDashboard').post(getDataForAdminDashboard);

module.exports = adminPageRouter;
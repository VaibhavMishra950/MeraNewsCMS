const News = require("../models/News");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = function (app) {
    app.post('/getDataForAdminDashboard', async (req, res) => {
        let token = req.body.token;
        try {
            let { roleId } = jwt.verify(token, process.env.JWT_SECRET);
            if (roleId < 2) {
                let userCount = await User.count({ where: { roleId: 2 } });
                let editorCount = await User.count({ where: { roleId: 1 } });
                let newsCount = await News.count();
                let totalViews = 0;
                for (const obj of (await News.findAll({ attributes: ['views'] }))) {
                    totalViews += obj.views;
                }
                res.json({ success: true, data: { userCount, editorCount, newsCount, totalViews } })
            } else {
                res.json({ success: false, message: "Unauthorized!" });
            }
        } catch (error) {
            res.json({ success: false, message: "Some Error Occurred!" });
        }

    })
}
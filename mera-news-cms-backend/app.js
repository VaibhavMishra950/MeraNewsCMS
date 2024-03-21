const express = require("express");
const sequelize = require("./models");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const ScheduledNews = require("./models/ScheduledNews");
const News = require("./models/News");
const { Op } = require("sequelize");
const cron = require("node-cron");
require('dotenv').config()


// Uploads Directory
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
    fs.mkdirSync("uploads/newsCoverImages");
    fs.mkdirSync("uploads/userProfiles");
}

// Cron Job
const cronJob = async () => {
    let d = new Date();
    let scheduledNewsList = await ScheduledNews.findAll({
        where: {
            scheduledAt: {
                [Op.lte]: d
            }
        }
    })
    if (scheduledNewsList.length > 0) {
        scheduledNewsList.forEach(async (scheduledItem) => {
            await News.update({ live: true }, {
                where: { id: scheduledItem.newsId }
            });
            await ScheduledNews.destroy({
                where: {
                    id: scheduledItem.id
                }
            })
        })
    }
}
cron.schedule("*/3 * * * * *", cronJob)

// Setting up app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.static('uploads'));

// Setting up routes
require("./routes/UserRoutes")(app);
require("./routes/NewsRoutes")(app);
require("./routes/AdminPageRoutes")(app);
require("./routes/OTPRoutes")(app);

app.get('/', (req, res) => {
    res.end("Yaay! The server is up and healthy.")
})
app.use(express.json())


sequelize.sync()
app.listen(process.env.APP_PORT || 5000, () => {
    console.log(`Server Running on ${process.env.APP_HOST}`);
})
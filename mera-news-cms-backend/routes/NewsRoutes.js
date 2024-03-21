const News = require("../models/News");
const jwt = require("jsonwebtoken");
const { uploadCoverImage } = require("../middlewares/multerUpload");
const User = require("../models/User");
const ScheduledNews = require("../models/ScheduledNews");

module.exports = function (app) {
    app.post('/publishNews', uploadCoverImage.single('newsCoverImg'), async (req, res) => {
        let coverImgName = req.file.filename;
        let token = req.body.token;
        let newsTitle = req.body.newsTitle;
        let newsSlug = req.body.newsSlug;
        let newsDesc = req.body.newsDesc;
        let newsContent = req.body.newsContent;
        let newsAuthor = req.body.newsAuthor;
        let newsCategory = req.body.newsCategory;
        let scheduling = req.body.scheduling;
        let scheduledAt;
        if (/^true$/i.test(scheduling)) {
            scheduledAt = req.body.scheduledAt;
        }
        try {
            let { roleId, username } = jwt.verify(token, process.env.JWT_SECRET);
            if ((await User.findOne({ where: { username } })).status == false) {
                res.json({ success: false, message: "You are marked as inactive! Please contact your admin." });
                return;
            }
            if (roleId < 2) {
                let _obj = {
                    slug: newsSlug.trim().toLowerCase(),
                    title: newsTitle,
                    description: newsDesc,
                    author: newsAuthor,
                    coverimg: coverImgName,
                    content: newsContent,
                    live: (!(/^true$/i.test(scheduling))),
                    category: newsCategory,
                    authorUsername: username
                }
                let n = await News.create(_obj);
                console.log(scheduling, typeof scheduling);
                if (/^true$/i.test(scheduling)) {
                    await ScheduledNews.create({
                        newsId: n.id,
                        scheduledAt: scheduledAt
                    })
                }
                res.json({ success: true });
            } else {
                res.json({ success: false, message: "Unauthorized!" });
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Some Error Occurred!" })
        }
    });

    app.post('/getNewsListAdmin', async (req, res) => {
        let token = req.body.token;
        try {
            let { roleId } = jwt.verify(token, process.env.JWT_SECRET);
            if (roleId < 2) {
                let data = await News.findAll();
                res.json({ success: true, data: data.reverse() })
            } else {
                res.json({ success: false, message: "Unauthorized!" });
            }
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Some error occurred!" });
        }
    });

    app.get('/isSlugAvailable', async (req, res) => {
        const slg = req.query.slg;
        if (slg.trim().toLowerCase().includes(" ")) {
            res.json({ available: false });
            return;
        }
        try {
            let list = await News.findAll({
                attributes: ['slug'],
            })
            if (list.length > 0) {
                let found = false;
                for (let i = 0; i < list.length; i++) {
                    if (slg.trim().toLowerCase() == list[i].slug) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    res.json({ available: false })
                }
                else {
                    res.json({ available: true })
                }
            }
            else {
                res.json({ available: true })
            }
        } catch (error) {
            res.json({ available: false })
        }
    });

    app.post('/updateNews', async (req, res) => {
        let token = req.body.token;
        let newsTitle = req.body.newsEditTitle;
        let newsSlug = req.body.newsEditSlug;
        let newsDesc = req.body.newsEditDesc;
        let newsContent = req.body.newsEditContent;
        let newsCategory = req.body.newsEditCategory;
        let newsLive = req.body.newsEditLive;
        let newsId = req.body.newsEditId;
        let _obj = {
            slug: newsSlug,
            title: newsTitle,
            description: newsDesc,
            content: newsContent,
            live: newsLive,
            category: newsCategory,
        }
        try {
            let { roleId, username } = jwt.verify(token, process.env.JWT_SECRET);
            let editor = await User.findOne({ where: { username } });
            if (editor.status == false) {
                console.log(editor);
                res.json({ success: false, message: "You are marked as inactive! Please contact your admin." });
                return;
            }
            if (roleId < 2) {
                let n = await News.update(_obj, {
                    where: {
                        id: newsId
                    }
                });
                res.json({ success: true });
            } else {

                res.json({ success: false, message: "Unauthorized!" })
            }
        } catch (error) {
            res.json({ success: false, message: "Some Error Occurred!" })
        }
    });

    app.get('/getAllNewsListViewer', async (req, res) => {
        try {
            let data = await News.findAll({
                where: {
                    live: true
                }
            });
            res.json({ success: true, data: data.reverse() })
        } catch (error) {
            res.json({ success: false, message: "Some error occurred!" })
        }
    });

    app.post('/getOneNewsUser', async (req, res) => {
        let slug = req.body.slug;
        try {
            let news = await News.findOne({
                where: {
                    slug: slug,
                    live: true
                }
            });
            if (news) {
                await News.update({ views: (news.views + 1) }, {
                    where: {
                        id: news.id
                    }
                });
                res.json({ success: true, news })
            } else {
                res.json({ success: false, message: "INVALID SLUG" })
            }
        } catch (error) {
            res.json({ success: false, message: "Some error Occurred!", error })
        }
    });

    app.post('/getCategoryNewsListUser', async (req, res) => {
        let category = req.body.category;
        try {
            let newsList = await News.findAll({
                where: {
                    live: true,
                    category
                }
            });
            if (newsList.length > 0) {
                res.json({ success: true, newsList: newsList.reverse() })
            } else {
                res.json({ success: false, message: "No news in this category!" })
            }
        } catch (error) {
            res.json({ success: false, message: "Some error occurred!" })
        }
    });

    app.post('/getEditorNewsListUser', async (req, res) => {
        let username = req.body.username;
        try {
            let newsList = await News.findAll({
                where: {
                    live: true,
                    authorUsername: username
                }
            });
            if (newsList.length > 0) {
                res.json({ success: true, newsList: newsList.reverse() })
            } else {
                res.json({ success: false, message: "No news by this author!" })
            }
        } catch (error) {
            res.json({ success: false, message: "Some error occurred!" })
        }
    });

    app.post('/deleteNews', async (req, res) => {
        let token = req.body.token;
        let newsId = req.body.id;
        try {
            let { roleId, username } = jwt.verify(token, process.env.JWT_SECRET);
            if ((await User.findOne({ where: { username } })).status == false) {
                res.json({ success: false, message: "You are marked as inactive! Please contact your admin." });
                return;
            }
            if (roleId < 2) {
                let n = await News.findOne({
                    where: {
                        id: newsId
                    }
                });
                await n.destroy();
                res.json({ success: true })
            } else {
                res.json({ success: false, message: "Unauthorized!" });
            }
        } catch (error) {
            res.json({ success: false, message: "Some error occurred!" });
        }
    });
}
const { uploadCoverImage } = require("../middlewares/multerUpload");
const newsRouter = require("express").Router()
const {
    publishNews,
    getNewsListAdmin,
    isSlugAvailable,
    updateNews,
    getAllNewsListViewer,
    getOneNewsUser,
    getCategoryNewsListUser,
    getEditorNewsListUser,
    deleteNews
} = require("../controllers/news.controller");

newsRouter.route('/publishNews').post(uploadCoverImage.single('newsCoverImg'), publishNews);
newsRouter.route('/getNewsListAdmin').post(getNewsListAdmin);
newsRouter.route('/isSlugAvailable').get(isSlugAvailable);
newsRouter.route('/updateNews').post(updateNews);
newsRouter.route('/getAllNewsListViewer').get(getAllNewsListViewer);
newsRouter.route('/getOneNewsUser').post(getOneNewsUser);
newsRouter.route('/getCategoryNewsListUser').post(getCategoryNewsListUser);
newsRouter.route('/getEditorNewsListUser').post(getEditorNewsListUser);
newsRouter.route('/deleteNews').post(deleteNews);

module.exports = newsRouter;
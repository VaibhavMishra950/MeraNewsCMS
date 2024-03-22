const { uploadProfileImage } = require("../middlewares/multerUpload");
const {
    isUsernameAvailable,
    registerUser,
    loginUser,
    getUserInfo,
    promoteUserToEditor,
    demoteEditorToUser,
    getEditors,
    getViewers,
    updateUser,
    deleteUser,
    getUserAccountDetails,
    changeProfilePicture
} = require("../controllers/user.controller");
const userRouter = require("express").Router();

userRouter.route('/isUsernameAvailable').get(isUsernameAvailable);
userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/getUserInfo').post(getUserInfo);
userRouter.route('/promoteUserToEditor').post(promoteUserToEditor);
userRouter.route('/demoteEditorToUser').post(demoteEditorToUser);
userRouter.route('/getEditors').post(getEditors);
userRouter.route('/getViewers').post(getViewers);
userRouter.route('/updateUser').post(updateUser);
userRouter.route('/deleteUser').post(deleteUser);
userRouter.route('/getUserAccountDetails').post(getUserAccountDetails);
userRouter.route('/changeProfilePicture').post(uploadProfileImage.single('userProfilePic'), changeProfilePicture);

module.exports = userRouter;
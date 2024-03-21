const multer = require('multer');

const coverPicsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/newsCoverImages/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const userProfilePicsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/userProfiles/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const uploadCoverImage = multer({ storage: coverPicsStorage, limits: { fieldSize: 8 * 25 * 1024 * 1024 } });
const uploadProfileImage = multer({ storage: userProfilePicsStorage, limits: { fieldSize: 8 * 25 * 1024 * 1024 } });

module.exports = { uploadCoverImage, uploadProfileImage };
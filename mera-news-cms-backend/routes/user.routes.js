const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { uploadProfileImage } = require("../middlewares/multerUpload");
const fs = require("fs");
const userRouter = require("express").Router();

userRouter.route('/isUsernameAvailable').get(async (req, res) => {
    const uname = req.query.uname;
    try {
        let list = await User.findAll({
            attributes: ['username'],
        })
        if (list.length > 0) {
            let found = false;
            for (let i = 0; i < list.length; i++) {
                if (uname.trim().toLowerCase() == list[i].username) {
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

userRouter.route('/register').post(async (req, res) => {
    if (await User.findOne({ where: { mobile: req.body.mobile } })) {
        res.json({ success: false, message: "Mobile Number Already Exists" });
        return;
    }

    if (await User.findOne({ where: { email: req.body.email } })) {
        res.json({ success: false, message: "Email ID Already Exists" });
        return;
    }

    let _obj = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        username: req.body.username.trim().toLowerCase(),
        mobile: req.body.mobile,
        email: req.body.email,
        password: CryptoJS.SHA512(req.body.password).toString(),
        roleId: 2,
        status: false
    }
    try {
        let u = await User.create(_obj);
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: "Some Error Occurred" })
    }
});

userRouter.route('/login').post(async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        let finalPass = CryptoJS.SHA512(req.body.password).toString();
        if (user && user.password == finalPass) {
            let token = jwt.sign({ email: user.email, firstname: user.firstname, lastname: user.lastname, username: user.username, roleId: user.roleId }, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });
            res.json({ success: true, token: token });
        }
        else {
            res.json({ success: false, message: "Invalid Credentials!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
});

userRouter.route('/getUserInfo').post(async (req, res) => {
    try {
        let token = req.body.token;
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let { firstname, lastname, email, username, roleId } = data;
        res.json({ success: true, firstname, lastname, email, username, roleId });
        return;
    } catch (error) {
        res.json({ success: false, message: error });
    }
});

userRouter.route('/promoteUserToEditor').post(async (req, res) => {
    try {
        let token = req.body.token;
        let userToPromote = req.body.uname;
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let { roleId } = data;
        if (roleId == 0) {
            let u = await User.update({ roleId: 1, status: true }, {
                where: {
                    username: userToPromote
                }
            });
            res.json({ success: true })
        } else {
            res.json({ success: false, message: "Unauthorized!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
});

userRouter.route('/demoteEditorToUser').post(async (req, res) => {
    try {
        let token = req.body.token;
        let editorToDemote = req.body.uname;
        let data = jwt.verify(token, process.env.JWT_SECRET);
        let { roleId } = data;
        if (roleId == 0) {
            let u = await User.update({ roleId: 2, status: false }, {
                where: {
                    username: editorToDemote
                }
            });
            res.json({ success: true })
        } else {
            res.json({ success: false, message: "Unauthorized!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
});

userRouter.route('/getEditors').post(async (req, res) => {
    try {
        let token = req.body.token;
        const { roleId } = jwt.verify(token, process.env.JWT_SECRET);
        if (roleId == 0) {
            let editors = await User.findAll({
                where: {
                    roleId: 1
                }
            });
            res.json({ success: true, editors });
        } else {
            res.json({ success: false, message: "Unauthorized" });
        }
    } catch (error) {
        res.json({ success: false, message: "Some Error Occurred" });
    }
});

userRouter.route('/getViewers').post(async (req, res) => {
    try {
        let token = req.body.token;
        const { roleId } = jwt.verify(token, process.env.JWT_SECRET);
        if (roleId == 0) {
            let viewers = await User.findAll({
                where: {
                    roleId: 2
                }
            });
            res.json({ success: true, viewers });
        } else {
            res.json({ success: false, message: "Unauthorized" });
        }
    } catch (error) {
        res.json({ success: false, message: "Some Error Occurred" });
    }
});

userRouter.route('/updateUser').post(async (req, res) => {
    let token = req.body.token;
    let uname = req.body.editUsername;
    let firstname = req.body.editFirstname;
    let lastname = req.body.editLastname;
    let status = req.body.editStatus;
    try {
        let { username, roleId } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(username);
        if (uname == username || roleId == 0) {
            let _obj = { firstname, lastname };
            if (status) {
                _obj.status = status;
            }
            let u = await User.update(_obj, {
                where: {
                    username: uname
                }
            });
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Unauthorized!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" });
    }
});

userRouter.route('/deleteUser').post(async (req, res) => {
    let token = req.body.token;
    let username = req.body.uname;
    try {
        let { uname, roleId } = jwt.verify(token, process.env.JWT_SECRET);
        if (uname == username || roleId == 0) {
            let u = await User.findOne({
                where: {
                    username
                }
            });
            await u.destroy();
            res.json({ success: true })
        } else {
            res.json({ success: false, message: "Unauthorized!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
});

userRouter.route('/getUserAccountDetails').post(async (req, res) => {
    let token = req.body.token;
    try {
        let { email } = jwt.verify(token, process.env.JWT_SECRET);
        let data = await User.findOne({
            attributes: ["email", "firstname", "id", "image", "lastname", "mobile", "username"],
            where: {
                email
            }
        });
        res.json({ success: true, data })
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
});

userRouter.route('/changeProfilePicture').post(uploadProfileImage.single('userProfilePic'), async (req, res) => {
    let token = req.body.token;
    let profilePicName = req.file.filename;
    console.log(profilePicName);
    try {
        let { username } = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findOne({ where: { username: username } });
        if (user) {
            let oldFile = user.image;
            await User.update({
                image: profilePicName
            }, {
                where: {
                    username: user.username
                }
            });
            if (oldFile) {
                let filepath = path.join(process.cwd(), "uploads/userProfiles", oldFile);
                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully: ' + filepath);
                    }
                });
            }
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Some Error Occurred!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some Error Occurred!" })
    }
});

module.exports = userRouter;
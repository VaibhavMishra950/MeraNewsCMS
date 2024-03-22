
const otpRouter = require("express").Router();
const {
    sendOTP,
    verifyOTP
} = require("../controllers/otp.controller");



otpRouter.route('/sendOTP').post(sendOTP);

otpRouter.route('/verifyOTP').post(verifyOTP);

module.exports = otpRouter;
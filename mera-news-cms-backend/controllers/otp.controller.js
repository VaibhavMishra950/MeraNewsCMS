const User = require("../models/User");
const OTPVerification = require("../models/OTPVerification");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});
const generateOTP = () => {
    return (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
}

const sendOTP = async (req, res) => {
    let email = req.body.email;
    try {
        if ((await User.findOne({ where: { email } }))) {
            if ((await OTPVerification.findOne({ where: { email } }))) {
                await OTPVerification.destroy({ where: { email } })
            }
            const OTP = generateOTP();
            const mailOptions = {
                from: process.env.GMAIL_USERNAME,
                to: email,
                subject: 'OTP Verification from Alina News CMS!',
                html: `<p>Your OTP for Alina News CMS is: <strong>${OTP}</strong> <br/>
                    This OTP will expire in one hour.</p>`,
            };
            transporter.sendMail(mailOptions, async (err, info) => {
                if (err) {
                    res.json({ success: false, message: "Some error occurred!" })
                } else {
                    await OTPVerification.create({ email, otp: OTP })
                    res.json({ success: true })
                }
            });
        } else {
            res.json({ success: false, message: "Couldn't find your account!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
};

const verifyOTP = async (req, res) => {
    let email = req.body.email;
    let otp = req.body.OTP;
    let newPass = req.body.newPass;
    try {
        let u = await User.findOne({ where: { email } });
        if (u) {
            let otpData = await OTPVerification.findOne({ where: { email: u.email } });
            if (otpData && otp == otpData.otp) {
                await u.update({ password: CryptoJS.SHA512(newPass).toString() }, { where: { email: u.email } });
                await OTPVerification.destroy({ where: { email: u.email } });
                res.json({ success: true })
            } else {
                res.json({ success: false, message: "Invalid OTP!" })
            }
        } else {
            res.json({ success: false, message: "Unauthorized!" })
        }
    } catch (error) {
        res.json({ success: false, message: "Some error occurred!" })
    }
};

module.exports = {
    sendOTP,
    verifyOTP
}
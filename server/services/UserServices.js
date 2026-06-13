const EmailSend = require("../utility/EmailHelper");
const UserModel = require("../models/UserModel");
const { Encodetoken } = require("../utility/TokenHelper");
const ProfileModel = require("../models/ProfileModel");
const bcrypt = require("bcrypt");

const UserOTPService = async (req) => {
    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);
        let EmailText = `Your Verification code is =${code}`;
        let EmailSubject = "Email Verification";

        await EmailSend(email, EmailText, EmailSubject);
        await UserModel.updateOne({ email: email }, { $set: { otp: code } }, { upsert: true });

        return { status: "success", message: "Your 6 digit OTP sent to your email address" };
    } catch (error) {
        
        return { status: "fail", message: "Something went wrong" };
    }
}

const VerifyOTPService = async (req) => {
    try {
        let email = req.params.email;
        let otp = Number(req.params.otp);

        let total = await UserModel.countDocuments({ email: email, otp: otp });

        if (total === 1) {
            let user = await UserModel.findOne({ email: email, otp: otp }).select('_id');
            let token = Encodetoken(email, user['_id'].toString());
            await UserModel.updateOne({ email: email }, { $set: { otp: 0 } });
            return { status: "success", message: "Valid OTP", token: token };
        } else {
            return { status: "fail", message: "Invalid OTP" };
        }
    } catch (e) {
        return { status: "fail", message: "Something went wrong" };
    }
}

const SaveProfileService = async (req) => {
    let user_id = req.headers.user_id;
    let reqBody = req.body;
    reqBody.userID = user_id;

    await ProfileModel.updateOne({ userID: user_id }, { $set: reqBody }, { upsert: true });
    return { status: "success", message: "Profile Saved Successfully" };
}

const UpdateProfileService = async (req) => {
    let user_id = req.headers.user_id;
    let reqBody = req.body;
    delete reqBody.userID;

    await ProfileModel.updateOne({ userID: user_id }, { $set: reqBody });
    return { status: "success", message: "Profile Updated Successfully" };
}

const ReadProfileService = async (req) => {
    try {
        let user_id = req.headers.user_id;
        let result = await ProfileModel.find({ userID: user_id });
        return { status: "success", data: result };
    } catch (e) {
        return { status: "failed", message: "Failed To Read Data From Profile" };
    }
}

const RegisterOTPService = async (req) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return { status: "fail", message: "Email and password are required" };
        }

        let existingUser = await UserModel.findOne({ email: email });
        if (existingUser && existingUser.is_verified) {
            return { status: "fail", message: "Email already registered. Please login." };
        }

        let code = Math.floor(100000 + Math.random() * 900000);
        let hashedPassword = await bcrypt.hash(password, 10);

        let EmailText = `Your Registration verification code is = ${code}`;
        let EmailSubject = "Registration OTP Verification";

        await EmailSend(email, EmailText, EmailSubject);
        await UserModel.updateOne(
            { email: email },
            { $set: { otp: code, password: hashedPassword, is_verified: false } },
            { upsert: true }
        );

        return { status: "success", message: "OTP sent to your email. Please verify to complete registration." };
    } catch (error) {
        return { status: "fail", message: "Something went wrong" };
    }
}

const VerifyRegisterOTPService = async (req) => {
    try {
        let { email, otp } = req.body;
        let otpNumber = Number(otp);

        let total = await UserModel.countDocuments({ email: email, otp: otpNumber });

        if (total === 1) {
            await UserModel.updateOne(
                { email: email },
                { $set: { otp: 0, is_verified: true } }
            );
            return { status: "success", message: "Registration successful! You can now login." };
        } else {
            return { status: "fail", message: "Invalid OTP" };
        }
    } catch (e) {
        return { status: "fail", message: "Something went wrong" };
    }
}

const LoginWithPasswordService = async (req) => {
    try {
        let { email, password } = req.body;

        let user = await UserModel.findOne({ email: email, is_verified: true });

        if (!user) {
            return { status: "fail", message: "Email not registered. Please register first." };
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { status: "fail", message: "Incorrect password" };
        }

        let token = Encodetoken(email, user._id.toString());
        return { status: "success", message: "Login successful", token: token };
    } catch (e) {
        return { status: "fail", message: "Something went wrong" };
    }
}

module.exports = {
    UserOTPService,
    VerifyOTPService,
    SaveProfileService,
    UpdateProfileService,
    ReadProfileService,
    RegisterOTPService,
    VerifyRegisterOTPService,
    LoginWithPasswordService
}
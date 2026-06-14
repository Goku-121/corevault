const { SaveProfileService, UpdateProfileService, ReadProfileService, RegisterService, LoginWithPasswordService } = require("../services/UserServices")

exports.UserLogout = async (req, res) => {
    let cookieOptions = { expires: new Date(Date.now() - 24 * 60 * 60 * 1000), httpOnly: false }
    res.cookie('token', "", cookieOptions)
    return res.status(200).json({ status: "success", message: "Logged out successfully" })
}

exports.CreateProfile = async (req, res) => {
    let result = await SaveProfileService(req)
    return res.status(200).json(result)
}

exports.UpdateProfile = async (req, res) => {
    let result = await SaveProfileService(req)
    return res.status(200).json(result)
}

exports.ReadProfile = async (req, res) => {
    let result = await ReadProfileService(req)
    return res.status(200).json(result)
}

exports.Register = async (req, res) => {
    let result = await RegisterService(req);
    return res.status(200).json(result);
}

exports.LoginWithPassword = async (req, res) => {
    let result = await LoginWithPasswordService(req);
    if (result['status'] === "success") {
        let cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: false
        };
        res.cookie('token', result['token'], cookieOptions);
    }
    return res.status(200).json(result);
}
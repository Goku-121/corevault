const { UserOTPService, VerifyOTPService, SaveProfileService,UpdateProfileService,ReadProfileService ,RegisterOTPService, VerifyRegisterOTPService, LoginWithPasswordService} = require("../services/UserServices")
exports.UserOTP= async (req, res) => { 

    let result = await UserOTPService(req)
    return res.status(200).json(result)

}

exports.VerifyLogin = async (req, res) => { 



    let result = await VerifyOTPService(req)
    
    if (result['status'] === "success") {
        
        //Cookie Option
        let cookieOptions = { expires: new Date(Date.now() + 24 * 6060 * 1000), httpOnly: false,}
    
    //Set Cookie with response
    res.cookie('token',result['token'],cookieOptions)
    
        return res.status (200).json(result)
    
    }
    
    
    
    else { 
      return res.status(200).json(result)
    }
    
}

exports.UserLogout = async (req, res) => {
 let cookieOptions = { expires: new Date(Date.now() - 24 * 6060 * 1000), httpOnly: false,}
    //Set Cookie with response For Logout
    res.cookie('token', "", cookieOptions)
    
    return res.status(200).json({ status: "success", message: "You have been logged out successfully" })
    

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

exports.RegisterOTP = async (req, res) => {
    let result = await RegisterOTPService(req);
    return res.status(200).json(result);
}
exports.VerifyRegisterOTP = async (req, res) => {
    let result = await VerifyRegisterOTPService(req);
    return res.status(200).json(result);
};

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
};

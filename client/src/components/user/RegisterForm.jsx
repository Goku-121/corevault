import React from 'react'
import SubmitButton from './UserSubmitButton'
import userStore from '../../store/UserStroe'
import ValidationHelper from '../../utility/ValidatonHelper'
import toast from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom"

const RegisterForm = () => {
    let navigate = useNavigate();
    let { RegisterFormData, RegisterFormOnChange, RegisterOTPRequest } = userStore();

    const onFormSubmit = async () => {
        if (!ValidationHelper.IsEmail(RegisterFormData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (ValidationHelper.IsEmpty(RegisterFormData.password || "")) {
            toast.error("Please enter a password");
            return;
        }
        if (RegisterFormData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (RegisterFormData.password !== RegisterFormData.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }

        let res = await RegisterOTPRequest(RegisterFormData.email, RegisterFormData.password);
        res ? navigate("/register-otp") : toast.error("Something went wrong. Please try again.");
    };

    return (
        <div className="container section">
            <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <div className="card p-5">
                        <h4>Create Account</h4>
                        <p>Enter your email and choose a password. We'll send a verification code.</p>

                        <input
                            value={RegisterFormData.email}
                            onChange={(e) => RegisterFormOnChange('email', e.target.value)}
                            placeholder="Email Address"
                            type="email"
                            className="form-control mb-3"
                        />
                        <input
                            value={RegisterFormData.password || ""}
                            onChange={(e) => RegisterFormOnChange('password', e.target.value)}
                            placeholder="Password (min 6 characters)"
                            type="password"
                            className="form-control mb-3"
                        />
                        <input
                            value={RegisterFormData.confirm_password || ""}
                            onChange={(e) => RegisterFormOnChange('confirm_password', e.target.value)}
                            placeholder="Confirm Password"
                            type="password"
                            className="form-control"
                        />

                        <SubmitButton
                            onClick={onFormSubmit}
                            className="btn mt-3 btn-success"
                            text="Send Verification Code"
                        />

                        <p className="mt-3 text-center mb-0">
                            Already have an account? <Link to="/login" className="text-success">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
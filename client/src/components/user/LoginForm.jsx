import React from 'react'
import SubmitButton from './UserSubmitButton'
import userStore from '../../store/UserStroe'
import AdminStore from '../../store/AdminStore'
import ValidatonHelper from '../../utility/ValidatonHelper'
import toast from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom"

const LoginForm = () => {

    let navigate = useNavigate();
    let { PasswordLoginFormData, PasswordLoginFormOnChange, LoginWithPasswordRequest } = userStore();
    let { isAdminLogin } = AdminStore();

    const onFormSubmit = async () => {
        if (!ValidatonHelper.IsEmail(PasswordLoginFormData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (ValidatonHelper.IsEmpty(PasswordLoginFormData.password || "")) {
            toast.error("Please enter your password");
            return;
        }

        let res = await LoginWithPasswordRequest(PasswordLoginFormData.email, PasswordLoginFormData.password);

        if (res) {
            // Admin admin dashboard 
            if (isAdminLogin()) {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        } else {
            toast.error("Invalid email or password");
        }
    }

    return (
        <div className="container section">
            <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <div className="card p-5">

                        <h4>Login</h4>
                        <p>Enter your email and password to login.</p>

                        <input
                            value={PasswordLoginFormData.email}
                            onChange={(e) => PasswordLoginFormOnChange('email', e.target.value)}
                            placeholder="Email Address"
                            type="email"
                            className="form-control mb-3"
                        />
                        <input
                            value={PasswordLoginFormData.password || ""}
                            onChange={(e) => PasswordLoginFormOnChange('password', e.target.value)}
                            placeholder="Password"
                            type="password"
                            className="form-control"
                        />

                        <SubmitButton
                            onClick={onFormSubmit}
                            className="btn mt-3 btn-success"
                            text="Login"
                        />

                        <p className="mt-3 text-center mb-0">
                            Don't have an account? <Link to="/register" className="text-success">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;
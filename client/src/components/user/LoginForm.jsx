
import SubmitButton from './UserSubmitButton'
import userStore from '../../store/UserStroe'
import ValidationHelper from '../../utility/ValidatonHelper'
import toast from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom"

const LoginForm = () => {
    let navigate = useNavigate();
    let { PasswordLoginFormData, PasswordLoginFormOnChange, UnifiedLoginRequest, isFormSubmit } = userStore();

    const onFormSubmit = async () => {
        if (!ValidationHelper.IsEmail(PasswordLoginFormData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (ValidationHelper.IsEmpty(PasswordLoginFormData.password || "")) {
            toast.error("Please enter your password");
            return;
        }

        let role = await UnifiedLoginRequest(
            PasswordLoginFormData.email,
            PasswordLoginFormData.password
        );

        if (role === "admin") {
            toast.success("Admin login successful!");
            navigate("/admin/dashboard");
        } else if (role === "user") {
            toast.success("Login successful!");
            navigate("/");
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
                            disabled={isFormSubmit}
                            className="btn mt-3 btn-success"
                            text={isFormSubmit ? "Signing in..." : "Login"}
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
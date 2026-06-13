import { create } from "zustand";
import axios from "axios";
import { setEmail, getEmail } from "../utility/utility";
import Cookies from "js-cookie";

const UserStore = create((set) => ({
    isLogin: () => {
        return !!Cookies.get('token');
    },
    getUserEmail: () => {
        return Cookies.get('userEmail') || "";
    },
    isFormSubmit: false,

    // OTP Login (existing)
    OtpFormData: { email: "" },
    OtpFormOnChange: (name, value) => {
        set((state) => ({
            OtpFormData: { ...state.OtpFormData, [name]: value }
        }));
    },
    LoginFormData: { email: "" },
    LoginFormOnChange: (name, value) => {
        set((state) => ({
            LoginFormData: { ...state.LoginFormData, [name]: value }
        }));
    },
    UserLogoutRequest: async () => {
        set({ isFormSubmit: true })
        let res = await axios.get(`/api/v1/UserLogout`);
        Cookies.remove('userEmail');
        set({ isFormSubmit: false })
        return res.data['status'] === "success";
    },
    UserOTPRequest: async (email) => {
        set({ isFormSubmit: true })
        let res = await axios.get(`/api/v1/UserOTP/${email}`);
        setEmail(email);
        set({ isFormSubmit: false })
        return res.data['status'] === "success";
    },
    VerifyLoginRequest: async (otp) => {
        set({ isFormSubmit: true })
        let email = getEmail();
        if (!email) {
            
            set({ isFormSubmit: false });
            return false;
        }
        let res = await axios.get(`/api/v1/VerifyLogin/${email}/${otp}`);
        set({ isFormSubmit: false })
        return res.data['status'] === "success";
    },

    // Registration (new)
    RegisterFormData: { email: "", password: "", confirm_password: "" },
    RegisterFormOnChange: (name, value) => {
        set((state) => ({
            RegisterFormData: { ...state.RegisterFormData, [name]: value }
        }));
    },
    RegisterOtpFormData: { otp: "" },
    RegisterOtpFormOnChange: (name, value) => {
        set((state) => ({
            RegisterOtpFormData: { ...state.RegisterOtpFormData, [name]: value }
        }));
    },
  RegisterOTPRequest: async (email, password) => {
        set({ isFormSubmit: true })
        
        
        let res = await axios.post(`/api/v1/RegisterOTP`, { email, password });
        
        setEmail(email);
        set({ isFormSubmit: false })
        return res.data['status'] === "success";
    },
    VerifyRegisterOTPRequest: async (otp) => {
        set({ isFormSubmit: true })
        let email = getEmail();
        
        if (!email) {
            
            set({ isFormSubmit: false });
            return false;
        }

        let res = await axios.post(`/api/v1/VerifyRegisterOTP`, { email, otp });
        
        set({ isFormSubmit: false })
        return res.data['status'] === "success";
    },
    // Password Login (new)
    PasswordLoginFormData: { email: "", password: "" },
    PasswordLoginFormOnChange: (name, value) => {
        set((state) => ({
            PasswordLoginFormData: { ...state.PasswordLoginFormData, [name]: value }
        }));
    },
    LoginWithPasswordRequest: async (email, password) => {
        set({ isFormSubmit: true })
        let res = await axios.post(`/api/v1/LoginWithPassword`, { email, password });
        if (res.data['status'] === "success") {
            Cookies.set('userEmail', email);
        }
        set({ isFormSubmit: false })
        return res.data['status'] === "success";
    },

 // Profile Management 
ProfileForm: {
    cus_name: "",
    cus_add: "",
    cus_city: "",
    cus_country: "",
    cus_phone: "",
    cus_state: "",
    cus_fax: "",
    cus_postcode: "",

    shipping_name: "",      
    shipping_address: "",   
    shipping_city: "",
    shipping_country: "",
    shipping_phone: "",
    shipping_postalcode: "", 
    shipping_state: "",
},

ProfileLoading: false,

ProfileFormChange: (name, value) => {
    set((state) => ({
        ProfileForm: {
            ...state.ProfileForm,
            [name]: value,
        },
    }));
},

ProfileDetails: null,

ProfileDetailsRequest: async () => {
    set({ ProfileLoading: true });

    try {
        let res = await axios.get(`/api/v1/ReadProfile`);

        if (res.data["data"].length > 0) {
            let data = res.data["data"][0];

            set({
                ProfileDetails: data,
                ProfileForm: data,
                ProfileLoading: false,
            });
        } else {
            set({
                ProfileDetails: {},
                ProfileLoading: false,
            });
        }
    } catch (e) {
        set({ ProfileLoading: false });

        if (e.response && e.response.status === 401) {
            Cookies.remove("token");
            Cookies.remove("userEmail");
            window.location.href = "/login";
        }
    }
},

ProfileSaveRequest: async (PostBody) => {
    try {
        set({ ProfileLoading: true });

        const token = Cookies.get('token');  

        let res = await axios.post(`/api/v1/CreateProfile`, PostBody, {
            headers: {
                'token': token
            },
            withCredentials: true
        });

        set({ ProfileLoading: false });
        return res.data["status"] === "success";
    } catch (e) {
        set({ ProfileLoading: false });
        

        if (e.response && e.response.status === 401) {
            Cookies.remove("token");
            Cookies.remove("userEmail");
            window.location.href = "/login";
        }
        return false;
    }
},
}));
export default UserStore;
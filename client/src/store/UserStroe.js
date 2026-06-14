import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const UserStore = create((set) => ({
    isLogin: () => !!Cookies.get('token'),
    getUserEmail: () => Cookies.get('userEmail') || "",
    isFormSubmit: false,

    // Register
    RegisterFormData: { email: "", password: "", confirm_password: "" },
    RegisterFormOnChange: (name, value) => {
        set((state) => ({
            RegisterFormData: { ...state.RegisterFormData, [name]: value }
        }));
    },
    RegisterRequest: async (email, password) => {
        set({ isFormSubmit: true })
        try {
            let res = await axios.post(`/api/v1/Register`, { email, password });
            set({ isFormSubmit: false })
            return res.data['status'] === "success";
        } catch {
            set({ isFormSubmit: false })
            return false;
        }
    },

    // Login
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

    // Logout
    UserLogoutRequest: async () => {
        set({ isFormSubmit: true });
        const token = Cookies.get('token');
        let res = await axios.get(`/api/v1/UserLogout`, {
            headers: { 'token': token }
        });
        Cookies.remove('userEmail');
        Cookies.remove('token');
        set({ isFormSubmit: false });
        return res.data['status'] === "success";
    },

    // Profile
    ProfileForm: {
        cus_name: "", cus_add: "", cus_city: "", cus_country: "",
        cus_phone: "", cus_state: "", cus_fax: "", cus_postcode: "",
        shipping_name: "", shipping_address: "", shipping_city: "",
        shipping_country: "", shipping_phone: "", shipping_postalcode: "", shipping_state: "",
    },
    ProfileLoading: false,
    ProfileFormChange: (name, value) => {
        set((state) => ({ ProfileForm: { ...state.ProfileForm, [name]: value } }));
    },
    ProfileDetails: null,
    ProfileDetailsRequest: async () => {
        set({ ProfileLoading: true });
        try {
            const token = Cookies.get('token');
            let res = await axios.get(`/api/v1/ReadProfile`, { headers: { 'token': token } });
            if (res.data["data"].length > 0) {
                let data = res.data["data"][0];
                set((state) => ({
                    ProfileDetails: data,
                    ProfileForm: { ...state.ProfileForm, ...data },
                    ProfileLoading: false,
                }));
            } else {
                set({ ProfileDetails: {}, ProfileLoading: false });
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
                headers: { 'token': token },
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
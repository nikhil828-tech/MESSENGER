import {create} from "zustand";
import { axiosInstance as ax } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    isLogginOut:false,
    checkAuth: async () => {
        try {
            const res = await ax.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error")
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false});
        }
    },

    signup: async (data) =>{ 
        set({isSigningUp:true});
        try{
            const res = await ax.post("/auth/signup",data);
            set({authUser : res.data});

            //toast
            toast.success("Account create");
        } catch (error){
            toast.error(error.response.data.message);
        }finally {
            set({isSigningUp:false});
        }
    },
    login: async (data) =>{ 
        set({isLoggingIn:true});
        try{
            const res = await ax.post("/auth/login",data);
            set({authUser : res.data});

            //toast
            toast.success("Logged in successfully");
        } catch (error){
            toast.error(error.response.data.message);
        }finally {
            set({isLoggingIn:false});
        }
    },
    logout: async () => {
        set({isLogginOut:true});
        try{
            await ax.post("/auth/logout");
            toast.success("Logged out successfully");
            set({authUser:null});
            
        } catch (error){
            toast.error("error logging out");
        }
        
        
    }
}));
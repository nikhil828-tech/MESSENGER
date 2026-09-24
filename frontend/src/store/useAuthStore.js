import {create} from "zustand";
import { axiosInstance as ax } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,

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
    }
}));
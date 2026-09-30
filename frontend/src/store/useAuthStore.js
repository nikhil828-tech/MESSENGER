import {create} from "zustand";
import { axiosInstance as ax } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000":"/";
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    isLogginOut:false,
    socket:null,
    onlineUsers:[],
    checkAuth: async () => {
        try {
            const res = await ax.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in authcheck")
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
            get().connectSocket();
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

            get().connectSocket();
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
            get().disconnectSocket();
            
        } catch (error){
            toast.error("error logging out");
        }
        
        
    },

    updateProfile: async(data) =>{
        try {
            const res = await ax.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("profile updated successfully");
        } catch (error) {
            console.log("error in update profile");
            toast.error("Error try Again!");
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            withCredentials:true
        })

        socket.connect();

        set({socket})

        //listen
        socket.on("getOnlineUsers",(userIds) => {
            set({onlineUsers:userIds});
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },
}));
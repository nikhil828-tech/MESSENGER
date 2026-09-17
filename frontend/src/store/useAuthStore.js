import {create} from "zustand";

export const useAuthStore = create((set) => ({
    authUser: {name:"nick",_id:"123",age:20},
    isloggedIn: false,

    login: () => {
        console.log("login called");
        set({isloggedIn: true});
    },
    
}));
import { create } from "zustand";
import { axiosInstance as ax} from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set,get) => ({
    allContacts : [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: "null",
    isUserLoading : "false",
    isMessagesLoading: "false",
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,

    toggleSound: () =>{
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled});
    },

    setActiveTab: (tab) => set({activeTab:tab}),
    setselectedUser: (selectedUser) => set({selectedUser}),

    getAllContacts: async() => {
        set({isUserLoading:true});
        try {
            const res = await ax.get("messages/contacts");
            set({allContacts:res.data});

        } catch (error) {
            toast.error(error.response.data.messages);
        }finally {
            set({isUserLoading:false});
        }
    },

    getMyChatPartners: async() => {
        set({isUserLoading:true});
        try {
            const res = await ax.get("messages/chats");
            set({chats:res.data});

        } catch (error) {
            toast.error(error.response.data.messages);
        }finally {
            set({isUserLoading:false});
        }
    },

}));
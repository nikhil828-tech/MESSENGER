import { create } from "zustand";
import { axiosInstance as ax} from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set,get) => ({
    allContacts : [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading : "false",
    isMessagesLoading: "false",
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () =>{
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled});
    },

    setActiveTab: (tab) => set({activeTab:tab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),

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
    getMessagesByUserId: async (userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await ax.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went Wrong");
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage : async(messageData) => {
        const {selectedUser ,messages} = get();
        try {
            const res = await ax.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:messages.concat(res.data)});
        } catch (error) {
            toast.error(error.response?.data?.message || "Sonething wnet wrong");
        }
    }
}));
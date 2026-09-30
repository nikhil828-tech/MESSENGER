import { create } from "zustand";
import { axiosInstance as ax} from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/sounds/notification.mp3");
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
        const {authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id:tempId,
            sender:authUser._id,
            receiver: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        }
        // immidetaly update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await ax.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:messages.concat(res.data)});
        } catch (error) {
            set({messages:messages});
            toast.error(error.response?.data?.message || "Sonething wnet wrong");
        }
    },
    subscibeToMessages:() => {
        const {selectedUser , isSoundEnabled} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const currentMessages = get().messages;
            if (newMessage.sender !== selectedUser._id) return;
            set({messages:[...currentMessages,newMessage]});

            if(isSoundEnabled){
                notificationSound.currentTime = 0;//reset to start
                notificationSound.play().catch((e) => console.log("Audio play failed:",e));
            }
        });
    },
    unsubscibeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));
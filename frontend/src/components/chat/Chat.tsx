import { useEffect, useState } from "react";
import ChatList from "@/components/chat/ChatList";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { io, Socket } from "socket.io-client";
import { apiService } from "@/lib/api";


interface Message {
  message_id: number;
  chat_id: number;
  sender_id: number;
  sender_name: string;
  message_text: string;
  sent_at: string;
}

interface ChatProps {
  userId: number;
}

export default function Chat({ userId }: ChatProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Load all chats for the user
    apiService.getChats().then((data: any) => setChats(data));

    // Initialize socket
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentChat && socket) {
      socket.emit("join_chat", { chat_id: currentChat.chat_id });

      // Fetch chat history
      apiService.request(`/chat/messages/${currentChat.chat_id}`).then((data) => setMessages(data));

      // Listen for incoming messages
      socket.on("receive_message", (msg: Message) => {
        if (msg.chat_id === currentChat.chat_id) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [currentChat, socket]);

  const sendMessage = (text: string) => {
    if (socket && currentChat) {
      socket.emit("send_message", {
        chat_id: currentChat.chat_id,
        sender_id: userId,
        message_text: text,
      });
    }
  };

  return (
    <div className="flex h-full border rounded">
      <div className="w-1/4 border-r overflow-y-auto">
        <ChatList chats={chats} onSelect={(chat) => setCurrentChat(chat)} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.message_id} message={msg} currentUserId={userId} />
          ))}
        </div>
        {currentChat && <ChatInput onSend={sendMessage} />}
      </div>
    </div>
  );
}

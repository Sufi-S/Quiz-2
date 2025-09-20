import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { 
  Brain, BookOpen, Trophy, Calendar, MessageSquare, FileText, Target, ArrowRight, Play, Users, Zap 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

// Chat components
interface Message {
  message_id: number;
  chat_id: number;
  sender_id: number;
  sender_name: string;
  message_text: string;
  sent_at: string;
}

interface ChatType {
  chat_id: number;
  chat_name: string;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const { toast } = useToast();
  const [userId, setUserId] = useState<number>(1); // Replace with actual logged-in user ID

  // Chat states
  const [chats, setChats] = useState<ChatType[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, assignmentsData, chatsData] = await Promise.all([
          apiService.getQuizzes(),
          apiService.getAssignments(),
          apiService.getChats()
        ]);
        setQuizzes(quizzesData);
        setAssignments(assignmentsData);
        setChats(chatsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
    };

    fetchData();

    // Initialize socket
    const newSocket = io("http://localhost:5000"); // Flask-SocketIO backend
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch messages and join socket room
  useEffect(() => {
    if (currentChat && socket) {
      socket.emit("join_chat", { chat_id: currentChat.chat_id });

      // Fetch chat history
      apiService.request(`/chat/messages/${currentChat.chat_id}`).then((data: Message[]) => {
        setMessages(data);
      });

      // Listen for incoming messages
      socket.on("receive_message", (msg: Message) => {
        if (msg.chat_id === currentChat.chat_id) {
          setMessages(prev => [...prev, msg]);
        }
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [currentChat, socket]);

  const sendMessage = () => {
    if (messageText.trim() && socket && currentChat) {
      const payload = {
        chat_id: currentChat.chat_id,
        sender_id: userId,
        message_text: messageText
      };
      socket.emit("send_message", payload);
      setMessages(prev => [...prev, { ...payload, message_id: Date.now(), sender_name: "You", sent_at: new Date().toISOString() }]);
      setMessageText("");
    }
  };

  // UI Data (stats, quizzes, AI suggestions, etc.)
  const stats = [
    { title: "Quizzes Completed", value: "24", icon: <Trophy className="w-5 h-5" /> },
    { title: "Study Streak", value: "7 days", icon: <Target className="w-5 h-5" /> },
    { title: "Notes Created", value: "156", icon: <FileText className="w-5 h-5" /> },
    { title: "AI Suggestions", value: "89", icon: <Brain className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* ...header and stats remain same... */}

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Existing dashboard cards: AI, quizzes, quick actions */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat Sidebar */}
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-edu-secondary" />
                  <span>Chats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                {chats.map(chat => (
                  <div
                    key={chat.chat_id}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${currentChat?.chat_id === chat.chat_id ? "bg-gray-200" : ""}`}
                    onClick={() => setCurrentChat(chat)}
                  >
                    {chat.chat_name}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Selected Chat */}
            {currentChat && (
              <Card className="shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle>{currentChat.chat_name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto">
                  {messages.map(msg => (
                    <div key={msg.message_id} className={`p-2 rounded ${msg.sender_id === userId ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}>
                      <strong>{msg.sender_name}:</strong> {msg.message_text}
                    </div>
                  ))}
                </CardContent>
                <div className="flex border-t p-2">
                  <input
                    className="flex-1 border rounded p-2"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button className="ml-2 bg-blue-500 text-white p-2 rounded" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageProps {
  message: {
    message_id: number;
    sender_id: number;
    sender_name: string;
    message_text: string;
  };
  currentUserId: number;
}

export default function ChatMessage({ message, currentUserId }: MessageProps) {
  const isMe = message.sender_id === currentUserId;
  return (
    <div className={`my-1 p-2 rounded ${isMe ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}>
      <strong>{message.sender_name}:</strong> {message.message_text}
    </div>
  );
}

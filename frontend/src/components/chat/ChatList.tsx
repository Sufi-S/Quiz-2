interface ChatListProps {
  chats: any[];
  onSelect: (chat: any) => void;
}

export default function ChatList({ chats, onSelect }: ChatListProps) {
  return (
    <div>
      {chats.map((chat) => (
        <div
          key={chat.chat_id}
          className="p-2 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(chat)}
        >
          {chat.chat_name}
        </div>
      ))}
    </div>
  );
}

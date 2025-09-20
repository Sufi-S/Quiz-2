import { useState } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="flex border-t p-2">
      <input
        className="flex-1 border rounded p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="ml-2 bg-blue-500 text-white p-2 rounded" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

import { Button, Input, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

interface ChatRoomProps {
  roomName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomName }) => {
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const chatSocket = useRef<WebSocket | null>(null);
  const {data:session} = useSession();

  useEffect(() => {
    const url = `ws://${process.env.NEXT_PUBLIC_NEXTURL_WS}ws/chat/${roomName}/`;
    console.log(url);
    chatSocket.current = new WebSocket(url);

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setChatLog((prevChatLog) => [...prevChatLog, data.message]);
    };

    chatSocket.current.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
    };

    return () => {
      chatSocket.current?.close();
    };
  }, [roomName]);

  const handleSendMessage = () => {
    if (chatSocket.current && message.trim()) {
      chatSocket.current.send(
        JSON.stringify({
          message: session?.user?.name + ': ' + message,
        })
      );
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-blue-900 h-screen w-screen p-12 flex gap-6 flex-col items-center justify-end">
      <h1 className="text-3xl text-white">Sala {roomName}</h1>
      <textarea
        id="chat-log"
        value={chatLog.join("\n")}
        readOnly
        className="rounded-3xl h-full w-full p-6 text-lg"
      />
      <div className="flex w-full items-center">
        <input
          id="chat-message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Type your message here"
          maxLength={75}
          className="w-[80%] h-10 rounded-tl-3xl rounded-bl-3xl p-4"
        />
        <button
          id="chat-message-submit"
          type="button"
          value="Send"
          onClick={handleSendMessage}
          className="bg-green-800 w-[20%] items-center justify-center text-white flex h-10 rounded-tr-3xl rounded-br-3xl"
        ><MdOutlineKeyboardDoubleArrowRight className="w-6 h-6" /></button> 
      </div>
    </div>
  );
};

export default ChatRoom;

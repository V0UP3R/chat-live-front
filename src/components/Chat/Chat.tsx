import React, { useState, useEffect, useRef } from 'react';

interface ChatRoomProps {
    roomName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomName }) => {
    const [userName, setUserName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [chatLog, setChatLog] = useState<string[]>([]);
    const chatSocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        const url = `ws://10.29.8.83:8000/ws/chat/${roomName}/`;
        console.log(url);
        chatSocket.current = new WebSocket(url);

        chatSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setChatLog((prevChatLog) => [...prevChatLog, data.message]);
        };

        chatSocket.current.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };

        return () => {
            chatSocket.current?.close();
        };
    }, [roomName]);

    const handleSendMessage = () => {
        if (chatSocket.current && message.trim()) {
            chatSocket.current.send(JSON.stringify({
                'message': message
            }));
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <input
                id="user-name"
                type="text"
                size={100}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
            />
            <br />
            <textarea
                id="chat-log"
                cols={100}
                rows={20}
                value={chatLog.join('\n')}
                readOnly
            />
            <br />
            <input
                id="chat-message-input"
                type="text"
                size={100}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Type your message here"
            />
            <br />
            <input
                id="chat-message-submit"
                type="button"
                value="Send"
                onClick={handleSendMessage}
            />
        </div>
    );
};

export default ChatRoom;

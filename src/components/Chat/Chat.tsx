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
        <div id='dashboard' className='h-screen w-screen p-12 flex flex-col items-center justify-center border border-solid border-black border-opacity-45'>
            {/* <input
                id="user-name"
                type="text"
                size={100}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
            /> */}
            <br />
            <textarea
                id="chat-log"
                cols={100}
                rows={20}
                value={chatLog.join('\n')}
                readOnly
                className='rounded-3xl p-6 text-lg'
            />
            <br />
            <input
                id="chat-message-input"
                type="text"
                size={100}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeyPress}
                className='p-4 bg-slate-800 rounded-3xl text-white border border-solid border-black border-opacity-45'
                placeholder="Type your message here"
                maxLength={75}
            />
            <br />
            <input
                id="chat-message-submit"
                type="button"
                value="Send"
                onClick={handleSendMessage}
                className='bg-green-900 w-60 h-20'
            />
        </div>
    );
};

export default ChatRoom;

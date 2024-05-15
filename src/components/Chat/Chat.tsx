import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {

    const newSocket = io('http://127.0.0.1:8000/ws/chat/sala/', { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket');
      setSocket(newSocket); // Definindo o socket após a conexão bem-sucedida
    });

    newSocket.on('chat_message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket && message.trim() !== '') { // Verificando se o socket é válido
      socket.emit('chat_message', message);
      setMessage('');
    }
  };

  const handleKeyPress = (event:any) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">{msg}</div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;

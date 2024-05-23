"use client";
import ChatRoom from "@/components/Chat/Chat";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const { data: session } = useSession();
  const [enter, setEnter] = useState(false);

  useEffect(() =>{
    const websocketURL = 'ws://192.168.0.60:8000/ws/active_rooms/';
    const websocket = new WebSocket(websocketURL);

    websocket.onopen = () => {
      console.log('Conectado ao servidor WebSocket para obter salas ativas.');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const activeRooms = data.rooms;
      console.log('Salas ativas:', activeRooms);
    };

    websocket.onerror = (error) => {
      console.error('Erro de WebSocket:', error);
    };

    websocket.onclose = () => {
      console.log('Conexão WebSocket fechada.');
    };
  },[])

  const handleRoomChange = (e: any) => {
    setRoom(e.target.value);
  };

  const handleCreateRoom = () => {
    setEnter(true);
  };

  if (session?.user && room !== "" && enter) {
    return <ChatRoom roomName={room} />;
  } else {
    return (
      <div className="bg-blue-800 w-screen h-screen p-14">
        <h1 className="uppercase text-4xl mb-8">Chat</h1>
        <div className="flex max-w-3xl gap-3">
          <Input
            className="h-10"
            type="text"
            variant={"faded"}
            label="Crie uma nova sala"
            value={room}
            onChange={handleRoomChange}
          />
          <Button className="h-10" onClick={handleCreateRoom}>
            Criar
          </Button>
        </div>
      </div>
    );
  }
}

'use client'
import ChatRoom from "@/components/Chat/Chat";
import { useRouter } from "next/router";

export default function Page({ params }: { params: { room: string } }) {
  
  if (!params.room || typeof params.room !== 'string') {
    return <div>Loading...</div>;
  }

  return <ChatRoom roomName={params.room} />;
}

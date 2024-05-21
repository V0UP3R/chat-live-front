'use client'
import ChatRoom from "@/components/Chat/Chat";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { room: string } }) {

  const router = useRouter();

  const {data:session} = useSession(); 
  
  if (!params.room || typeof params.room !== 'string') {
    return <div>Loading...</div>;
  }

  if(session?.user?.email) {
    return <ChatRoom roomName={params.room} />;
  } else {
    <>ERRRRORRR</>
  }
}

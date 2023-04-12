import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/redis";
import { User, getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import Messages from "./Messages";
import ChatInput from "./ChatInput";

interface Props {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = results.map((message) => JSON.parse(message) as Message);
    const messages = dbMessages.reverse();
    return messages;
  } catch (error) {
    notFound();
  }
}

export default async function ChatPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const { chatId } = params;

  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(
    `user:${chatPartnerId}:profile`
  )) as UserProfile;
  const chatUser = (await db.get(
    `user:${session.user.id}:profile`
  )) as UserProfile;
  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-full w-full">
      <div className="flex justify-between py-3 border border-b-2 border-disabled px-2">
        <div className="relative">
          <div className="relative w-12 h-12">
            <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner.image || ""}
              alt={`${chatPartner.username} profile picture`}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col leading-tight px-4">
          <div className="text-xl flex items-center">
            <span className="text-black mr-3 font-semibold">
              {chatPartner.username}
            </span>
          </div>
          <span className="text-sm text-disabled break-all">
            {chatPartner.description}
          </span>
        </div>
      </div>
      <Messages
        initialMessages={initialMessages}
        sessionId={chatUser.id}
        sessionImage={chatUser.image || ""}
        chatPartner={chatPartner}
        chatId={chatId}
      />
      <ChatInput
        chatPartner={chatPartner}
        chatId={chatId}
      />
    </div>
  );
}

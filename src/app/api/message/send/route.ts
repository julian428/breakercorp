import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { fetchRedis } from "@/lib/redis";
import { toPusherKey } from "@/lib/utils";
import { nanoid } from "nanoid";
import { User, getServerSession } from "next-auth";
import { Response } from "pusher";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!text || text.length === 0) {
      return new Response("Message to short!", { status: 400 });
    }

    if (text.length > 2048) {
      return new Response("Message to long!", { status: 400 });
    }

    if (!session)
      return new Response("Unauthorized `not logged in`", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized `not a member of chat`", {
        status: 401,
      });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string;
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new Response("Unauthorized `not a friend`", { status: 401 });
    }

    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const message: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: friendId,
      text,
      timestamp,
    };

    //*notify chatroom

    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-message",
      message
    );

    //* all valid sending message!

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("ok");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal server error");
  }
}

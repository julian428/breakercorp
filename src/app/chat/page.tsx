import authOptions from "@/lib/auth";
import { fetchRedis } from "@/lib/redis";
import { User, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FriendCard from "./friendCard";

async function getFriends(userId: string) {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = await fetchRedis("get", `user:${friendId}`);
      return JSON.parse(friend);
    })
  );

  return friends;
}

export default async function ChatsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const friends = await getFriends(session.user.id);

  return (
    <>
      <h1 className="text-3xl mb-8">Your chats</h1>
      <ul className="text-black w-full px-2 max-h-full overflow-y-auto">
        {friends.sort().map((friend) => {
          return (
            <FriendCard
              key={friend.id || Math.random()}
              friend={friend}
              userId={session.user.id}
            />
          );
        })}
      </ul>
    </>
  );
}

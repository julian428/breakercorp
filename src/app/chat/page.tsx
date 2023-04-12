import authOptions from "@/lib/auth";
import { fetchRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FriendCard from "./friendCard";
import Link from "next/link";
import { AiOutlineEdit as EditIcon } from "react-icons/ai";
import LogoutButton from "@/components/LogoutButton";

async function getFriends(userId: string): Promise<UserProfile[]> {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = await fetchRedis("get", `user:${friendId}:profile`);
      return JSON.parse(friend);
    })
  );

  return friends as UserProfile[];
}

export default async function ChatsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const friends = await getFriends(session.user.id);

  return (
    <article className="w-full h-full text-center flex flex-col justify-between">
      <section>
        <h1 className="text-3xl mb-8">Your chats</h1>
        <ul className="text-black w-full px-2 max-h-full overflow-y-auto">
          {friends.sort().map((friend) => {
            return (
              <FriendCard
                key={friend.username || Math.random()}
                friend={friend}
                userId={session.user.id}
              />
            );
          })}
        </ul>
      </section>
      <footer className="flex justify-between px-2 text-4xl text-30 p-2">
        <Link href="/create-profile">
          <EditIcon />
        </Link>
        <LogoutButton />
      </footer>
    </article>
  );
}

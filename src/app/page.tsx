import Card from "@/components/Card";
import IndexProvider from "@/context/PersonIndexContext";
import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getNonFriends(userId: string): Promise<UserProfile[] | null> {
  const allUserData = await db.keys("user:*");
  const usersId: string[] = [];
  for (const user of allUserData) {
    const splitInfo = user.split(":");
    if (splitInfo.length > 2) continue;
    if (splitInfo[1] === userId) continue;
    const isAlreadyFriend =
      (await fetchRedis(
        "sismember",
        `${user}:incoming_friend_request`,
        userId
      )) || (await fetchRedis("sismember", `${user}:friends`, userId));
    if (isAlreadyFriend) continue;
    usersId.push(user + ":profile");
  }
  if (!usersId || usersId.length === 0) return null;
  const users = (await db.mget(...usersId)) as UserProfile[];
  return users;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const users = await getNonFriends(session?.user.id);
  return (
    <IndexProvider>
      {users ? (
        users.map((user, index) => (
          <Card
            user={user}
            key={user.username || Math.random()}
            cardIndex={index}
          />
        ))
      ) : (
        <p>No users to add</p>
      )}
    </IndexProvider>
  );
}

import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;
    const idToAdd = (await fetchRedis("get", `user:email:${email}`)) as string;

    if (!idToAdd) {
      return new Response("This person does not exist", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You can not add yourself as a friend", {
        status: 400,
      });
    }

    //check if user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_request`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response("Already friends with this user", { status: 400 });
    }

    //check if you can accept his request
    const isRequesting = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_request`,
      idToAdd
    );
    if (isRequesting) {
      console.log("accepting friend request");
      await db.sadd(`user:${session.user.id}:friends`, idToAdd);
      await db.sadd(`user:${idToAdd}:friends`, session.user.id);
      await db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd);
      return new Response("match");
    }

    //*valid request

    db.sadd(`user:${idToAdd}:incoming_friend_request`, session.user.id);

    return new Response("ok");
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

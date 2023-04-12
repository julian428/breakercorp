import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { User, getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return new Response("You have to be logged in to edit your profile", {
        status: 400,
      });
    const { description, username, imageUrl } = await req.json();
    if (!username) return new Response("Username is required", { status: 400 });
    if (!description)
      return new Response("Description is required", { status: 400 });
    if (!imageUrl)
      return new Response("Profile picture is required", { status: 400 });
    //* valid data lets create or edit a profile
    const editedUser = {
      image: imageUrl,
      description,
      username,
      email: session.user.email,
      id: session.user.id,
    };
    await db.set(`user:${session.user.id}:profile`, editedUser);
  } catch (error) {
    return new Response("Something went wrong.", { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import EditProfileForm from "./editProfileForm";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchRedis } from "@/lib/redis";
import { db } from "@/lib/db";

export default async function CreateProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  let rawUserProfile = (await fetchRedis(
    "get",
    `user:${session.user.id}:profile`
  )) as string;

  if (!rawUserProfile) {
    await db.set(`user:${session.user.id}:profile`, {
      image: session.user.image,
      description: "",
      username: session.user.name,
      email: session.user.email,
      id: session.user.id,
    });
    rawUserProfile = (await fetchRedis(
      "get",
      `user:${session.user.id}:profile`
    )) as string;
  }

  const userProfile = JSON.parse(rawUserProfile) as UserProfile;

  return <EditProfileForm userProfile={userProfile} />;
}

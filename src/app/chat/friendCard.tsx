"use client";

import { chatHrefConstructor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  friend: UserProfile;
  userId: string;
}

export default function FriendCard({ friend, userId }: Props) {
  return (
    <li>
      <Link
        href={`/chat/${chatHrefConstructor(friend.id, userId)}`}
        className="flex items-center gap-2 border-2 px-4 py-2 cursor-pointer"
      >
        <Image
          src={friend.image || ""}
          alt="Picture"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h2>{friend.username}</h2>
      </Link>
    </li>
  );
}

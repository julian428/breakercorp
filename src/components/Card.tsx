"use client";

import { VscError as RejectIcon } from "react-icons/vsc";
import ApproveFriend from "./ApproveFriend";
import { useIncrementContext } from "@/context/PersonIndexContext";
import Image from "next/image";

interface Props {
  cardIndex: number;
  user:
    | (User & {
        id: string;
      })
    | undefined;
}

export default function Card({ user, cardIndex }: Props) {
  const bgImage = user?.image;
  const { index, incrementIndex } = useIncrementContext();
  if (cardIndex !== index) return <></>;
  return (
    <section className="w-screen h-full gap-24 mt-24 relative text-60 flex flex-col items-center justify-end">
      <div className="flex items-center h-full">
        <div className="h-fit relative">
          <Image
            src={bgImage || ""}
            alt="profile"
            className="w-[90vw] max-h-full"
          />
          <article className="px-4 py-1 text-60 absolute bottom-0 bg-black w-full">
            <h2 className="text-2xl">{user?.name}</h2>
            <p>I hate r6 siege! I would love to hate it with you ;)</p>
          </article>
        </div>
      </div>
      <nav className="flex gap-48 justify-center items-center w-full p-4">
        <button
          onClick={incrementIndex}
          className="text-red-400 text-6xl"
        >
          <RejectIcon />
        </button>

        <ApproveFriend email={user?.email} />
      </nav>
    </section>
  );
}

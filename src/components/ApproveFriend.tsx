"use client";

import { useIncrementContext } from "@/context/PersonIndexContext";
import axios from "axios";
import { AiFillHeart as ApproveIcon } from "react-icons/ai";

interface Props {
  email: string | undefined;
}

export default function ApproveFriend({ email }: Props) {
  const { incrementIndex } = useIncrementContext();
  const addFriend = async (email: string | undefined) => {
    try {
      if (!email) throw new Error("No email given");
      await axios.post("/api/friends/add", {
        email,
      });
      incrementIndex();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={() => addFriend(email)}
      className="text-green-400 text-6xl"
    >
      <ApproveIcon />
    </button>
  );
}

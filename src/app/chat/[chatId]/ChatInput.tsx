"use client";

import axios from "axios";
import { User } from "next-auth";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { AiOutlineLoading as LoadingIcon } from "react-icons/ai";

interface Props {
  chatPartner: UserProfile;
  chatId: string;
}

export default function ChatInput({ chatPartner, chatId }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.length === 0) return;
    setIsLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within::ring-2 focus-within:ring-30 h-fit">
        <TextareaAutosize
          ref={textareaRef}
          rows={1}
          disabled={isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message @${chatPartner.username}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="block w-full resize-none border-0 bg-transparent px-2 py-1 text-black placeholder:text-disabled ring-0 outline-none"
        />
        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className=" flex-shrink-0">
            <button
              onClick={sendMessage}
              disabled={isLoading}
              type="submit"
              className="bg-10 text-60 w-20 h-8 text-center flex justify-center items-center rounded px-4 py-1"
            >
              {isLoading ? (
                <LoadingIcon className="animate-spin transition-all duration-700" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

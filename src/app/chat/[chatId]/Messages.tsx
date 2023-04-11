"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import format from "date-fns/format";
import Image from "next/image";
import { User } from "next-auth";
import { pusherClient } from "@/lib/pusher";

interface Props {
  initialMessages: Message[];
  sessionId: string;
  sessionImage: string;
  chatId: string;
  chatPartner: User;
}

export default function Messages({
  initialMessages,
  sessionId,
  chatPartner,
  sessionImage,
  chatId,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(toPusherKey(`chat:${chatId}`)));

      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, []);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimeStamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId == sessionId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        return (
          <div
            key={`${message.id}-${message.timestamp}`}
            className="chat-message"
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimeStamp(message.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  "invisible": hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={isCurrentUser ? sessionImage : chatPartner.image || ""}
                  alt="Chat picture"
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

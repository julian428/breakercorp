import "./globals.css";

import { BsFillChatHeartFill as ChatIcon } from "react-icons/bs";
import Link from "next/link";

export const metadata = {
  title: "Br3aker corp",
  description: "A giga page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen">
        <header className="flex w-full justify-between items-center px-4 py-2">
          <Link
            href="/"
            className="cursor-pointer"
          >
            <div>logo</div>
          </Link>
          <Link
            href="/chat"
            className="text-blue-400 text-4xl"
          >
            <ChatIcon />
          </Link>
        </header>
        <main className="h-[calc(100vh-52px)] w-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}

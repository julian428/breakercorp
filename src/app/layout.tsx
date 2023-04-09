import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}

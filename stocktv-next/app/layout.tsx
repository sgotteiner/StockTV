import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserProvider";
import { MediaProvider } from "@/context/MediaContext";

export const metadata: Metadata = {
  title: "StockTV - Video Feed",
  description: "TikTok-style video feed for stock market news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <UserProvider>
          <MediaProvider>
            {children}
          </MediaProvider>
        </UserProvider>
      </body>
    </html>
  );
}

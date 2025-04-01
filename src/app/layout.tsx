import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "都道府県別人口推移",
  description: "日本の都道府県別人口推移を表示するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
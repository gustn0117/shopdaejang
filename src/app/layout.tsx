import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "샵대장 - 마사지샵 직거래 전문 사이트",
    template: "%s | 샵대장",
  },
  description:
    "마사지샵 양도양수 직거래 전문 플랫폼. 긴급매물, 프리미엄, 일반, 무료매물 등 다양한 마사지 전문 점포 매물을 빠르게 찾아보세요.",
  keywords: [
    "마사지샵",
    "마사지샵 매매",
    "마사지샵 양도양수",
    "스웨디시 매매",
    "마사지샵 직거래",
    "샵대장",
  ],
  openGraph: {
    title: "샵대장 - 마사지샵 직거래 전문 사이트",
    description: "마사지샵 양도양수 직거래 전문 플랫폼",
    type: "website",
    locale: "ko_KR",
    siteName: "샵대장",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}

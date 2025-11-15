import "../styles/global.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SWRProvider } from "@/provider/swrProvider";
import { LanguageProvider } from "./i18n/LanguageContext";
import Header from "./components/organism/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kila",
  description: "Kila app",
  icons: {
    icon: "/fav.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SWRProvider>
          <LanguageProvider>
            <div className="app-container">
              <Header />
              {children}
            </div>
          </LanguageProvider>
        </SWRProvider>
      </body>
    </html>
  );
}

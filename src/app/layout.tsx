import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppContextProvider } from "@/contexts/AppContext";
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';


const prompt = Prompt({
  subsets: ['thai'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-prompt'
})

export const metadata: Metadata = {
  title: "KR Pharma - ร้านขายยาออนไลน์",
  description: "ร้านขายยาออนไลน์ที่ให้บริการด้านสุขภาพ พร้อมจัดส่งถึงที่",
  generator: 'weeplus.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${prompt.variable} antialiased`}>
        <NextAuthSessionProvider>
          <AppContextProvider>
              {children}
            <Toaster position="top-right" />
          </AppContextProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}

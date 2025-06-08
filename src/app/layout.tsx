import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClientProvider } from "@/components/ClientProvider";

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <ClientProvider>
          {children}
          <Toaster position="top-right" />
        </ClientProvider>
      </body>
    </html>
  );
}

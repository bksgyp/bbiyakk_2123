import "@/styles/globals.css";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import localFont from "next/font/local";
import SessionWrapper from "@/components/SessionWrapper";
import { PledgeProvider } from '@/context/PledgeContext';

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cal-Up"
  }
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${pretendard.variable}`}>
      <body
        className={`
          h-[100dvh] bg-black antialiased ${pretendard.className}`}
      >
        <SessionWrapper>
          <PledgeProvider>
            <div className="relative flex flex-col h-[100dvh] items-center">
              <main id="size" className="relative max-w-[768px] w-screen h-full bg-white px-5 pb-[30px]">
                {children}
              </main>
              <Footer />
            </div>
          </PledgeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
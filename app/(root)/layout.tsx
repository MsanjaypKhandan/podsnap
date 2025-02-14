import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import  {Toaster } from "@/components/ui/toaster";
import MobileNav from "@/components/MobileNav";
import PodcastPlayer from "@/components/PodcastPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podsnap",
  description: "Poidcast BY AI",
  icons : {
    icon : '/icons/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
      <div className="relative flex flex-col">
      <main className="relative flex bg-black-3">
        <LeftSidebar />
        
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image 
                src="/icons/logo.png"
                width={30}
                height={30}
                alt="menu icon"
              />
              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">
              <Toaster />

              {children}
            </div>
          </div>
        </section>

        <RightSidebar />
      
      </main>

      <PodcastPlayer />
    </div>
      </body>
      
    </html>
   
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/lib/auth_context";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { PendingApproval } from "@/components/auth/PendingApproval";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tool Development Request System",
  description: "Internal tool request management",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <AuthContent>{children}</AuthContent>
          <Toaster theme="dark" position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

function AuthContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (user?.isPending) {
    return <PendingApproval />;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </>
  );
}


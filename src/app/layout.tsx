import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";
import ClientBody from "./ClientBody";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "College Hub",
  description: "A place for college students to connect, study, and have fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ClientBody>
            <main className="flex-1">{children}</main>
          </ClientBody>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

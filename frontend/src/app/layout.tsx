import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "daily-planner",
    description: "A next generation daily planner to master your life",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <AuthContextProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
            </AuthContextProvider>
        </html>
    );
}

import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Daily Planner",
    description: "A next generation daily planner to master your life",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="favicon_io/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="favicon_io/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="favicon_io/favicon-16x16.png"
                />
                <link
                    rel="manifest"
                    href="favicon_io/site.webmanifest"
                />
            </head>
            <AuthContextProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
            </AuthContextProvider>
        </html>
    );
}

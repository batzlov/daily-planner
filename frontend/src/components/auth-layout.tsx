import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "./ui/button";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
};

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-10">
            <div className="bg-primary hidden lg:block lg:col-span-5 2xl:col-span-4">
                <div className="flex flex-col items-center justify-center h-full px-10">
                    <div className="text-5xl font-bold text-white text-center">
                        "The best thing money can buy is time."
                    </div>
                    <div className="pt-2 text-2xl font-bold text-white w-full text-right">
                        Unknown Author
                    </div>
                </div>
            </div>
            <div className="grid-span-10 lg:col-span-5 2xl:col-span-6">
                <div className="flex justify-end mt-[5px] me-[5px]">
                    <Button
                        asChild
                        variant="ghost"
                    >
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </Button>
                </div>
                <div className="">
                    <div className="px-4 auth-content my-auto sm:mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] 2xl:w-[650px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Erstelle jetzt einen Account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Bitte fülle alle Felder aus.
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}

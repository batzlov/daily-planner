"use client";
import MainNav from "@/components/main-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <MainNav></MainNav>
            <main
                role="main"
                className="hero-section flex justify-center text-center"
            >
                <div className="max-w-5xl mt-64 mx-5">
                    <Badge
                        variant="secondary"
                        className="inline-block mb-6 text-md"
                    >
                        Heute kündigen wir die Revolution in der Todo-Welt an
                        <Rocket
                            className="inline-block ml-2"
                            size={24}
                        />
                    </Badge>
                    <h1 className="text-5xl font-extrabold">
                        Keiner kann sich alles merken? Musst du auch garnicht!
                    </h1>

                    <p className="mt-4 text-xl text-muted-foreground">
                        Mit dem Daily Planner kannst du nicht nur kinderleicht
                        Todo-Listen erstellen, sondern diese auch ganz einfach
                        mit anderen Nutzer:innen teilen.
                    </p>
                    <div className="mt-6">
                        <Button
                            className="px-10 py-6 me-2"
                            asChild
                        >
                            <Link href="/sign-in">Jetzt loslegen</Link>
                        </Button>
                        <Button
                            className="px-10 py-6 ms-2"
                            variant="outline"
                            asChild
                        >
                            <Link href="/sign-in">Mehr erfahren</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}

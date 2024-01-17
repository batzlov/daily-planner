"use client";

import MainNav from "@/components/main-nav";

export default function Home() {
    return (
        <>
            <MainNav></MainNav>
            <main
                role="main"
                className="hero-section flex justify-center items-center"
            >
                <div className="max-w-5xl m-5">
                    <h1 className="text-4xl">
                        Mit dem{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                            Daily Planner
                        </span>{" "}
                        werden deine Aufgaben und du, ein Dream-Team wie aus dem
                        Bilderbuch.
                    </h1>

                    <p className="mt-4 text-lg">
                        Hast du es auch langsam satt, dass du deine Aufgaben
                        einfach immer weiter vor dir herschiebst anstatt sie
                        endlich abzuarbeiten? Mit dem Daily Planner gehört
                        dieses Verhalten nun endlich der Vergangenheit an!
                    </p>
                </div>
            </main>
        </>
    );
}

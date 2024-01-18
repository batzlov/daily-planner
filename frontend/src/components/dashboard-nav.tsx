"use client";

import { useAuthContext } from "@/hooks/use-auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function DashboardNav() {
    const router = useRouter();
    const { state, dispatch } = useAuthContext();

    const [email, setEmail] = useState<string>("");
    const [initials, setInitials] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        if (state.user && state.user.email) {
            setEmail(state.user.email);
            setInitials(
                state.user.firstName.charAt(0) + state.user.lastName.charAt(0)
            );
            setUserName(state.user.firstName + " " + state.user.lastName);
        }
    }, [state]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {userName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/todo-lists">Todo-Listen</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/categories">Todo-Kategorien</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        dispatch({
                            type: "signout",
                            jwt: "",
                        });

                        router.replace("/");
                    }}
                >
                    Abmelden
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

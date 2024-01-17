"use client";

import DashboardNav from "@/components/dashboard-nav";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import CreateTodoList from "./create-todo-list";
import DeleteTodoList from "./delete-todo-list";
import UpdateTodoList from "./update-todo-list";

export default function Dashboard() {
    const router = useRouter();
    const { state: authState, dispatch } = useAuthContext();
    const [todoLists, setTodoLists] = useState<any>([]);
    const { data, error, isLoading } = useSWR(
        ["http://localhost:3001/todo-lists", authState.jwt],
        ([url, jwt]) => fetcher(url, jwt)
    );

    return (
        <>
            <div className="h-full flex-1 flex-col space-y-8 p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Willkommen zurück!
                        </h2>
                        <p className="text-muted-foreground">
                            Hier ist eine Übersicht über deine verschiedenen
                            Todo-Listen.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DashboardNav />
                    </div>
                </div>
                <div className="container mx-auto py-10">
                    <div className="flex justify-end">
                        <CreateTodoList />
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {data &&
                            data.map((todoList: any) => (
                                <Card
                                    key={todoList.id}
                                    className="transistion duration-400 ease-in-out hover:bg-secondary hover:cursor-pointer"
                                >
                                    <div
                                        onClick={() => {
                                            router.push(
                                                `/todo-lists/${todoList.id}`
                                            );
                                        }}
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {todoList.title}
                                            </CardTitle>
                                            <CardDescription>
                                                Lorem ipsum dolor sit amet
                                                consectetur
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>
                                                Aktuell befinden sich{" "}
                                                {todoList.todos.length} Todos in
                                                dieser Liste.
                                            </p>
                                        </CardContent>
                                    </div>
                                    <CardFooter className="flex justify-end space-x-2">
                                        <DeleteTodoList todoList={todoList} />
                                        <UpdateTodoList todoList={todoList} />
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}

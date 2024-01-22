"use client";

import DashboardNav from "@/components/dashboard-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import CreateTodoList from "./create-todo-list";
import DeleteTodoList from "./delete-todo-list";
import UpdateTodoList from "./update-todo-list";

export default function TodoLists() {
    const router = useRouter();
    const { toast } = useToast();
    const { state: authState, dispatch } = useAuthContext();
    const { data, error, isLoading } = useSWR(
        [`${process.env.baseUrl}/todo-lists`, authState.jwt],
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
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {data &&
                            data.todoLists.map((todoList: any) => (
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
                                                Diese Liste hast du selbst
                                                erstellt
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>
                                                {todoList?.todos?.length > 0
                                                    ? `Aktuell befinden sich ${todoList?.todos?.length}`
                                                    : "Es befinden sich noch keine Todos in der Liste"}
                                            </p>
                                        </CardContent>
                                    </div>
                                    <CardFooter className="flex justify-end space-x-2">
                                        <DeleteTodoList todoList={todoList} />
                                        <UpdateTodoList todoList={todoList} />
                                    </CardFooter>
                                </Card>
                            ))}
                        {data &&
                            data.sharedTodoLists.map((todoList: any) => (
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
                                            <Badge className="w-fit ms-auto">
                                                shared
                                            </Badge>
                                            <CardTitle>
                                                {todoList.title}
                                            </CardTitle>
                                            <CardDescription>
                                                Diese Liste wurde mit dir
                                                geteilt
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p>
                                                {todoList?.todos?.length > 0
                                                    ? `Aktuell befinden sich ${todoList?.todos?.length}`
                                                    : "Es befinden sich noch keine Todos in der Liste"}
                                            </p>
                                        </CardContent>
                                    </div>
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Button
                                            className="transistion duration-400 ease-in-out hover:bg-primary hover:text-primary-foreground"
                                            variant="outline"
                                            onClick={() => {
                                                toast({
                                                    title: "Upsi :(",
                                                    description:
                                                        "Aktuell können geteilte Listen nur durch den Ersteller gelöscht werden",
                                                });
                                            }}
                                        >
                                            löschen
                                        </Button>
                                        <Button
                                            className="transistion duration-400 ease-in-out hover:bg-primary hover:text-primary-foreground"
                                            variant="outline"
                                            onClick={() => {
                                                toast({
                                                    title: "Upsi :(",
                                                    description:
                                                        "Aktuell können geteilte Listen nur durch den Ersteller bearbeiten werden",
                                                });
                                            }}
                                        >
                                            bearbeiten
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                    <div
                        className={classNames({
                            "mt-12":
                                data?.sharedTodoLists?.length === 0 &&
                                data?.todoLists?.length === 0,
                            hidden:
                                data?.sharedTodoLists?.length > 0 ||
                                data?.todoLists?.length > 0 ||
                                isLoading,
                        })}
                    >
                        <Alert>
                            <AlertTitle>Oh :o</AlertTitle>
                            <AlertDescription>
                                Aktuell hast du noch keine Todo-Listen erstellt
                                und es wurden auch keine mit dir geteilt.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </>
    );
}

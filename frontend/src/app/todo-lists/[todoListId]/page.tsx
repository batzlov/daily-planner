"use client";

interface DetailsProps {
    params: {
        todoListId: string;
    };
}

import DashboardNav from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import classNames from "classnames";
import useSWR from "swr";
import { columns } from "./columns";
import CreateTodo from "./create-todo";
import DataTable from "./data-table";

export default function Details({ params }: DetailsProps) {
    const { state: authState, dispatch } = useAuthContext();
    const { data, error, isLoading } = useSWR(
        [
            `http://localhost:3001/todo-lists/${params.todoListId}`,
            authState.jwt,
        ],
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
                            Hier ist eine Liste an Aufgaben die du heute zu
                            erledigen hast!
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DashboardNav />
                    </div>
                </div>
                <div className="container mx-auto py-10">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-lg">{data?.title}</h2>
                        <div className="mt-4 md:mt-0">
                            <Button className="me-1">Liste teilen</Button>
                            <CreateTodo todoListId={params.todoListId} />
                        </div>
                    </div>
                    <div className="mt-12">
                        {data &&
                            data.todos &&
                            data.todos.map((todo: any) => (
                                <Card
                                    key={todo.id}
                                    className="transistion duration-400 ease-in-out hover:bg-secondary hover:cursor-pointer"
                                >
                                    <CardHeader className="flex flex-row justify-between items-center">
                                        <div className="flex flex-row justify-start items-center space-x-8">
                                            <Checkbox
                                                defaultChecked={todo?.completed}
                                                onCheckedChange={(checked) => {
                                                    todo.completed = checked;
                                                }}
                                            />
                                            <CardTitle
                                                className={classNames({
                                                    "line-through":
                                                        todo.completed,
                                                })}
                                            >
                                                {todo?.title}
                                            </CardTitle>
                                        </div>
                                        <CardContent className="p-0">
                                            <Button
                                                className="px-1"
                                                variant="link"
                                                disabled={todo?.completed}
                                            >
                                                bearbeiten
                                            </Button>
                                            <Button
                                                className="px-1"
                                                variant="link"
                                                disabled={todo?.completed}
                                            >
                                                löschen
                                            </Button>
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                            ))}

                        {data && data.todos === null && (
                            <DataTable
                                columns={columns}
                                data={[]}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

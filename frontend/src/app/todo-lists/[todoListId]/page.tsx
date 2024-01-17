"use client";

interface DetailsProps {
    params: {
        todoListId: string;
    };
}

import DashboardNav from "@/components/dashboard-nav";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { columns } from "./columns";
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
                    <div className="text-xl my-4">
                        Todo-Liste: {data?.title}
                    </div>
                    {data && data.todos && (
                        <DataTable
                            columns={columns}
                            data={data.todos}
                        />
                    )}
                    {data && data.todos === null && (
                        <DataTable
                            columns={columns}
                            data={[]}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

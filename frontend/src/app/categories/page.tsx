"use client";

import DashboardNav from "@/components/dashboard-nav";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import CreateCategory from "./create-category";
import DeleteCategory from "./delete-category";
import UpdateCategory from "./update-category";

export default function Categories() {
    const { toast } = useToast();
    const { state: authState, dispatch } = useAuthContext();
    const [todoLists, setTodoLists] = useState<any>([]);
    const { data, error, isLoading } = useSWR(
        ["http://localhost:3001/categories", authState.jwt],
        ([url, jwt]) => fetcher(url, jwt)
    );

    console.log(authState);

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
                            Kategorien.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DashboardNav />
                    </div>
                </div>
                <div className="container mx-auto py-10">
                    <div className="flex justify-end">
                        <CreateCategory />
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {data &&
                            data.map((category: any) => (
                                <Card
                                    key={category.id}
                                    className="transistion duration-400 ease-in-out hover:bg-secondary"
                                >
                                    <CardHeader>
                                        <CardTitle>{category.title}</CardTitle>
                                        <CardDescription>
                                            Lorem ipsum dolor sit amet
                                            consectetur
                                        </CardDescription>
                                    </CardHeader>

                                    <CardFooter className="flex justify-end space-x-2">
                                        <DeleteCategory category={category} />
                                        <UpdateCategory category={category} />
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}

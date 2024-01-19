import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Todo = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    parentTodoListId: number;
};

export const columns: ColumnDef<Todo>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Titel",
    },
    {
        accessorKey: "description",
        header: "Beschreibung",
    },
    {
        accessorKey: "completed",
        header: "Abgeschlossen",
        cell: ({ row }) => {
            const badeText = row.getValue("completed") ? "Ja" : "Nein";

            return <Badge>{badeText}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Optionen</DropdownMenuLabel>
                        <DropdownMenuItem>Todo löschen</DropdownMenuItem>
                        <DropdownMenuItem>Todo bearbeiten</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

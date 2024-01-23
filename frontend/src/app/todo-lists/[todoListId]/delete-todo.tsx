import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth-context";
import * as React from "react";
import { useSWRConfig } from "swr";
import wretch from "wretch";

interface DeleteTodoProps {
    todoListId: number;
    todo: {
        id: number;
        title: string;
        description: string;
        completed: boolean;
    };
}

export default function DeleteTodo({ todoListId, todo }: DeleteTodoProps) {
    const { mutate } = useSWRConfig();
    const { toast } = useToast();
    const { state, dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    async function deleteTodo() {
        setIsLoading(true);

        wretch(
            `${process.env.baseUrl}/todo-lists/${todoListId}/todos/${todo.id}`
        )
            .options({
                headers: {
                    Authorization: `Bearer ${state.jwt}`,
                },
            })
            .delete()
            .res(async (res: any) => {
                if (!res.ok) {
                    if (res.status === 400) {
                        throw new Error("Bad request");
                    } else {
                        throw new Error("Something went wrong");
                    }
                }

                setOpen(false);
                mutate([
                    `${process.env.baseUrl}/todo-lists/${todoListId}`,
                    state.jwt,
                ]);
                toast({
                    title: "Todo gelöscht",
                    description: `Das Todo wurde erfolgreich gelöscht`,
                });
            })
            .catch((error) => {
                console.error(error);

                toast({
                    variant: "destructive",
                    title: "Löschen des Todo ist fehlgeschlagen",
                    description: "Bitte versuche es erneut",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    className="px-1"
                    variant="link"
                    disabled={todo?.completed}
                >
                    löschen
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Liste löschen</DialogTitle>
                    <DialogDescription>
                        Bist du dir sicher dass du das Todo {todo.title} löschen
                        möchtest?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isLoading}
                        >
                            abbrechen
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        onClick={deleteTodo}
                    >
                        löschen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

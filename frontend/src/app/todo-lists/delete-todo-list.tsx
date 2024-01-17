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
import { useAuthContext } from "@/hooks/use-auth-context";
import * as React from "react";
import { useSWRConfig } from "swr";
import wretch from "wretch";

interface DeleteTodoListProps {
    todoList: {
        id: number;
        title: string;
    };
}

export default function DeleteTodoList({ todoList }: DeleteTodoListProps) {
    const { mutate } = useSWRConfig();

    const { state, dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    async function deleteTodoList() {
        setIsLoading(true);

        wretch(`http://localhost:3001/todo-lists/${todoList.id}`)
            .options({
                headers: {
                    Authorization: `Bearer ${state.jwt}`,
                },
            })
            .delete()
            .res(async (res: any) => {
                setOpen(false);
                mutate(["http://localhost:3001/todo-lists", state.jwt]);
            })
            .catch((error) => {
                console.error(error);
            });

        setIsLoading(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    className="transistion duration-400 ease-in-out hover:bg-primary hover:text-primary-foreground"
                    variant="outline"
                >
                    löschen
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Erstelle eine neue Liste</DialogTitle>
                    <DialogDescription>
                        Wähle einen passenden Namen für deine neue Todo-Liste
                        und klicke auf speichern.
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
                        onClick={deleteTodoList}
                    >
                        löschen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

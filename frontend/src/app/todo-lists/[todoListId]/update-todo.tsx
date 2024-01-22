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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/hooks/use-auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import wretch from "wretch";
import * as z from "zod";

interface UpdateTodoProps {
    todo: {
        id: number;
        title: string;
        description: string;
        completed: boolean;
        parentTodoListId: number;
    };
}

export default function UpdateTodo({ todo }: UpdateTodoProps) {
    const { mutate } = useSWRConfig();

    const [open, setOpen] = React.useState(false);
    const updateTodoSchema = z.object({
        title: z.string().min(2, {
            message: "Der Name muss mindestens 2 Zeichen lang sein",
        }),
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { state, dispatch } = useAuthContext();

    type UpdateTodoSchemaType = z.infer<typeof updateTodoSchema>;
    const form = useForm<UpdateTodoSchemaType>({
        resolver: zodResolver(updateTodoSchema),
        defaultValues: {
            title: todo.title,
        },
    });

    async function onSubmit(values: UpdateTodoSchemaType) {
        setIsLoading(true);

        wretch(
            `${process.env.baseUrl}/todo-lists/${params.todoListsId}/todos/${todo.id}`
        )
            .options({
                headers: {
                    Authorization: `Bearer ${state.jwt}`,
                },
            })
            .put(values)
            .res(async (res: any) => {
                console.log(res);
                setOpen(false);
                form.reset();
                form.setValue("title", values.title);
                mutate([
                    `${process.env.baseUrl}/todo-lists/${params.todoListId}`,
                    state.jwt,
                ]);
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
                    bearbeiten
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kategorie bearbeiten</DialogTitle>
                    <DialogDescription>
                        Bitte bearbeite die Details deines Todo und klicke auf
                        speichern.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-2 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titel</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Titel"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                            >
                                speichern
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

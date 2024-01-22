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
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import wretch from "wretch";
import * as z from "zod";

interface UpdateTodoListProps {
    todoList: {
        id: number;
        title: string;
    };
}

export default function UpdateTodoList({ todoList }: UpdateTodoListProps) {
    const { mutate } = useSWRConfig();
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const updateTodoListSchema = z.object({
        title: z.string().min(2, {
            message: "Der Name muss mindestens 2 Zeichen lang sein",
        }),
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { state, dispatch } = useAuthContext();

    type UpdateTodoListSchemaType = z.infer<typeof updateTodoListSchema>;
    const form = useForm<UpdateTodoListSchemaType>({
        resolver: zodResolver(updateTodoListSchema),
        defaultValues: {
            title: todoList.title,
        },
    });

    async function onSubmit(values: UpdateTodoListSchemaType) {
        setIsLoading(true);

        wretch(`${process.env.baseUrl}/todo-lists/${todoList.id}`)
            .options({
                headers: {
                    Authorization: `Bearer ${state.jwt}`,
                },
            })
            .put(values)
            .res(async (res: any) => {
                if (!res.ok) {
                    if (res.status === 400) {
                        throw new Error("Bad request");
                    } else {
                        throw new Error("Something went wrong");
                    }
                }

                setOpen(false);
                form.reset();
                form.setValue("title", values.title);
                mutate([`${process.env.baseUrl}/todo-lists`, state.jwt]);
                toast({
                    title: "Todo-Liste aktualisiert",
                    description:
                        "Deine Todo-Liste wurde erfolgreich aktualisiert",
                });
            })
            .catch((error) => {
                console.error(error);

                toast({
                    title: "Aktuallisieren der Todo-Liste ist fehlgeschlagen",
                    description: "Bitte versuche es erneut",
                });
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
                    <DialogTitle>Liste bearbeiten</DialogTitle>
                    <DialogDescription>
                        Wähle einen passenden Namen für deine Todo-Liste und
                        klicke auf speichern.
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

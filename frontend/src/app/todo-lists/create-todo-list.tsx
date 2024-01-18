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

export default function CreateTodoList() {
    const { mutate } = useSWRConfig();

    const [open, setOpen] = React.useState(false);
    const createTodoListSchema = z.object({
        title: z.string().min(2, {
            message: "Der Name muss mindestens 2 Zeichen lang sein",
        }),
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { state, dispatch } = useAuthContext();

    type CreateTodoListSchemaType = z.infer<typeof createTodoListSchema>;
    const form = useForm<CreateTodoListSchemaType>({
        resolver: zodResolver(createTodoListSchema),
        defaultValues: {
            title: "",
        },
    });

    async function onSubmit(values: CreateTodoListSchemaType) {
        setIsLoading(true);

        wretch(`http://localhost:3001/todo-lists`)
            .options({
                headers: {
                    Authorization: `Bearer ${state.jwt}`,
                },
            })
            .post(values)
            .res(async (res: any) => {
                console.log(res);
                setOpen(false);
                form.reset();
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
                <Button>Liste erstellen</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Erstelle eine neue Liste</DialogTitle>
                    <DialogDescription>
                        Wähle einen passenden Namen für deine neue Todo-Liste
                        und klicke auf speichern.
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

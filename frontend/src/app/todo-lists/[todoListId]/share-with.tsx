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

interface ShareWithProps {
    todoListId: number;
}

export default function ShareWith({ todoListId }: ShareWithProps) {
    const { mutate } = useSWRConfig();
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const shareWithSchema = z.object({
        email: z.string().email({
            message: "Bitte gib eine gültige E-Mail Adresse ein",
        }),
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { state, dispatch } = useAuthContext();

    type ShareWithSchemaType = z.infer<typeof shareWithSchema>;
    const form = useForm<ShareWithSchemaType>({
        resolver: zodResolver(shareWithSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: ShareWithSchemaType) {
        setIsLoading(true);

        wretch(`${process.env.baseUrl}/todo-lists/${todoListId}/share-with`)
            .options({
                headers: {
                    Authorization: `Bearer ${state.jwt}`,
                },
            })
            .post(values)
            .res(async (res: any) => {
                if (!res.ok) {
                    throw new Error("Something went wrong.");
                }

                setOpen(false);
                form.reset();
                mutate([
                    `${process.env.baseUrl}/todo-lists/${todoListId}`,
                    state.jwt,
                ]);
                toast({
                    title: "Todo-Liste geteilt",
                    description: "Deine Todo-Liste wurde erfolgreich geteilt.",
                });
            })
            .catch((error) => {
                console.error(error);

                toast({
                    variant: "destructive",
                    title: "Todo-Liste konnte nicht geteilt werden",
                    description:
                        "Deine Todo-Liste konnte nicht geteilt werden.",
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
                <Button className="me-1">Todo-Liste teilen</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Teile deine Todo-Liste mit einem anderen Nutzer
                    </DialogTitle>
                    <DialogDescription>
                        Bitte gib die E-Mail Adresse des Nutzers ein, mit dem du
                        deine Todo-Liste teilen möchtest. Wenn die E-Mail
                        Adresse mit einem Nutzer verknüpft ist, wird dieser
                        Zugriff auf deine Todo-Liste erhalten.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-2 py-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titel</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="E-Mail"
                                                type="email"
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
                                teilen
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

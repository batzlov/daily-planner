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

export default function ShareWith() {
    const { mutate } = useSWRConfig();

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
                mutate([
                    "http://localhost:3001/todo-lists/share-with",
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

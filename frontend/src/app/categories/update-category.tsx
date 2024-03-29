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

interface UpdateCategoryProps {
    category: {
        id: number;
        title: string;
        createdBy: number;
    };
}

export default function UpdateCategory({ category }: UpdateCategoryProps) {
    const { mutate } = useSWRConfig();

    const [open, setOpen] = React.useState(false);
    const updateCategorySchema = z.object({
        title: z.string().min(2, {
            message: "Der Name muss mindestens 2 Zeichen lang sein",
        }),
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { toast } = useToast();
    const { state, dispatch } = useAuthContext();

    type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;
    const form = useForm<UpdateCategorySchemaType>({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            title: category.title,
        },
    });

    async function onSubmit(values: UpdateCategorySchemaType) {
        setIsLoading(true);

        wretch(`${process.env.baseUrl}/categories/${category.id}`)
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
                mutate([`${process.env.baseUrl}/categories`, state.jwt]);

                toast({
                    title: "Kategorie erfolgreich aktualisiert",
                    description:
                        "Deine Kategorie wurde erfolgreich aktualisiert",
                });
            })
            .catch((error) => {
                console.error(error);

                toast({
                    variant: "destructive",
                    title: "Kategorie konnte nicht aktualisiert werden",
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
                    onClick={(event: any) => {
                        if (category.createdBy === 0) {
                            toast({
                                title: "Upsi :(",
                                description:
                                    "Vom System erstellte Kateogrien können nicht bearbeitet werden",
                            });

                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }}
                >
                    bearbeiten
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kategorie bearbeiten</DialogTitle>
                    <DialogDescription>
                        Wähle einen passenden Namen für deine Kategorie und
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

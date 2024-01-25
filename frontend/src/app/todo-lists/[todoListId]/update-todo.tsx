import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import wretch from "wretch";
import * as z from "zod";

interface UpdateTodoProps {
    todoListId: number;
    todo: {
        id: number;
        title: string;
        description: string;
        completed: boolean;
        categoryId: number;
        parentTodoListId: number;
    };
}

export default function UpdateTodo({ todoListId, todo }: UpdateTodoProps) {
    const { mutate } = useSWRConfig();
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const updateTodoSchema = z.object({
        title: z.string().min(2, {
            message: "Der Name muss mindestens 2 Zeichen lang sein",
        }),
        description: z.string().min(2, {
            message: "Die Beschreibung muss mindestens 2 Zeichen lang sein",
        }),
        completed: z.boolean(),
        category: z.string({
            required_error: "Bitte wähle eine Kategorie aus",
        }),
    });
    const { state: authState, dispatch } = useAuthContext();
    const {
        data: categoryData,
        error,
        isLoading,
    } = useSWR(
        [`${process.env.baseUrl}/categories`, authState.jwt],
        ([url, jwt]) => fetcher(url, jwt)
    );

    type UpdateTodoSchemaType = z.infer<typeof updateTodoSchema>;
    const form = useForm<UpdateTodoSchemaType>({
        resolver: zodResolver(updateTodoSchema),
        defaultValues: {
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            category:
                categoryData?.find((category: any) => {
                    return category.id === todo.categoryId;
                }).title || "",
        },
    });

    async function onSubmit(values: UpdateTodoSchemaType) {
        // change category string to category id
        const updatedValues = { ...values, categoryId: null };
        const categoryId = categoryData?.find(
            (category: any) => category.title === values.category
        );
        updatedValues.categoryId = categoryId?.id;

        wretch(
            `${process.env.baseUrl}/todo-lists/${todoListId}/todos/${todo.id}`
        )
            .options({
                headers: {
                    Authorization: `Bearer ${authState.jwt}`,
                },
            })
            .put(updatedValues)
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
                form.setValue("description", values.description);

                mutate([
                    `${process.env.baseUrl}/todo-lists/${todoListId}`,
                    authState.jwt,
                ]);

                toast({
                    title: "Ändern des Todos war erfolgreich",
                    description: "Das Todo wurde erfolgreich geändert",
                });
            })
            .catch((error) => {
                console.error(error);

                toast({
                    variant: "destructive",
                    title: "Ändern des Todos ist fehlgeschlagen",
                    description: "Bitte versuche es erneut",
                });
            });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                setOpen(!open);

                // prevent errors as a result of the category data not being loaded yet
                const category =
                    categoryData?.find((category: any) => {
                        return category.id === todo.categoryId;
                    }).title || "";
                form.setValue("category", category);
                form.setValue("completed", todo.completed);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    className="px-1"
                    variant="link"
                >
                    bearbeiten
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Todo bearbeiten</DialogTitle>
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
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Beschreibung</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Beschreibe dein Todo in ein paar Sätzen"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategorie</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Bitte wähle eine Kategorie" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categoryData?.map(
                                                    (category: any) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={
                                                                category.title
                                                            }
                                                        >
                                                            {category.title}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Du kannst, wenn du möchtest, neue
                                            Kategorien{" "}
                                            <Link
                                                className="underline"
                                                href="/categories"
                                            >
                                                hier erstellen
                                            </Link>
                                            .
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="completed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Ist das Todo bereits erledigt?
                                            </FormLabel>
                                        </div>
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

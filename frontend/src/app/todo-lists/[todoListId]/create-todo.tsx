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
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import wretch from "wretch";
import * as z from "zod";

interface CreateTodoProps {
    todoListId: string;
}

export default function CreateTodo({ todoListId }: CreateTodoProps) {
    const { state: authState, dispatch } = useAuthContext();
    const { mutate } = useSWRConfig();
    const {
        data: categoryData,
        error,
        isLoading,
    } = useSWR(
        ["http://localhost:3001/categories", authState.jwt],
        ([url, jwt]) => fetcher(url, jwt)
    );

    const [open, setOpen] = React.useState(false);
    const createTodoSchema = z.object({
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

    type CreateTodoSchemaType = z.infer<typeof createTodoSchema>;
    const form = useForm<CreateTodoSchemaType>({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: "",
            description: "",
            completed: false,
        },
    });

    async function onSubmit(values: CreateTodoSchemaType) {
        // change category string to category id
        const updatedValues = { ...values, categoryId: null };
        const categoryId = categoryData?.find(
            (category: any) => category.title === values.category
        );
        updatedValues.categoryId = categoryId?.id;

        wretch(`http://localhost:3001/todo-lists/${todoListId}/todos`)
            .options({
                headers: {
                    Authorization: `Bearer ${authState.jwt}`,
                },
            })
            .post(updatedValues)
            .res(async (res: any) => {
                console.log(res);
                setOpen(false);
                form.reset();
                mutate([
                    `http://localhost:3001/todo-lists/${todoListId}`,
                    authState.jwt,
                ]);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>Todo erstellen</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Erstelle eine neues Todo</DialogTitle>
                    <DialogDescription>
                        Bitte gib die Details zu deinem Todo an und klicke auf
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

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

interface DeleteCategoryProps {
    category: {
        id: number;
        title: string;
        createdBy: number;
    };
}

export default function DeleteCategory({ category }: DeleteCategoryProps) {
    const { mutate } = useSWRConfig();
    const { toast } = useToast();
    const { state, dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    async function deleteCategory() {
        setIsLoading(true);

        wretch(`${process.env.baseUrl}/categories/${category.id}`)
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
                mutate([`${process.env.baseUrl}/categories`, state.jwt]);
                toast({
                    title: "Kategorie gelöscht",
                    description: "Die Kategorie wurde erfolgreich gelöscht",
                });
            })
            .catch((error) => {
                console.error(error);

                toast({
                    variant: "destructive",
                    title: "Kategorie konnte nicht gelöscht werden",
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
                                    "Vom System erstellte Kateogrien können nicht gelöscht werden",
                            });

                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }}
                >
                    löschen
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Liste löschen</DialogTitle>
                    <DialogDescription>
                        Bist du dir sicher das du die Kategorie "
                        {category.title}" löschen möchtest?
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
                        onClick={deleteCategory}
                    >
                        löschen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

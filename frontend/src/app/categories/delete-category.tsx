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

interface DeleteCategoryProps {
    category: {
        id: number;
        title: string;
    };
}

export default function DeleteCategory({ category }: DeleteCategoryProps) {
    const { mutate } = useSWRConfig();

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
                setOpen(false);
                mutate([`${process.env.baseUrl}/categories`, state.jwt]);
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth-context";
import classNames from "classnames";
import { useSWRConfig } from "swr";
import wretch from "wretch";

interface TodoItemProps {
    todo: any;
    todoListId: number;
    isSortable: boolean;
}

export default function TodoItem({
    todo,
    todoListId,
    isSortable,
}: TodoItemProps) {
    const { mutate } = useSWRConfig();
    const { state, dispatch } = useAuthContext();
    const { toast } = useToast();

    return (
        <Card
            key={todo.id}
            className={classNames({
                "transistion duration-400 ease-in-out hover:bg-secondary my-2":
                    true,
                "hover:cursor-pointer": isSortable,
            })}
        >
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center space-x-8">
                    <Checkbox
                        defaultChecked={todo?.completed}
                        onCheckedChange={(checked) => {
                            todo.completed = checked;

                            wretch(
                                `${process.env.baseUrl}/todo-lists/${todoListId}/todos/${todo.id}/update-completed`
                            )
                                .options({
                                    headers: {
                                        Authorization: `Bearer ${state.jwt}`,
                                    },
                                })
                                .put({
                                    completed: checked,
                                })
                                .res(async (res: any) => {
                                    if (!res.ok) {
                                        throw new Error(
                                            "Something went wrong."
                                        );
                                    }
                                    mutate([
                                        `${process.env.baseUrl}/todo-lists/${todoListId}`,
                                        state.jwt,
                                    ]);
                                })
                                .catch((error) => {
                                    console.error(error);

                                    toast({
                                        variant: "destructive",
                                        title: "Todo konnte nicht als erledigt markiert werden",
                                        description: "Bitte versuche es erneut",
                                    });
                                });
                        }}
                    />
                    <CardTitle
                        className={classNames({
                            "line-through": todo.completed,
                        })}
                    >
                        {todo?.title}
                    </CardTitle>
                </div>
                <CardContent className="p-0">
                    <Button
                        className="px-1"
                        variant="link"
                        disabled={todo?.completed}
                    >
                        bearbeiten
                    </Button>
                    <Button
                        className="px-1"
                        variant="link"
                        disabled={todo?.completed}
                    >
                        löschen
                    </Button>
                </CardContent>
            </CardHeader>
        </Card>
    );
}

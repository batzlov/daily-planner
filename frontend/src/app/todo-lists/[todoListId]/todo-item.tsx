import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import classNames from "classnames";

interface TodoItemProps {
    todo: any;
    isSortable: boolean;
}

export default function TodoItem({ todo, isSortable }: TodoItemProps) {
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

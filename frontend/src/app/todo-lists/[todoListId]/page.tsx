"use client";

import DashboardNav from "@/components/dashboard-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/use-auth-context";
import { fetcher } from "@/lib/utils";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import classNames from "classnames";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import wretch from "wretch";
import CreateTodo from "./create-todo";
import ShareWith from "./share-with";
import { SortableItem } from "./sortable-item";
import TodoItem from "./todo-item";

interface DetailsProps {
    params: {
        todoListId: string;
    };
}

export default function Details({ params }: DetailsProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const { mutate } = useSWRConfig();
    const [listIsSortable, setListIsSortable] = useState(false);
    const [sortableTodos, setSortableTodos] = useState<any>([]);
    const { state: authState, dispatch } = useAuthContext();
    const { data, error, isLoading } = useSWR(
        [
            `http://localhost:3001/todo-lists/${params.todoListId}`,
            authState.jwt,
        ],
        ([url, jwt]) => fetcher(url, jwt)
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (over && active.id !== over?.id) {
            const oldIndex = sortableTodos.findIndex((elm: any) => {
                return elm.id === active.id;
            });
            const newIndex = sortableTodos.findIndex((elm: any) => {
                return elm.id === over.id;
            });

            const resortedTodos = arrayMove(sortableTodos, oldIndex, newIndex);
            resortedTodos.forEach((todo: any, index: number) => {
                todo.order = index + 1;
            });
            setSortableTodos(resortedTodos);
        }
    }

    return (
        <>
            <div className="h-full flex-1 flex-col space-y-8 p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Willkommen zurück!
                        </h2>
                        <p className="text-muted-foreground">
                            Hier ist eine Liste an Aufgaben die du heute zu
                            erledigen hast!
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DashboardNav />
                    </div>
                </div>
                <div className="container mx-auto py-10">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-lg">{data?.title}</h2>
                        <div className="mt-4 md:mt-0">
                            <Button
                                className="me-1"
                                disabled={data?.todos?.length === 0}
                                onClick={() => {
                                    if (!listIsSortable) {
                                        setSortableTodos(data?.todos);
                                    } else {
                                        wretch(
                                            `http://localhost:3001/todo-lists/${data?.id}/reorder-todos`
                                        )
                                            .options({
                                                headers: {
                                                    Authorization: `Bearer ${authState.jwt}`,
                                                },
                                            })
                                            .post({ todos: sortableTodos })
                                            .res(async (res: any) => {
                                                if (res.ok) {
                                                    mutate([
                                                        `http://localhost:3001/todo-lists/${data?.id}`,
                                                        authState.jwt,
                                                    ]);
                                                }
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                    }

                                    // FIXME: handle flickering ui when saving/toggling
                                    setListIsSortable(!listIsSortable);
                                }}
                            >
                                {listIsSortable
                                    ? "Sortierung speichern"
                                    : "Sortierung ändern"}
                            </Button>
                            <ShareWith />
                            <CreateTodo todoListId={params.todoListId} />
                        </div>
                    </div>
                    <div
                        className={classNames({
                            "mt-12": listIsSortable,
                            hidden: !listIsSortable,
                        })}
                    >
                        {listIsSortable && (
                            <div>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={sortableTodos}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {sortableTodos.map((todo: any) => (
                                            <SortableItem
                                                key={todo.id}
                                                id={todo.id}
                                                todo={todo}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </div>
                        )}
                    </div>
                    <div
                        className={classNames({
                            "mt-12": !listIsSortable,
                            hidden: listIsSortable,
                        })}
                    >
                        {data &&
                            data.todos &&
                            data.todos.map((todo: any) => (
                                <TodoItem
                                    todo={todo}
                                    key={todo.id}
                                    isSortable={false}
                                />
                            ))}
                    </div>
                    <div
                        className={classNames({
                            "mt-12": data?.todos?.length === 0,
                            hidden: data?.todos?.length > 0,
                        })}
                    >
                        <Alert>
                            <AlertTitle>Oh :o</AlertTitle>
                            <AlertDescription>
                                Du hast noch keine Aufgaben in dieser Liste
                                erstellt.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </>
    );
}

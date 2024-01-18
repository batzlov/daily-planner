"use client";

import AuthLayout from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import wretch from "wretch";
import * as z from "zod";

interface SignInProps extends React.HTMLAttributes<HTMLDivElement> {}

const signInSchema = z.object({
    email: z.string().email({
        message: "Bitte gib eine gültige E-Mail-Adresse ein",
    }),
    password: z
        .string()
        .min(8, {
            message: "Das Passwort muss mindestens 8 Zeichen lang sein",
        })
        .max(64, {
            message: "Das Passwort darf maximal 64 Zeichen lang sein",
        }),
});

export default function SignIn({ className, ...props }: SignInProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [cookie, setCookie] = React.useState<string>("");

    const { state, dispatch } = useAuthContext();

    type SignInSchemaType = z.infer<typeof signInSchema>;
    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: SignInSchemaType) {
        setIsLoading(true);

        wretch(`http://localhost:3001/sign-in`)
            .post(values)
            .res(async (res: any) => {
                const body = await res.json();

                // FIXME: jwts should not be stored in localStorage in production
                localStorage.setItem("jwt", body.jwt);
                localStorage.setItem("user", JSON.stringify(body.user));

                // update the auth context
                dispatch({
                    type: "signin",
                    jwt: body.jwt,
                    user: body.user,
                });

                router.push("/todo-lists");
            })
            .catch((error) => {
                console.error(error);
            });

        setIsLoading(false);
    }

    return (
        <AuthLayout>
            <div className={cn("grid gap-6", className)}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-Mail</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passwort</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Passwort"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="mt-2"
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Jetzt registrieren
                            </Button>
                            <p className="p-2 text-sm text-muted-foreground">
                                Du hast noch kein{" "}
                                <Link
                                    href="/sign-up"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Konto
                                </Link>{" "}
                                oder hast dein{" "}
                                <Link
                                    href="#"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Passwort vergessen
                                </Link>
                                ?
                            </p>
                        </div>
                    </form>
                </Form>
            </div>
        </AuthLayout>
    );
}

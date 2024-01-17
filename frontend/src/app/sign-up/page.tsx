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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import wretch from "wretch";
import * as z from "zod";

interface SignUpProps extends React.HTMLAttributes<HTMLDivElement> {}

const signUpSchema = z
    .object({
        firstName: z
            .string()
            .min(2, {
                message: "Dein Vorname muss mindestens 2 Zeichen lang sein",
            })
            .max(64, {
                message: "Dein Vorname darf maximal 64 Zeichen lang sein",
            }),
        lastName: z
            .string()
            .min(2, {
                message: "Dein Nachname muss mindestens 2 Zeichen lang sein",
            })
            .max(64, {
                message: "Dein Nachname darf maximal 64 Zeichen lang sein",
            }),
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
        passwordConfirm: z
            .string()
            .min(8, {
                message: "Das Passwort muss mindestens 8 Zeichen lang sein",
            })
            .max(64, {
                message: "Das Passwort darf maximal 64 Zeichen lang sein",
            }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Diese Eingabe stimmt nicht mit vorherigen Passwort überein",
    });

export default function SignUp({ className, ...props }: SignUpProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    type SignUpSchemaType = z.infer<typeof signUpSchema>;
    const form = useForm<SignUpSchemaType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    async function onSubmit(values: SignUpSchemaType) {
        setIsLoading(true);

        wretch(`http://localhost:3001/sign-up`)
            .post(values)
            .res((res: any) => {
                toast({
                    title: "Juhu! Du hast dich erfolgreich registriert",
                    description: "Gleich wirst du zur Anmeldung weitergeleitet",
                });

                form.reset();

                setTimeout(() => {
                    redirect("/sign-in");
                }, 3000);
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
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vorname</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Vorname"
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
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nachname</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nachname"
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
                            <FormField
                                control={form.control}
                                name="passwordConfirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Passwort wiederholen
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Passwort wiederholen"
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
                                Du hast schon ein{" "}
                                <Link
                                    href="/sign-in"
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

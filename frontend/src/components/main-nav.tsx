import Link from "next/link";

import { cn } from "@/lib/utils";

export default function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn(
                "flex items-center justify-end space-x-4 lg:space-x-6 py-4 px-6",
                className
            )}
            {...props}
        >
            <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Home
            </Link>
            <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Los geht's
            </Link>
        </nav>
    );
}

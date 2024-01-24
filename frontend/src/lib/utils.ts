import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// TODO: for later usage with the vercel swr library
export function fetcher(url: string, jwt: string) {
    return fetch(url, {
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        }),
    }).then(async (res) => {
        const json = await res.json();
        if (res.ok) {
            return json.data;
        } else if (res.status === 404) {
            const error: any = new Error(
                "The requested resource could not be found."
            );
            error.info = await res.json();
            error.status = res.status;

            throw error;
        } else {
            // TODO: handle different error codes
            return Promise.reject(json);
        }
    });
}

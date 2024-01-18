"use client";

import { createContext, useEffect, useReducer } from "react";

export const AuthStateContext = createContext<any>(null);
export const AuthDispatchContext = createContext<any>(null);

type AuthState = { isLoggedIn: boolean; jwt: string; user: any };

type AuthAction =
    | { type: "signin"; jwt: string; user: any }
    | { type: "signout" };

export const authReducer = (
    state: AuthState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case "signin":
            return {
                isLoggedIn: true,
                jwt: action.jwt,
                user: action.user,
            };
        case "signout":
            return { isLoggedIn: false, jwt: "", user: {} };
        default:
            return state;
    }
};

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, {
        isLoggedIn: false,
        jwt: "",
        user: {},
    });

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        const user = JSON.parse(localStorage.getItem("user")!);

        if (jwt !== "") {
            dispatch({ type: "signin", jwt: jwt!, user: user! });
        }
    }, []);

    return (
        <AuthStateContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

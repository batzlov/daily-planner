"use client";

import { createContext, useEffect, useReducer } from "react";

export const AuthStateContext = createContext<any>(null);
export const AuthDispatchContext = createContext<any>(null);

type AuthState = { isLoggedIn: boolean; jwt: string };

type AuthAction = { type: "signin"; jwt: string } | { type: "signout" };

export const authReducer = (
    state: AuthState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case "signin":
            return {
                isLoggedIn: true,
                jwt: action.jwt,
            };
        case "signout":
            return { isLoggedIn: false, jwt: "" };
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
    });

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");

        if (jwt !== "") {
            dispatch({ type: "signin", jwt: jwt! });
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

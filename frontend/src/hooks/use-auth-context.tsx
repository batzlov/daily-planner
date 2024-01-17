import { AuthDispatchContext, AuthStateContext } from "@/context/auth-context";
import { useContext } from "react";

export const useAuthContext = () => {
    const state = useContext(AuthStateContext);
    const dispatch = useContext(AuthDispatchContext);

    if (!state || !dispatch) {
        throw Error(
            "useAuthContext must be used inside an AuthContextProvider"
        );
    }

    return { state, dispatch };
};

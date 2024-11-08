import {useState} from "react";

export const useMutationState = (mutationToRun: any) => {
    const [pending, setPending] = useState(false);

    const mutate = async (payload: any) => {
        setPending(true);

        try {
            return await mutationToRun(payload);
        } catch (error) {
            throw error;
        } finally {
            setPending(false);
        }
    };

    return { mutate, pending };
};
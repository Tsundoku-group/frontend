import { useState } from "react";

export const useMutationState = (mutationToRun: (...args: any[]) => Promise<any>) => {
    const [pending, setPending] = useState(false);

    const mutate = async (...args: any[]) => {
        setPending(true);

        try {
            return await mutationToRun(...args);
        } catch (error) {
            throw error;
        } finally {
            setPending(false);
        }
    };

    return { mutate, pending };
};
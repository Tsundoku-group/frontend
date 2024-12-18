import React from "react";
import { useProfile } from "@/context/profileContext";
import LoadingSkeleton from "@/components/loader/LoadingSkeleton";

const GlobalLoader = () => {
    const { isLoading } = useProfile();

    if (!isLoading) return null;

    return <LoadingSkeleton />;
};

export default GlobalLoader;
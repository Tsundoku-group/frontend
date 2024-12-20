import React from "react";
import {useProfileContext} from "@/context/profileContext";
import LoadingSkeleton from "@/components/loader/LoadingSkeleton";

const GlobalLoader = () => {
    const {isLoading} = useProfileContext();

    if (!isLoading) return null;

    return <LoadingSkeleton/>;
};

export default GlobalLoader;
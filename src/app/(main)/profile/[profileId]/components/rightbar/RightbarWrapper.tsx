'use client'

import React from "react";
import PreferredGenresCard from "@/app/(main)/profile/[profileId]/components/rightbar/components/PreferredGenresCard";
import ReviewsCard from "@/app/(main)/profile/[profileId]/components/rightbar/components/ReviewsCard";
import ArticlesCard from "@/app/(main)/profile/[profileId]/components/rightbar/components/ArticlesCard";
import ClubsCard from "@/app/(main)/profile/[profileId]/components/rightbar/components/ClubsCard";

type Props = React.PropsWithChildren<{}>;

const RightbarWrapper = React.memo(({children}: Props) => {
    return (
        <>
            <div className="col-start-10 col-end-13 h-full flex flex-col space-y-4">
                <div className="space-y-6 pl-6 bg-dark-900 rounded-lg">
                    <PreferredGenresCard/>
                    <ReviewsCard/>
                    <ArticlesCard/>
                    <ClubsCard/>
                </div>
                {children}
            </div>
        </>
    );
});

RightbarWrapper.displayName = 'leftbarWrapper'

export default RightbarWrapper;
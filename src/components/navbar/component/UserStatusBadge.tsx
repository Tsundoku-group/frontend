"use client";

import MinusRedCircle from "@/assets/status/MinusRedCircle";
import YellowMoon from "@/assets/status/YellowMoon";
import React from "react";

export enum ProfileStatus {
    Online = 'online',
    DoNotDisturb = 'do_not_disturb',
    Away = 'away',
    Offline = 'offline'
}

type Props = {
    status: ProfileStatus;
};

export default function UserStatusBadge({ status }: Props) {
    return (
        <div className="w-5 h-5 rounded-full border-2 border-tertiary-black flex items-center justify-center">
            {status === ProfileStatus.Online && (
                <div className="w-full h-full rounded-full bg-green-highlight" />
            )}
            {status === ProfileStatus.DoNotDisturb && <MinusRedCircle />}
            {status === ProfileStatus.Away && (
                <div className="bg-tertiary-black rounded-full w-5 h-5 flex items-center justify-center overflow-hidden">
                    <YellowMoon />
                </div>
            )}
            {status === ProfileStatus.Offline && (
                <div className="w-full h-full flex items-center justify-center bg-gray-500 rounded-full">
                    <div className="w-2/4 h-2/4 bg-gray-900 rounded-full" />
                </div>
            )}
        </div>
    );
}
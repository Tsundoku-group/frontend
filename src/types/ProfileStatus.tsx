import { JSX } from "react";
import YellowMoon from "@/assets/status/YellowMoon";
import MinusRedCircle from "@/assets/status/MinusRedCircle";

export enum ProfileStatus {
    Online = "online",
    DoNotDisturb = "do_not_disturb",
    Away = "away",
    Offline = "offline",
}

export const profileStatusConfig: Record<ProfileStatus, { label: string; icon: JSX.Element }> = {
    [ProfileStatus.Online]: {
        label: "Actif",
        icon: <div className="w-full h-full bg-green-500 rounded-full" />,
    },
    [ProfileStatus.DoNotDisturb]: {
        label: "Ne pas déranger",
        icon: <MinusRedCircle />,
    },
    [ProfileStatus.Away]: {
        label: "Absent",
        icon: <YellowMoon />,
    },
    [ProfileStatus.Offline]: {
        label: "Hors ligne",
        icon: (
            <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-2/4 h-2/4 bg-gray-900 rounded-full" />
            </div>
        ),
    },
};
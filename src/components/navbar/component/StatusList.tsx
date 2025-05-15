import { RadioGroupItem } from "@/components/ui/radio-group";
import { ProfileStatus } from "./UserStatusBadge";
import {profileStatusConfig} from "@/types/ProfileStatus";

interface Props {
    activeStatus: ProfileStatus;
}

export function StatusList({ activeStatus }: Props) {
    const labels: Record<ProfileStatus, string> = {
        online: 'Actif',
        do_not_disturb: 'Ne pas déranger',
        away: 'Absent',
        offline: 'Hors ligne',
    };

    return (
        <>
            {Object.values(ProfileStatus).map((status) => (
                <div
                    key={status}
                    className={`flex items-center p-2 text-white w-full hover:bg-gray-700 rounded-lg transition ${
                        activeStatus === status ? "bg-gray-800 border border-green-500" : ""
                    }`}
                >
                    <label htmlFor={`status-${status}`} className="flex items-center w-full cursor-pointer">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center">
                            {profileStatusConfig[status].icon}
                        </div>
                        <span className="ml-4">{profileStatusConfig[status].label}</span>
                    </label>
                    <RadioGroupItem
                        value={status}
                        id={`status-${status}`}
                        className="h-5 w-5 border-gray-400 checked:bg-green-500"
                    />
                </div>
            ))}
        </>
    );
}
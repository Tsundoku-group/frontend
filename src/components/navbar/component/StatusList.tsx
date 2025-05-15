import { RadioGroupItem } from "@/components/ui/radio-group";
import { ProfileStatus } from "./UserStatusBadge";
import MinusRedCircle from "@/assets/status/MinusRedCircle";
import YellowMoon from "@/assets/status/YellowMoon";

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
                <div key={status} className={`flex items-center p-2 text-white w-full hover:bg-gray-700 rounded-lg transition ${activeStatus === status ? 'bg-gray-800 border border-green-500' : ''}`}>
                    <label htmlFor={`status-${status}`} className="flex items-center w-full cursor-pointer">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center">
                            {status === ProfileStatus.Online && <div className="w-full h-full bg-green-500 rounded-full" />}
                            {status === ProfileStatus.DoNotDisturb && <MinusRedCircle />}
                            {status === ProfileStatus.Away && <YellowMoon />}
                            {status === ProfileStatus.Offline && (
                                <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
                                    <div className="w-2/4 h-2/4 bg-gray-900 rounded-full" />
                                </div>
                            )}
                        </div>
                        <span className="ml-4">{labels[status]}</span>
                    </label>
                    <RadioGroupItem value={status} id={`status-${status}`} className="h-5 w-5 border-gray-400 checked:bg-green-500" />
                </div>
            ))}
        </>
    );
}
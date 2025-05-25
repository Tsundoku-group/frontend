export interface Badge {
    id: number;
    awardedAt: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
    challengeName: string;
    challengeType: string;
}
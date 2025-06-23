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

export interface Challenge {
    id: number;
    name: string;
    type: string;
    status: string;
    creator: {
        id: number;
        username: string;
    }
    startAt: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
    endAt: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
    constraint: {
        action: string;
        contentType: string;
        frequency: string;
        targetCount: number;
    }
}
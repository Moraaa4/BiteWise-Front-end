export interface UserProfile {
    name: string;
    initials: string;
    plan: string;
    email: string;
    weeklyBudget: number;
    currency: string;
    memberSince: string;
    stats: {
        recipes: number;
        lists: number;
        savings: number; // percentage
    };
}

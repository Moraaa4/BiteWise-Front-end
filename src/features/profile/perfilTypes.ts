export interface UserProfile {
    id?: string;
    name: string;
    initials: string;
    plan: string;
    role?: string;
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

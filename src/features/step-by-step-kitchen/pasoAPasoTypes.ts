export interface CookingStep {
    id: string;
    stepNumber: number;
    title: string;
    description: string;
    imageUrl?: string; // optional, provided by backend
}

export interface CookingGuide {
    recipeName: string;
    steps: CookingStep[]; // populated by backend
}

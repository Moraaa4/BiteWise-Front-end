import React from "react";

interface StarRatingProps {
    rating: number;
    max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill={i < rating ? "#22c55e" : "#e5e7eb"}
                >
                    <path d="M6 1l1.39 2.81L10.5 4.27l-2.25 2.19.53 3.1L6 7.95l-2.78 1.61.53-3.1L1.5 4.27l3.11-.46z" />
                </svg>
            ))}
        </div>
    );
}

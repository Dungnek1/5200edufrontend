"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    size?: "sm" | "md" | "lg";
    fillColor?: string;
    emptyColor?: string;
}

export function StarRating({
    rating = 0,
    size = "md",
    fillColor = "#FF9500",
    emptyColor = "#D1D5DB",
}: StarRatingProps) {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };


    const fullStars = Math.floor(rating);



    return (
        <div className="flex gap-0.5 items-center">
            {Array.from({ length: 5 }, (_, i) => {

                if (i < fullStars) {
                    return (
                        <Star
                            key={i}
                            className={`${sizeClasses[size]} fill-[#FF9500] text-[#FF9500]`}
                        />
                    );
                }


                return (
                    <Star
                        key={i}
                        className={`${sizeClasses[size]} fill-none text-gray-300 stroke-2`}
                    />
                );
            })}
        </div>
    );
}
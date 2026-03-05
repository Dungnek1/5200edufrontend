"use client";

interface ModuleLockIconProps {
    size?: number;
    fillColor?: string;
    strokeColor?: string;
}

export function ModuleLockIcon({
    size = 24,
    fillColor = "#F5F5F5",
    strokeColor = "#575757",
}: ModuleLockIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="24" height="24" rx="12" fill={fillColor} />
            <g clipPath="url(#clip0_module_lock)">
                <path
                    d="M5.3335 14.666C5.3335 12.7804 5.3335 11.8376 5.91928 11.2518C6.50507 10.666 7.44788 10.666 9.3335 10.666H14.6668C16.5524 10.666 17.4953 10.666 18.081 11.2518C18.6668 11.8376 18.6668 12.7804 18.6668 14.666C18.6668 16.5516 18.6668 17.4944 18.081 18.0802C17.4953 18.666 16.5524 18.666 14.6668 18.666H9.3335C7.44788 18.666 6.50507 18.666 5.91928 18.0802C5.3335 17.4944 5.3335 16.5516 5.3335 14.666Z"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0.96"
                />
                <path
                    d="M8 10.6673V9.33398C8 7.12485 9.79086 5.33398 12 5.33398C14.2091 5.33398 16 7.12485 16 9.33398V10.6673"
                    stroke={strokeColor}
                    strokeWidth="0.96"
                    strokeLinecap="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_module_lock">
                    <rect width="16" height="16" fill="white" transform="translate(4 4)" />
                </clipPath>
            </defs>
        </svg>
    );
}

import React from 'react';

export const ActivityIndicator = ({ level = 5 }) => {
    // Different green shades - lightest to darkest
    const colors = [
        '#d1fae5', // very light green
        '#a7f3d0', // light green
        '#6ee7b7', // medium light green
        '#34d399', // medium green
        '#10b981'  // dark green
    ];

    const inactiveColor = '#d1d5db'; // gray-300

    return (
        <svg width="60" height="60" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
            {[...Array(5)].map((_, i) => {
                const isActive = i < level;
                const cx = 25 + i * 20;
                return (
                    <g key={i}>
                        <circle
                            cx={cx}
                            cy="25"
                            r="20"
                            fill={isActive ? colors[i] : inactiveColor}
                            stroke="#ffffff"
                            strokeWidth="3"
                        />
                    </g>
                );
            })}
        </svg>
    );
};

export default ActivityIndicator;
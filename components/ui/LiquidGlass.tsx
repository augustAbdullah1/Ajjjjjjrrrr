import React, { useId } from 'react';

interface LiquidGlassProps {
    displacementScale?: number;
    className?: string;
    style?: React.CSSProperties;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({
    displacementScale = 20,
    className,
    style,
}) => {
    const filterId = useId();

    return (
        <>
            {/* The div that will have the effect applied */}
            <div
                className={className}
                style={{
                    ...style,
                    filter: `url(#${filterId})`,
                }}
            />
            {/* SVG filter definition, hidden from view */}
            <svg className="sr-only" width="0" height="0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id={filterId}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.02 0.05"
                            numOctaves="1"
                            result="turbulence"
                        >
                             <animate
                                attributeName="baseFrequency"
                                dur="20s"
                                values="0.02 0.05;0.03 0.07;0.02 0.05"
                                repeatCount="indefinite"
                            />
                        </feTurbulence>
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="turbulence"
                            scale={displacementScale}
                        />
                    </filter>
                </defs>
            </svg>
        </>
    );
};

export default LiquidGlass;

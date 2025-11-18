import React, { useId } from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    const gooFilterId = useId();

    return (
        <>
            <label className="aajerr-toggle">
                <input 
                    type="checkbox" 
                    checked={checked} 
                    onChange={(e) => onChange(e.target.checked)} 
                    className="sr-only" 
                />
                {/* This is the visible glassmorphic track (the pill shape) */}
                <div className="aajerr-toggle-track"></div>
                
                {/* This container holds the gooey parts and applies the SVG filter */}
                <div className="aajerr-toggle-gooey-container" style={{ filter: `url(#${gooFilterId})` }}>
                    {/* The moving knob */}
                    <div className="aajerr-toggle-knob"></div>
                    {/* A static blob that the knob merges with to create the stretch effect */}
                    <div className="aajerr-toggle-blob"></div>
                </div>
            </label>

            {/* SVG goo filter definition, hidden from view */}
            <svg className="sr-only" width="0" height="0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id={gooFilterId}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>
        </>
    );
};

export default ToggleSwitch;
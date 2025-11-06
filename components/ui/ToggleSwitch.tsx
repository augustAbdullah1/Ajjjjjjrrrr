
import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    return (
        <label className="relative inline-block w-12 h-6 cursor-pointer">
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={(e) => onChange(e.target.checked)} 
                className="opacity-0 w-0 h-0" 
            />
            <span 
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${checked ? 'bg-green-500' : 'bg-gray-500/50'}`}
            ></span>
            <span 
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            ></span>
        </label>
    );
};

export default ToggleSwitch;

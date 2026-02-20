
import React, { useId } from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
    const id = useId();
    // Create unique IDs for filters to avoid conflicts if multiple toggles are on screen
    const uniqueId = id.replace(/[^a-zA-Z0-9-_]/g, '_');
    const gooFilterId = `goo-${uniqueId}`;
    const removeBlackFilterId = `remove-black-${uniqueId}`;

    return (
        <div className="liquid-glass-toggle-container" style={{ '--complete': checked ? 1 : 0 } as React.CSSProperties}>
            <style>{`
                /* Property definition to allow animating the number */
                @property --complete {
                    syntax: '<number>';
                    inherits: true;
                    initial-value: 0;
                }

                .liquid-glass-toggle-container {
                    display: inline-block;
                    --width: 60px;
                    --height: 34px;
                    --border-radius: 100px;
                    --border-width: 4px;
                    --transition-speed: 0.4s;
                    --ease: cubic-bezier(0.34, 1.56, 0.64, 1);
                    
                    /* Theme Colors */
                    --color-active: var(--theme-primary-accent);
                    --color-inactive: rgba(128, 128, 128, 0.25);
                    --color-knob-off: #ffffff;
                    --color-knob-on: var(--theme-primary-accent-text);
                    
                    /* Animation State (0 to 1) */
                    transition: --complete var(--transition-speed) var(--ease);
                }

                .liquid-toggle-btn {
                    position: relative;
                    width: var(--width);
                    height: var(--height);
                    border-radius: var(--border-radius);
                    background: transparent;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    outline: none;
                    container-type: inline-size; /* Required for cqi units */
                    -webkit-tap-highlight-color: transparent;
                    transform: translate3d(0,0,0); /* Force hardware acceleration */
                }

                /* 1. The Background Track (Knockout) */
                /* This layer uses a filter to turn black pixels transparent */
                .toggle-knockout {
                    position: absolute;
                    inset: 0;
                    border-radius: var(--border-radius);
                    filter: url(#${removeBlackFilterId});
                    overflow: hidden;
                }
                
                /* The actual background color container */
                .toggle-indicator {
                    width: 100%;
                    height: 100%;
                    border-radius: var(--border-radius);
                    background: var(--color-inactive);
                    transition: background var(--transition-speed);
                }
                
                .liquid-glass-toggle-container[style*="--complete: 1"] .toggle-indicator {
                    background: var(--color-active);
                }

                /* The "Mask" - this black dot creates the hole in the background */
                .toggle-mask {
                    position: absolute;
                    height: calc(100% - (var(--border-width) * 2));
                    width: calc(100% * 0.55); /* Approx aspect ratio for the blob */
                    top: var(--border-width);
                    left: var(--border-width);
                    /* Move from left to right based on --complete */
                    transform: translateX(calc(var(--complete) * (100cqi - 100% - (var(--border-width) * 2))));
                }
                
                .toggle-mask-blob {
                    width: 100%;
                    height: 100%;
                    background: #000; /* Black becomes transparent due to filter */
                    border-radius: var(--border-radius);
                    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                /* 2. The Liquid Blob (Foreground) */
                .toggle-liquid-layer {
                    position: absolute;
                    inset: 0;
                    border-radius: var(--border-radius);
                    filter: url(#${gooFilterId}); /* The goo effect */
                    pointer-events: none;
                }

                .toggle-liquid-track {
                    position: absolute;
                    height: calc(100% - (var(--border-width) * 2));
                    width: calc(100% * 0.55); /* Must match mask width */
                    top: var(--border-width);
                    left: var(--border-width);
                    
                    /* Move with same logic as mask */
                    transform: translateX(calc(var(--complete) * (100cqi - 100% - (var(--border-width) * 2))));
                }
                
                .toggle-liquid-blob {
                    width: 100%;
                    height: 100%;
                    border-radius: var(--border-radius);
                    background: var(--color-knob-off);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: background-color var(--transition-speed), transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .liquid-glass-toggle-container[style*="--complete: 1"] .toggle-liquid-blob {
                    background: var(--color-knob-on);
                }
                
                /* Press Interaction - Scaling */
                .liquid-toggle-btn:active .toggle-mask-blob,
                .liquid-toggle-btn:active .toggle-liquid-blob {
                    transform: scale(1.15, 0.85);
                }

                /* Shadows/Highlights for Glass Effect */
                .toggle-shadow {
                    position: absolute;
                    inset: 0;
                    border-radius: var(--border-radius);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                    pointer-events: none;
                    z-index: 10;
                }
            `}</style>

            <svg className="sr-only" width="0" height="0" aria-hidden="true">
                <defs>
                    <filter id={gooFilterId} colorInterpolationFilters="sRGB">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                    <filter id={removeBlackFilterId} colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 1" result="black-pixels" />
                        <feComposite in="SourceGraphic" in2="black-pixels" operator="out" />
                    </filter>
                </defs>
            </svg>

            <button 
                className="liquid-toggle-btn" 
                role="switch"
                aria-checked={checked}
                aria-label="Toggle setting"
                onClick={() => onChange(!checked)}
            >
                <div className="toggle-knockout">
                    <div className="toggle-indicator">
                        <div className="toggle-mask">
                            <div className="toggle-mask-blob"></div>
                        </div>
                    </div>
                </div>
                
                <div className="toggle-liquid-layer">
                     <div className="toggle-liquid-track">
                        <div className="toggle-liquid-blob"></div>
                     </div>
                </div>

                <div className="toggle-shadow"></div>
            </button>
        </div>
    );
};

export default ToggleSwitch;

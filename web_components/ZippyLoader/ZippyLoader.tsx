import './ZippyLoader.css';
import React from 'react';

export default function ZippyLoader({ children }: { children: React.ReactNode }) {
    return (
        <div className="loading-wrapper">
            <div className="loading-content">
                {children}
            </div>
        </div>
    )
}

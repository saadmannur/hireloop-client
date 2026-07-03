import React from 'react';

const StatCard = ({ icon, value, label }) => (
    <div className="bg-surface-secondary border border-border rounded-lg p-4">
        <div className="text-muted mb-2 text-lg">{icon}</div>
        <p className="text-sm font-medium text-foreground">{value}</p>
        <p className="text-[10px] text-muted tracking-wide mt-0.5">{label}</p>
    </div>
);

export default StatCard;
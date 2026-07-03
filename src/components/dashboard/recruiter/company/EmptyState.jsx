import React from 'react';
import { Button } from '@heroui/react';
import { HiOutlineOfficeBuilding, HiOutlinePhotograph } from 'react-icons/hi';

const EmptyState = ({ onRegister }) => (
    <div className="flex flex-col items-center justify-center text-center py-28 px-4">
        <div className="relative mb-8">
            <div className="absolute inset-0 blur-2xl bg-surface-secondary rounded-full scale-150" />
            <div className="relative size-24 rounded-2xl bg-surface border border-border flex items-center justify-center">
                <HiOutlinePhotograph className="text-3xl text-muted" />
            </div>
            <div className="absolute -top-2 -right-2 size-9 rounded-full bg-background border border-border flex items-center justify-center">
                <HiOutlineOfficeBuilding className="text-muted" />
            </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-2">
            Company not registered yet
        </h2>
        <p className="text-muted text-sm max-w-sm mb-6">
            Set up your business profile to start posting high-performance job
            listings and manage your talent loop.
        </p>

        <div className="flex items-center gap-3">
            <Button variant="primary" className="min-w-32" onPress={onRegister}>
                Register your company
            </Button>
            <Button variant="secondary" className="min-w-24">
                View FAQ
            </Button>
        </div>

        <p className="text-muted text-xs mt-8">
            Need specialized assistance?{' '}
            <span className="text-foreground underline underline-offset-2 cursor-pointer">
                Contact our enterprise support team.
            </span>
        </p>
    </div>
);

export default EmptyState;
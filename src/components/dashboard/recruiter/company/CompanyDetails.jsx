import React from 'react';
import { Button, Chip } from '@heroui/react';
import {
    HiOutlinePencil,
    HiOutlineLocationMarker,
    HiOutlineUserGroup,
    HiOutlineGlobeAlt,
} from 'react-icons/hi';
import { FiCheckCircle } from 'react-icons/fi';
import StatCard from './StatCard';
import Image from 'next/image';

// v3 Chip: variant is soft/primary/secondary/tertiary, color is
// default/accent/success/warning/danger
const STATUS_COLOR = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
};

const CompanyDetails = ({ company, onEdit }) => {
    // console.log(company, "details page");

    return (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {/* cover / hero strip */}
            <div className="h-32 ">
                <Image
                    src={company.logoUrl}
                    alt={company.name}
                    width={700}
                    height={200}
                    className='w-full h-full'
                ></Image>
            </div>

            <div className="px-6 pb-6">
                <div className="flex items-start justify-between -mt-10">
                    <div className="size-16 rounded-xl bg-warning flex items-center justify-center text-2xl font-bold text-warning-foreground border-4 border-surface">
                        {company.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <Button
                        variant="secondary"
                        className="mt-10"
                        onPress={onEdit}
                    >
                        <HiOutlinePencil />
                        Edit
                    </Button>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <h2 className="text-xl font-semibold text-foreground">
                        {company.name}
                    </h2>
                    <Chip variant="soft" color={STATUS_COLOR[company.status] || 'default'}>
                        <FiCheckCircle className="text-xs" />
                        {company.status
                            ? company.status.charAt(0).toUpperCase() + company.status.slice(1)
                            : 'Pending'}
                    </Chip>
                </div>

                {company.description && (
                    <p className="text-muted text-sm mt-1 max-w-2xl">
                        {company.description}
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <StatCard
                        icon={<HiOutlineUserGroup />}
                        value={company.employeeRange || '—'}
                        label="EMPLOYEES"
                    />
                    <StatCard
                        icon={<HiOutlineLocationMarker />}
                        value={company.location || '—'}
                        label="HEADQUARTERS"
                    />
                    <StatCard
                        icon={<HiOutlineGlobeAlt />}
                        value={company.industry || '—'}
                        label="INDUSTRY"
                    />
                </div>

                {company.website && (
                    <a
                        href={
                            company.website.startsWith('http')
                                ? company.website
                                : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mt-6"
                    >
                        <HiOutlineGlobeAlt />
                        {company.website}
                    </a>
                )}
            </div>
        </div>
    );
}

export default CompanyDetails;
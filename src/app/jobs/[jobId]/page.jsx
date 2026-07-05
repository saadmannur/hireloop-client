import { getJobById } from '@/lib/api/jobs';
import Link from 'next/link';
import React from 'react';
import { FiTag, FiMapPin, FiBriefcase, FiCalendar, FiBookmark } from 'react-icons/fi';

const StatCard = ({ icon, label, value, sub }) => (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 text-xs">
            {icon}
            <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
            {value}
        </span>
        {sub && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{sub}</span>
        )}
    </div>
);

const Section = ({ title, content }) => {
    if (!content) return null;
    return (
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-2">{title}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {content}
            </p>
        </div>
    );
};

const Row = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400 dark:text-neutral-500">{label}</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{value}</span>
        </div>
    );
};

const JobDetailsPage = async ({ params }) => {
    const { jobId } = await params;
    const job = await getJobById(jobId);

    const {
        _id,
        title,
        category,
        jobType,
        salaryMin,
        salaryMax,
        currency,
        isRemote,
        city,
        country,
        applicationDeadline,
        responsibilities,
        requirements,
        benefits,
        companyName,
        companyImage,
    } = job;

    const location = isRemote ? 'Remote' : [city, country].filter(Boolean).join(', ');

    const deadlineDate = applicationDeadline ? new Date(applicationDeadline) : null;
    const deadlineFormatted = deadlineDate
        ? deadlineDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'N/A';

    const daysLeft = deadlineDate
        ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-4">
                {/* Header */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        {companyImage ? (
                            <img
                                src={companyImage}
                                alt={companyName}
                                className="w-14 h-14 shrink-0 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                            />
                        ) : (
                            <div className="w-14 h-14 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-semibold text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                {companyName?.charAt(0) || '?'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">
                                {title}
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                                {companyName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            aria-label="Save job"
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-primary hover:border-primary transition-colors"
                        >
                            <FiBookmark />
                        </button>
                        <Link
                            href={`/jobs/${_id}/apply`}
                            className="px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard
                                icon={<FiTag />}
                                label="Salary Range"
                                value={`${currency} ${salaryMin?.toLocaleString()} - ${salaryMax?.toLocaleString()}`}
                            />
                            <StatCard icon={<FiMapPin />} label="Location" value={location} />
                            <StatCard icon={<FiBriefcase />} label="Job Type" value={jobType} />
                            <StatCard
                                icon={<FiCalendar />}
                                label="Deadline"
                                value={deadlineFormatted}
                                sub={
                                    daysLeft !== null
                                        ? daysLeft > 0
                                            ? `${daysLeft} days left`
                                            : 'Closed'
                                        : null
                                }
                            />
                        </div>

                        <Section title="Responsibilities" content={responsibilities} />
                        <Section title="Requirements" content={requirements} />
                        <Section title="Benefits" content={benefits} />
                    </div>

                    {/* Sidebar */}
                    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 h-fit space-y-4">
                        <h2 className="font-semibold text-neutral-900 dark:text-white">
                            Company Overview
                        </h2>

                        {companyImage && (
                            <img
                                src={companyImage}
                                alt={companyName}
                                className="w-full h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                            />
                        )}

                        <div className="space-y-2">
                            <Row label="Company" value={companyName} />
                            <Row label="Category" value={category} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;
'use client';

import React, { useMemo, useState } from 'react';
import { Table, Button } from '@heroui/react';
import { FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PAGE_SIZE = 5;

// NOTE: your application objects (from the sample you shared) don't include a
// `status` field yet. This falls back to "Applied" until that field exists on
// the backend — swap `job.status` in once it's available.
const getStatus = (job) => job.status || 'Applied';

const statusStyles = {
    Applied: 'border-neutral-300 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300',
    Review: 'border-amber-300 text-amber-600 dark:border-amber-500/40 dark:text-amber-400',
    Shortlisted: 'border-emerald-300 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-400',
    Rejected: 'border-red-300 text-red-600 dark:border-red-500/40 dark:text-red-400',
    Offered: 'border-blue-300 text-blue-600 dark:border-blue-500/40 dark:text-blue-400',
};

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.Applied
            }`}
    >
        {status}
    </span>
);

const timeAgo = (dateInput) => {
    const date = new Date(dateInput);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const units = [
        { label: 'year', secs: 31536000 },
        { label: 'month', secs: 2592000 },
        { label: 'week', secs: 604800 },
        { label: 'day', secs: 86400 },
        { label: 'hour', secs: 3600 },
        { label: 'minute', secs: 60 },
    ];
    for (const unit of units) {
        const value = Math.floor(seconds / unit.secs);
        if (value >= 1) return `${value} ${unit.label}${value > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
};

const StatCard = ({ label, value, valueClassName }) => (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className={`text-2xl font-bold mt-1 text-neutral-900 dark:text-white ${valueClassName || ''}`}>
            {value}
        </p>
    </div>
);

const ApplicationsTable = ({ appliedJobs = [] }) => {
    const [tab, setTab] = useState('active');
    const [page, setPage] = useState(1);

    const jobs = useMemo(
        () => appliedJobs.map((job) => ({ ...job, status: getStatus(job) })),
        [appliedJobs]
    );

    const archivedStatuses = ['Rejected'];
    const filteredJobs = useMemo(
        () =>
            tab === 'active'
                ? jobs.filter((j) => !archivedStatuses.includes(j.status))
                : jobs.filter((j) => archivedStatuses.includes(j.status)),
        [jobs, tab]
    );

    const total = filteredJobs.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageJobs = filteredJobs.slice(pageStart, pageStart + PAGE_SIZE);

    const stats = useMemo(() => {
        const shortlisted = jobs.filter((j) => j.status === 'Shortlisted').length;
        const interviews = jobs.filter((j) => j.status === 'Interview').length;
        const offered = jobs.filter((j) => j.status === 'Offered').length;
        const successRate = jobs.length ? Math.round((offered / jobs.length) * 100) : 0;
        return { total: jobs.length, shortlisted, interviews, successRate };
    }, [jobs]);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            My Applications
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Track your job applications and interview progress in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="inline-flex p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            {['active', 'archived'].map((key) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setTab(key);
                                        setPage(1);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${tab === key
                                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                                            : 'text-neutral-500 dark:text-neutral-400'
                                        }`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>

                        <Button className="font-medium bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
                            <FiDownload size={15} />
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total Applied" value={stats.total} />
                    <StatCard label="Shortlisted" value={stats.shortlisted} />
                    <StatCard
                        label="Interviews"
                        value={stats.interviews}
                        valueClassName="text-amber-500 dark:text-amber-400"
                    />
                    <StatCard
                        label="Success Rate"
                        value={`${stats.successRate}%`}
                        valueClassName="text-emerald-600 dark:text-emerald-400"
                    />
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="My job applications">
                                <Table.Header>
                                    <Table.Column isRowHeader>Job Title</Table.Column>
                                    <Table.Column>Company</Table.Column>
                                    <Table.Column>Applied</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Action</Table.Column>
                                </Table.Header>
                                <Table.Body
                                    renderEmptyState={() => (
                                        <div className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            No applications to show here.
                                        </div>
                                    )}
                                >
                                    {pageJobs.map((job) => (
                                        <Table.Row key={job.id}>
                                            <Table.Cell>
                                                <span className="font-medium text-neutral-900 dark:text-white">
                                                    {job.jobName}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-neutral-600 dark:text-neutral-300">
                                                    {job.companyName}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    {timeAgo(job.createdAt)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <StatusBadge status={job.status} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <a
                                                    href={`/applications/${job.id}`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    Details
                                                </a>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>

                        <Table.Footer className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                {total === 0
                                    ? 'No applications'
                                    : `Showing ${pageStart + 1}-${Math.min(pageStart + PAGE_SIZE, total)} of ${total} applications`}
                            </span>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${page === p
                                                ? 'bg-primary text-white'
                                                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        </Table.Footer>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsTable;
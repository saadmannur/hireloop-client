'use client';

import React, { useMemo, useState } from 'react';
import { Table, Button, Modal, useOverlayState, toast,  } from '@heroui/react';
import { FiPlus, FiGlobe, FiMapPin, FiUsers } from 'react-icons/fi';
import { updateCompany } from '@/lib/actions/companies';


const statusStyles = {
    pending: 'border-amber-300 text-amber-600 bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:bg-amber-500/10',
    approved: 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/10',
    rejected: 'border-red-300 text-red-600 bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:bg-red-500/10',
};

const dotStyles = {
    pending: 'bg-amber-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
};

const formatDate = (dateInput) =>
    new Date(dateInput).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const getInitials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

const StatusBadge = ({ status, onClick, clickable }) => (
    <button
        onClick={clickable ? onClick : undefined}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusStyles[status] || statusStyles.pending
            } ${clickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
    >
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || dotStyles.pending}`} />
        {status}
    </button>
);

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

const CompaniesTable = ({ companies: initialCompanies = [] }) => {
    const [companies, setCompanies] = useState(initialCompanies);
    const [activeCompany, setActiveCompany] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const modalState = useOverlayState({ defaultOpen: false });

    const openReview = (company) => {
        setActiveCompany(company);
        modalState.open();
    };

    const handleDecision = async (status) => {
        if (!activeCompany) return;
        setIsUpdating(true);
        try {
            const data = await updateCompany(activeCompany._id, { status: status });
            console.log(data, 'response');

            if (data.modifiedCount > 0) {
                toast.success("Status Update Successfully");
            }

            setCompanies((prev) =>
                prev.map((c) => (c._id === activeCompany._id ? { ...c, status } : c))
            );
            modalState.close();
        } catch (err) {
            console.error(err);
            // Swap for a toast if you have one wired up
            alert('Something went wrong updating the status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const counts = useMemo(
        () => ({
            all: companies.length,
            pending: companies.filter((c) => c.status === 'pending').length,
            approved: companies.filter((c) => c.status === 'approved').length,
            rejected: companies.filter((c) => c.status === 'rejected').length,
        }),
        [companies]
    );

    const filteredCompanies = useMemo(
        () =>
            statusFilter === 'all'
                ? companies
                : companies.filter((c) => c.status === statusFilter),
        [companies, statusFilter]
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Company Registrations
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Review and manage corporate entity access requests for the
                            HireLoop ecosystem.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button className="font-medium bg-primary text-white">
                            <FiPlus size={15} />
                            Register New
                        </Button>
                    </div>
                </div>

                {/* Status filter tabs */}
                <div className="flex items-center gap-2 mb-6">
                    {FILTERS.map((key) => (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium capitalize border transition-colors ${statusFilter === key
                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                                }`}
                        >
                            {key}
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === key
                                    ? 'bg-white/20 dark:bg-neutral-900/10'
                                    : 'bg-neutral-100 dark:bg-neutral-800'
                                    }`}
                            >
                                {counts[key]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Company registrations">
                                <Table.Header>
                                    <Table.Column isRowHeader>Company Name</Table.Column>
                                    <Table.Column>Recruiter Email</Table.Column>
                                    <Table.Column>Industry</Table.Column>
                                    <Table.Column>Jobs</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Date Submitted</Table.Column>
                                    <Table.Column>Actions</Table.Column>
                                </Table.Header>
                                <Table.Body
                                    renderEmptyState={() => (
                                        <div className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            No company registrations yet.
                                        </div>
                                    )}
                                >
                                    {filteredCompanies.map((company) => (
                                        <Table.Row key={company._id}>
                                            <Table.Cell>
                                                <div className="flex items-center gap-3">
                                                    {company.logoUrl ? (
                                                        <img
                                                            src={company.logoUrl}
                                                            alt={company.name}
                                                            className="w-8 h-8 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                                                            {getInitials(company.name)}
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-neutral-900 dark:text-white">
                                                        {company.name}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    {company.recruiterEmail || '—'}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                    {company.industry}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                    {company.jobCount}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <StatusBadge
                                                    status={company.status}
                                                    clickable={company.status === 'pending'}
                                                    onClick={() => openReview(company)}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    {formatDate(company.createAt)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <button
                                                    onClick={() => openReview(company)}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    Review
                                                </button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </div>
            </div>

            {/* Review modal */}
            <Modal state={modalState}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="max-w-md">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Review Company</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                {activeCompany && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {activeCompany.logoUrl ? (
                                                <img
                                                    src={activeCompany.logoUrl}
                                                    alt={activeCompany.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                                                    {getInitials(activeCompany.name)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-neutral-900 dark:text-white">
                                                    {activeCompany.name}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {activeCompany.industry}
                                                </p>
                                            </div>
                                        </div>

                                        {activeCompany.description && (
                                            <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                                {activeCompany.description}
                                            </p>
                                        )}

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                                                <FiGlobe size={14} />
                                                <a
                                                    href={activeCompany.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-primary hover:underline truncate"
                                                >
                                                    {activeCompany.website}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                                                <FiMapPin size={14} />
                                                {activeCompany.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                                                <FiUsers size={14} />
                                                {activeCompany.employeeRange}
                                            </div>
                                        </div>

                                        <div className="pt-1">
                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                Submitted {formatDate(activeCompany.createAt)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer className="gap-2">
                                <Button
                                    className="font-medium bg-red-600 text-white disabled:opacity-60"
                                    disabled={isUpdating}
                                    onClick={() => handleDecision('rejected')}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="font-medium bg-emerald-600 text-white disabled:opacity-60"
                                    disabled={isUpdating}
                                    onClick={() => handleDecision('approved')}
                                >
                                    Approve
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};

export default CompaniesTable;
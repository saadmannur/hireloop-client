'use client';

import React, { useMemo, useState } from 'react';
import { Table, Button, Modal, useOverlayState, toast } from '@heroui/react';
import { FiDownload, FiChevronDown, FiChevronLeft, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { updateUserRole } from '@/lib/actions/users';
import { useRouter } from 'next/navigation';
// import { updateUser, deleteUser } from '@/lib/actions/users';

const PAGE_SIZE = 10;
const ROLE_FILTERS = ['all', 'seeker', 'recruiter'];

const avatarPalette = [
    'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
];

const getInitials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

const paletteFor = (name = '') => {
    const idx = name.charCodeAt(0) % avatarPalette.length || 0;
    return avatarPalette[idx];
};

const formatDate = (dateInput) =>
    new Date(dateInput).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const roleBadgeStyles = {
    seeker: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
    recruiter: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
    admin: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

const RoleBadge = ({ role }) => (
    <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleBadgeStyles[role] || roleBadgeStyles.seeker
            }`}
    >
        {role}
    </span>
);

const StatusBadge = ({ status }) => {
    const isActive = status === 'active';
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${isActive
                    ? 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:bg-emerald-500/10'
                    : 'border-red-300 text-red-600 bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:bg-red-500/10'
                }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {status}
        </span>
    );
};

const StatCard = ({ label, value, note, noteClassName }) => (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">{value}</p>
        {note && <p className={`text-xs mt-1 ${noteClassName || 'text-neutral-400 dark:text-neutral-500'}`}>{note}</p>}
    </div>
);

// Role-change actions require confirmation before hitting the API.
const ROLE_CHANGE_ACTIONS = ['makeRecruiter', 'makeSeeker', 'makeAdmin'];

const roleForAction = (action) =>
    action === 'makeRecruiter' ? 'recruiter' : action === 'makeAdmin' ? 'admin' : 'seeker';

const confirmCopy = {
    makeRecruiter: {
        title: 'Make this user a Recruiter?',
        body: (user) => `${user.name} will gain recruiter permissions, including posting jobs and managing applicants.`,
        confirmLabel: 'Make Recruiter',
        confirmClass: 'bg-primary text-white',
    },
    makeSeeker: {
        title: 'Move this user back to Seeker?',
        body: (user) => `${user.name} will lose recruiter permissions and be switched back to a regular job seeker account.`,
        confirmLabel: 'Make Seeker',
        confirmClass: 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
    },
    makeAdmin: {
        title: 'Grant admin access?',
        body: (user) => `${user.name} will get full admin privileges, including managing users, companies, and platform settings.`,
        confirmLabel: 'Make Admin',
        confirmClass: 'bg-blue-600 text-white',
    },
};

const UsersTable = ({ users, totalCount }) => {
    const [roleFilter, setRoleFilter] = useState('all');
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pendingId, setPendingId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null); // { user, action }
    const confirmModal = useOverlayState({ defaultOpen: false });

    const filteredUsers = useMemo(
        () => (roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter)),
        [users, roleFilter]
    );

    const total = filteredUsers.length;
    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageUsers = filteredUsers.slice(pageStart, pageStart + PAGE_SIZE);

    const stats = useMemo(() => {
        const activeCount = users.filter((u) => u.userStatus === 'active').length;
        const recruiterCount = users.filter((u) => u.role === 'recruiter').length;
        const suspendedCount = users.filter((u) => u.userStatus === 'suspended').length;
        const last24h = users.filter(
            (u) => Date.now() - new Date(u.createdAt).getTime() < 24 * 60 * 60 * 1000
        ).length;
        return { activeCount, recruiterCount, suspendedCount, last24h };
    }, [users]);

    const router = useRouter();

    const runAction = async (user, action) => {
        setPendingId(user.id);
        try {
            const role = roleForAction(action);
            const data = await updateUserRole(user.id, role);
            if (data) {
                router.refresh();
                toast.success('User updated');
            }

            // if (action === 'delete') {
            //     await deleteUser(user.id);
            //     toast.success('User deleted');
            //     return;
            // }
        } catch (err) {
            console.error(err);
            toast.danger(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setPendingId(null);
        }
    };

    // Role-change buttons go through this first — opens the confirmation modal.
    const requestAction = (user, action) => {
        if (ROLE_CHANGE_ACTIONS.includes(action)) {
            setPendingAction({ user, action });
            confirmModal.open();
            return;
        }
        runAction(user, action);
    };

    const handleConfirm = async () => {
        if (!pendingAction) return;
        await runAction(pendingAction.user, pendingAction.action);
        confirmModal.close();
        setPendingAction(null);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            User Management
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Review, filter, and manage platform access for all users.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setRoleMenuOpen((o) => !o)}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                            >
                                {roleFilter === 'all' ? 'All Roles' : roleFilter[0].toUpperCase() + roleFilter.slice(1)}
                                <FiChevronDown size={14} />
                            </button>
                            {roleMenuOpen && (
                                <div className="absolute right-0 mt-1 w-36 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-10">
                                    {ROLE_FILTERS.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => {
                                                setRoleFilter(r);
                                                setPage(1);
                                                setRoleMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3.5 py-2 text-sm capitalize text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                        >
                                            {r === 'all' ? 'All Roles' : r}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button className="font-medium bg-primary text-white">
                            <FiDownload size={15} />
                            Export List
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total Active Users" value={stats.activeCount.toLocaleString()} note={`${stats.activeCount} currently active`} noteClassName="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Recruiter Growth" value={stats.recruiterCount.toLocaleString()} note="High demand" noteClassName="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Suspended Accounts" value={stats.suspendedCount.toLocaleString()} note={users.length ? `${((stats.suspendedCount / users.length) * 100).toFixed(1)}% of total` : undefined} />
                    <StatCard label="New Signups (24h)" value={stats.last24h.toLocaleString()} note="Steady activity" noteClassName="text-amber-500 dark:text-amber-400" />
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Platform users">
                                <Table.Header>
                                    <Table.Column isRowHeader>User Name</Table.Column>
                                    <Table.Column>Email Address</Table.Column>
                                    <Table.Column>Role</Table.Column>
                                    <Table.Column>Join Date</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Actions</Table.Column>
                                </Table.Header>
                                <Table.Body
                                    renderEmptyState={() => (
                                        <div className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                            No users found.
                                        </div>
                                    )}
                                >
                                    {pageUsers.map((user) => {
                                        const isSuspended = user.userStatus === 'suspended';
                                        const isPending = pendingId === user.id;

                                        return (
                                            <Table.Row key={user.id}>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-3">
                                                        {user.avatarUrl ? (
                                                            <img
                                                                src={user.avatarUrl}
                                                                alt={user.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${paletteFor(
                                                                    user.name
                                                                )}`}
                                                            >
                                                                {getInitials(user.name)}
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-neutral-900 dark:text-white">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className="text-neutral-500 dark:text-neutral-400">
                                                        {user.email}
                                                    </span>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <RoleBadge role={user.role} />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className="text-neutral-500 dark:text-neutral-400">
                                                        {formatDate(user.createdAt)}
                                                    </span>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <StatusBadge status={user.userStatus} />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-3 text-sm font-medium">
                                                        {isSuspended ? (
                                                            <>
                                                                <button
                                                                    disabled={isPending}
                                                                    onClick={() => runAction(user, 'activate')}
                                                                    className="text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
                                                                >
                                                                    Activate
                                                                </button>
                                                                <button
                                                                    disabled={isPending}
                                                                    onClick={() => runAction(user, 'delete')}
                                                                    className="text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {user.role !== 'admin' && (
                                                                    <>
                                                                        <button
                                                                            disabled={isPending}
                                                                            onClick={() =>
                                                                                requestAction(
                                                                                    user,
                                                                                    user.role === 'recruiter' ? 'makeSeeker' : 'makeRecruiter'
                                                                                )
                                                                            }
                                                                            className="text-neutral-600 dark:text-neutral-300 hover:underline disabled:opacity-50"
                                                                        >
                                                                            {user.role === 'recruiter' ? 'Make Seeker' : 'Make Recruiter'}
                                                                        </button>
                                                                        <button
                                                                            disabled={isPending}
                                                                            onClick={() => requestAction(user, 'makeAdmin')}
                                                                            className="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                                                                        >
                                                                            Make Admin
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button
                                                                    disabled={isPending}
                                                                    onClick={() => runAction(user, 'suspend')}
                                                                    className="text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                                                                >
                                                                    Suspend
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>

                        <Table.Footer className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                {total === 0
                                    ? 'No users'
                                    : `Showing ${pageStart + 1} to ${Math.min(pageStart + PAGE_SIZE, total)} of ${(totalCount ?? total).toLocaleString()} users`}
                            </span>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
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

            {/* Role-change confirmation modal */}
            <Modal state={confirmModal}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="max-w-sm">
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Icon className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <FiAlertTriangle size={18} />
                                </Modal.Icon>
                                <Modal.Heading>
                                    {pendingAction ? confirmCopy[pendingAction.action]?.title : 'Confirm change'}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                    {pendingAction ? confirmCopy[pendingAction.action]?.body(pendingAction.user) : ''}
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="gap-2">
                                <Button
                                    className="font-medium bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                                    disabled={pendingId === pendingAction?.user?.id}
                                    onClick={() => {
                                        confirmModal.close();
                                        setPendingAction(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={`font-medium disabled:opacity-60 ${pendingAction ? confirmCopy[pendingAction.action]?.confirmClass : 'bg-primary text-white'
                                        }`}
                                    disabled={pendingId === pendingAction?.user?.id}
                                    onClick={handleConfirm}
                                >
                                    {pendingAction ? confirmCopy[pendingAction.action]?.confirmLabel : 'Confirm'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
};

export default UsersTable;
'use client';

import React, { useMemo, useState } from 'react';
import { Table, Button, Modal, useOverlayState, toast } from '@heroui/react';
import { FiChevronUp, FiChevronDown, FiAlertTriangle } from 'react-icons/fi';
import { updateUserRole } from '@/lib/actions/users';
import { useRouter } from 'next/navigation';

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

// Columns that support sorting, and how to read a comparable value off a user row.
const SORT_ACCESSORS = {
    name: (u) => u.name?.toLowerCase() ?? '',
    email: (u) => u.email?.toLowerCase() ?? '',
    role: (u) => u.role ?? '',
    createdAt: (u) => new Date(u.createdAt).getTime(),
    userStatus: (u) => u.userStatus ?? '',
};

const SortIcon = ({ active, direction }) => {
    if (!active) return <FiChevronDown size={13} className="opacity-30" />;
    return direction === 'asc' ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />;
};

const SortableColumn = ({ label, sortKey, activeSort, onSort, isRowHeader }) => (
    <Table.Column isRowHeader={isRowHeader}>
        <button
            type="button"
            onClick={() => onSort(sortKey)}
            className="flex items-center gap-1 font-medium"
        >
            {label}
            <SortIcon active={activeSort.key === sortKey} direction={activeSort.direction} />
        </button>
    </Table.Column>
);

const UsersTable2 = ({ users }) => {
    const [pendingId, setPendingId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null); // { user, action }
    const [sort, setSort] = useState({ key: 'createdAt', direction: 'desc' });
    const confirmModal = useOverlayState({ defaultOpen: false });
    const router = useRouter();

    const handleSort = (key) => {
        setSort((prev) => {
            if (prev.key !== key) return { key, direction: 'asc' };
            return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        });
    };

    const sortedUsers = useMemo(() => {
        const accessor = SORT_ACCESSORS[sort.key];
        if (!accessor) return users;
        const list = [...users].sort((a, b) => {
            const av = accessor(a);
            const bv = accessor(b);
            if (av < bv) return -1;
            if (av > bv) return 1;
            return 0;
        });
        if (sort.direction === 'desc') list.reverse();
        return list;
    }, [users, sort]);

    const runAction = async (user, action) => {
        setPendingId(user.id);
        try {
            const role = roleForAction(action);
            const data = await updateUserRole(user.id, role);
            if (data) {
                router.refresh();
                toast.success('User updated');
            }
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
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <Table variant="secondary">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Platform users">
                        <Table.Header>
                            <SortableColumn label="User Name" sortKey="name" activeSort={sort} onSort={handleSort} isRowHeader />
                            <SortableColumn label="Email Address" sortKey="email" activeSort={sort} onSort={handleSort} />
                            <SortableColumn label="Role" sortKey="role" activeSort={sort} onSort={handleSort} />
                            <SortableColumn label="Join Date" sortKey="createdAt" activeSort={sort} onSort={handleSort} />
                            <SortableColumn label="Status" sortKey="userStatus" activeSort={sort} onSort={handleSort} />
                            <Table.Column>Actions</Table.Column>
                        </Table.Header>
                        <Table.Body
                            renderEmptyState={() => (
                                <div className="py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
                                    No users found.
                                </div>
                            )}
                        >
                            {sortedUsers.map((user) => {
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
            </Table>

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

export default UsersTable2;
'use client';

import { Pagination } from '@heroui/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const PaginationForJobs = ({ totalItems, itemsPerPage = 12 }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('page')) || 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const updatePage = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newPage > 1) {
            params.set('page', newPage);
        } else {
            params.delete('page');
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const getPageNumbers = () => {
        const pages = [1];
        if (page > 5) pages.push('ellipsis');

        const start = Math.max(2, page - 2);
        const end = Math.min(totalPages - 1, page + 2);
        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 2) pages.push('ellipsis');
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    if (totalItems === 0) return null;

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);

    return (
        <Pagination className="w-full">
            <Pagination.Summary>
                Showing {startItem}-{endItem} of {totalItems} results
            </Pagination.Summary>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous
                        isDisabled={page === 1}
                        onPress={() => updatePage(page - 1)}
                    >
                        <Pagination.PreviousIcon />
                        <span>Previous</span>
                    </Pagination.Previous>
                </Pagination.Item>

                {getPageNumbers().map((p, i) =>
                    p === 'ellipsis' ? (
                        <Pagination.Item key={`ellipsis-${i}`}>
                            <Pagination.Ellipsis />
                        </Pagination.Item>
                    ) : (
                        <Pagination.Item key={p}>
                            <Pagination.Link
                                isActive={p === page}
                                onPress={() => updatePage(p)}
                            >
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ),
                )}

                <Pagination.Item>
                    <Pagination.Next
                        isDisabled={page === totalPages}
                        onPress={() => updatePage(page + 1)}
                    >
                        <span>Next</span>
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
};

export default PaginationForJobs;
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Select, Label, ListBox } from "@heroui/react";
import { FiSearch, FiX } from "react-icons/fi";

// TODO: ideally fetch these distinct values from your DB (e.g. a /api/jobs/meta endpoint)
const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Temporary"];
const CATEGORIES = [
    "Human Resources",
    "Customer Support",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "Design",
    "Operations",
];

const JobFilters = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const debounceRef = useRef(null);
    const isFirstRender = useRef(true);

    const updateParam = useCallback(
        (key, value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    // debounce the search input so we don't refetch on every keystroke
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            updateParam("search", search);
        }, 500);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const clearAll = () => {
        setSearch("");
        router.push(pathname);
    };

    const hasActiveFilters =
        searchParams.get("jobType") || searchParams.get("category") || searchParams.get("search");

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-3 md:items-end">
                {/* Search */}
                <div className="flex-1">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1 block">
                        Search
                    </label>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by job title..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Job Type */}
                <div className="w-full md:w-48">
                    <Select
                        className="w-full"
                        value={searchParams.get("jobType") || "all"}
                        onChange={(key) => updateParam("jobType", key)}
                    >
                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Job Type
                        </Label>
                        <Select.Trigger className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="all" textValue="All Job Types">
                                    All Job Types
                                </ListBox.Item>
                                {JOB_TYPES.map((type) => (
                                    <ListBox.Item key={type} id={type} textValue={type}>
                                        {type}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Category */}
                <div className="w-full md:w-48">
                    <Select
                        className="w-full"
                        value={searchParams.get("category") || "all"}
                        onChange={(key) => updateParam("category", key)}
                    >
                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Category
                        </Label>
                        <Select.Trigger className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="all" textValue="All Categories">
                                    All Categories
                                </ListBox.Item>
                                {CATEGORIES.map((cat) => (
                                    <ListBox.Item key={cat} id={cat} textValue={cat}>
                                        {cat}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary px-3 py-2 shrink-0"
                    >
                        <FiX /> Clear
                    </button>
                )}
            </div>
        </div>        
    );
};

export default JobFilters;
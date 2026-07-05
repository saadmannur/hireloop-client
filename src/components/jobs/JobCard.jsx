"use client";

import Link from "next/link";
import { Card } from "@heroui/react";
import { FiMapPin, FiBriefcase, FiCalendar, FiGlobe } from "react-icons/fi";

const JobCard = ({ job }) => {
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
        companyName,
        companyImage,
    } = job;

    const location = isRemote
        ? "Remote"
        : [city, country].filter(Boolean).join(", ");

    const formattedDeadline = applicationDeadline
        ? new Date(applicationDeadline).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : null;

    return (
        <Card className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
            <Card.Header className="flex flex-row items-start gap-3 px-5 pt-5 pb-2">
                {companyImage ? (
                    <img
                        src={companyImage}
                        alt={companyName}
                        className="w-12 h-12 shrink-0 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                    />
                ) : (
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-semibold border border-neutral-200 dark:border-neutral-700">
                        {companyName?.charAt(0) || "?"}
                    </div>
                )}

                <div className="flex flex-col items-start gap-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {category}
                    </span>
                    <Card.Title className="text-lg font-bold text-neutral-900 dark:text-neutral-50 line-clamp-2">
                        {title}
                    </Card.Title>
                    <Card.Description className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                        {companyName}
                    </Card.Description>
                </div>
            </Card.Header>

            <Card.Content className="px-5 py-3 flex flex-col gap-2.5 text-sm text-neutral-600 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                    <FiBriefcase className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <span>{jobType}</span>
                </div>

                <div className="flex items-center gap-2">
                    {isRemote ? (
                        <FiGlobe className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                    ) : (
                        <FiMapPin className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                    )}
                    <span>{location}</span>
                </div>

                <div className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-100">
                    <span>
                        {salaryMin} - {salaryMax} {currency}
                    </span>
                </div>

                {formattedDeadline && (
                    <div className="flex items-center gap-2">
                        <FiCalendar className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                        <span>Apply by {formattedDeadline}</span>
                    </div>
                )}
            </Card.Content>

            <Card.Footer className="px-5 pb-5 pt-2">
                <Link
                    href={`/jobs/${_id}`}
                    className="inline-flex items-center justify-center w-full rounded-lg bg-primary text-black dark:text-white font-medium py-2 px-4 text-sm hover:bg-primary/90 transition-colors"
                >
                    View Details
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default JobCard;
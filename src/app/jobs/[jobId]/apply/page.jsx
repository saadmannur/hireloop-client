import { getUserSession } from '@/lib/core/session';
import { getJobById } from '@/lib/api/jobs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { FiArrowRight, FiBriefcase, FiLock } from 'react-icons/fi';
import ApplyForm from '@/components/jobs/ApplyForm';
import { getApplicationByApplicantId } from '@/lib/api/applications';
import { div } from 'motion/react-client';
import { Button } from '@heroui/react';
import { getPlanById } from '@/lib/api/plans';

const ApplyPage = async ({ params }) => {
    const { jobId } = await params;

    const user = await getUserSession();
    // console.log(user);

    if (!user) {
        redirect(`/login?redirect=/jobs/${jobId}/apply`);
    }

    const job = await getJobById(jobId);

    // recruiters post jobs, they don't apply to them
    if (user.role === 'recruiter') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
                <div className="max-w-md w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <FiBriefcase size={20} />
                    </div>
                    <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Recruiters can not apply to jobs
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        You are signed in as a recruiter. Switch to a candidate account to submit
                        an application for{' '}
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {job?.title}
                        </span>
                        .
                    </p>
                    <Link
                        href={`/jobs/${jobId}`}
                        className="inline-block mt-2 text-sm font-medium text-primary hover:underline"
                    >
                        Back to job details
                    </Link>
                </div>
            </div>
        );
    }

    const applications = await getApplicationByApplicantId(user?.id)
    // console.log(applications);
    const plan = await getPlanById(user?.plan || 'seeker_free')
    console.log(plan , "plan response")

    const used = applications.length;
    const limit = plan.maxApplicationPerMonth;
    const remaining = Math.max(limit - used, 0);
    const usagePercent = Math.min((used / limit) * 100, 100);
    const isLimitReached = used >= limit;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                                {plan.name} Plan
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-0.5">
                                {used} of {limit} applications used this month
                            </p>
                        </div>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isLimitReached
                                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                }`}
                        >
                            {remaining} left
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${isLimitReached ? 'bg-red-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${usagePercent}%` }}
                        />
                    </div>
                </div>
                {
                    !isLimitReached ?
                        <div className="max-w-2xl mx-auto">
                            <div className="mb-6">
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Applying for
                                </p>
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {job?.title}{' '}
                                    <span className="font-normal text-neutral-400 dark:text-neutral-500">
                                        @ {job?.companyName}
                                    </span>
                                </h1>
                            </div>

                            <ApplyForm job={job} user={user} />
                        </div> :
                        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-500/20 shadow-sm p-8 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <FiLock size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                You have reached your monthly limit
                            </h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                                Upgrade your plan to apply for more jobs and unlock additional
                                benefits.
                            </p>
                            <Link href="/pricing" className="inline-block pt-2">
                                <Button color="primary" className="font-medium">
                                    View Plans
                                    <FiArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                }
            </div>
        </div>
    );
};

export default ApplyPage;
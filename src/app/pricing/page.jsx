'use client';

import React, { useState } from 'react';
import { FiCheck, FiUser, FiBriefcase, FiZap, FiStar, FiAward } from 'react-icons/fi';
import { Button } from '@heroui/react';

const seekerPlans = [
    {
        name: 'Free',
        id: 'seeker_free',
        icon: FiZap,
        price: '$0',
        cadence: 'forever',
        description: 'Get started and see what fits.',
        features: [
            'Browse & save up to 10 jobs',
            'Apply to up to 3 jobs per month',
            'Basic profile',
            'Email alerts',
        ],
        cta: 'Current plan',
        highlighted: false,
    },
    {
        name: 'Pro',
        id: 'seeker_pro',
        icon: FiStar,
        price: '$19',
        cadence: 'per month',
        description: 'For a focused, active job search.',
        features: [
            'Apply to up to 30 jobs per month',
            'Unlimited saved jobs',
            'Application tracking',
            'Salary insights',
        ],
        cta: 'Upgrade to Pro',
        highlighted: true,
    },
    {
        name: 'Premium',
        id: 'seeker_premium',
        icon: FiAward,
        price: '$39',
        cadence: 'per month',
        description: 'Every advantage, no limits.',
        features: [
            'Everything in Pro',
            'Unlimited applications',
            'Profile boost to recruiters',
            'Early access to new jobs',
            'Priority support',
        ],
        cta: 'Upgrade to Premium',
        highlighted: false,
    },
];

const recruiterPlans = [
    {
        name: 'Free',
        id: 'recruiter_free',
        icon: FiZap,
        price: '$0',
        cadence: 'forever',
        description: "Your company's first year of hiring.",
        features: [
            'Up to 3 active job posts',
            'Basic applicant management',
            'Standard listing visibility',
        ],
        cta: 'Current plan',
        highlighted: false,
    },
    {
        name: 'Growth',
        id: 'recruiter_growth',
        icon: FiStar,
        price: '$49',
        cadence: 'per month',
        description: 'For teams hiring consistently.',
        features: [
            'Up to 10 active job posts',
            'Applicant tracking',
            'Basic analytics',
            'Email support',
        ],
        cta: 'Upgrade to Growth',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        id: 'recruiter_enterprise',
        icon: FiAward,
        price: '$149',
        cadence: 'per month',
        description: 'High-volume hiring, fully equipped.',
        features: [
            'Up to 50 active job posts',
            'Advanced analytics dashboard',
            'Featured job listings',
            'Team collaboration',
            'Custom branding',
            'Priority support',
        ],
        cta: 'Upgrade to Enterprise',
        highlighted: false,
    },
];

const PlanCard = ({ plan }) => {
    const Icon = plan.icon;

    return (
        <div
            className={`relative flex flex-col rounded-2xl p-7 transition-transform duration-200 ${plan.highlighted
                ? 'bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 shadow-xl shadow-neutral-900/10 dark:shadow-black/40 sm:-translate-y-2'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm'
                }`}
        >
            {plan.highlighted && (
                <span className="absolute -top-3 left-25 text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-primary  border bg-black text-white border-violet-800 ">
                    Most popular
                </span>
            )}

            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${plan.highlighted
                    ? 'bg-white/10 text-primary'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
            >
                <Icon size={17} />
            </div>

            <h3
                className={`text-base font-semibold ${plan.highlighted ? 'text-white' : 'text-neutral-900 dark:text-white'
                    }`}
            >
                {plan.name}
            </h3>
            <p
                className={`text-sm mt-1 min-h-[2.5rem] ${plan.highlighted
                    ? 'text-neutral-400'
                    : 'text-neutral-500 dark:text-neutral-400'
                    }`}
            >
                {plan.description}
            </p>

            <div className="mt-2 flex items-baseline gap-1.5">
                <span
                    className={`text-3xl font-bold tracking-tight ${plan.highlighted ? 'text-white' : 'text-neutral-900 dark:text-white'
                        }`}
                >
                    {plan.price}
                </span>
                <span
                    className={`text-sm ${plan.highlighted
                        ? 'text-neutral-400'
                        : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                >
                    / {plan.cadence}
                </span>
            </div>

            <div
                className={`h-px w-full my-6 ${plan.highlighted ? 'bg-white/10' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
            />

            <ul className="space-y-3 flex-1">
                {
                    plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                            <span
                                className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlighted
                                    ? 'bg-emerald-400/15 text-emerald-400'
                                    : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    }`}
                            >
                                <FiCheck size={11} strokeWidth={3} />
                            </span>
                            <span
                                className={
                                    plan.highlighted
                                        ? 'text-neutral-200'
                                        : 'text-neutral-700 dark:text-neutral-300'
                                }
                            >
                                {feature}
                            </span>
                        </li>
                    ))
                }
            </ul>

            <form action="/api/checkout_sessions" method="POST">
                <input type="hidden" name="plan_id" value={plan.id} />
                <section>
                    <Button type="submit" role="link" className={`mt-7 font-medium ${plan.highlighted
                        ? 'bg-primary text-white'
                        : 'bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white'
                        }`}>
                        {plan.cta}
                    </Button>
                </section>
            </form>
        </div>
    );
};

const PricingPage = () => {
    const [audience, setAudience] = useState('seekers');
    const plans = audience === 'seekers' ? seekerPlans : recruiterPlans;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-16 sm:py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary mb-3">
                        Pricing
                    </span>
                    <h1 className="text-3xl sm:text-[2.5rem] font-bold tracking-tight text-neutral-900 dark:text-white">
                        Plans built around how you hire and get hired
                    </h1>
                    <p className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                        Start for free. Upgrade the moment you need more reach.
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="relative inline-flex p-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white dark:bg-neutral-800 shadow-sm transition-transform duration-300 ease-out ${audience === 'recruiters' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                                }`}
                        />
                        <button
                            onClick={() => setAudience('seekers')}
                            className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${audience === 'seekers'
                                ? 'text-neutral-900 dark:text-white'
                                : 'text-neutral-500 dark:text-neutral-400'
                                }`}
                        >
                            <FiUser size={15} />
                            Job Seekers
                        </button>
                        <button
                            onClick={() => setAudience('recruiters')}
                            className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${audience === 'recruiters'
                                ? 'text-neutral-900 dark:text-white'
                                : 'text-neutral-500 dark:text-neutral-400'
                                }`}
                        >
                            <FiBriefcase size={15} />
                            Recruiters
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
                </div>

                <p className="text-center text-sm text-neutral-400 dark:text-neutral-500 mt-10">
                    All plans include cancel-anytime billing. Need something custom?{' '}
                    <a href="/contact" className="text-primary font-medium hover:underline">
                        Talk to us
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default PricingPage;
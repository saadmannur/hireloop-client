// components/PricingSection.jsx
"use client";

import { useState } from "react";
import { FiArrowRight, FiPlus, FiZap } from "react-icons/fi";
import { PiCrownSimpleFill, PiChartBarFill } from "react-icons/pi";
import Reveal from "../motionAnimation/Reveal";

const plans = [
    {
        icon: PiCrownSimpleFill,
        name: "Starter",
        monthlyPrice: 0,
        description: "Start building your insights hub:",
        features: [
            "Daily AI match brief (top 5)",
            "Verified salary bands",
            "Company insight dashboards",
            "1-click apply, unlimited",
        ],
        highlighted: false,
    },
    {
        icon: PiChartBarFill,
        name: "Growth",
        monthlyPrice: 17,
        description: "Start building your insights hub:",
        features: [
            "Daily AI match brief (top 5)",
            "Verified salary bands",
            "Company insight dashboards",
            "1-click apply, unlimited",
        ],
        highlighted: true,
    },
    {
        icon: FiZap,
        name: "Premium",
        monthlyPrice: 99,
        description: "Start building your insights hub:",
        features: [
            "Everything in Pro",
            "Multi-profile career portfolios",
            "Shared talent rooms",
            "Recruiter view (read-only)",
        ],
        highlighted: false,
    },
];

const YEARLY_DISCOUNT = 0.25;

const PricingSection = () => {

    const [billingCycle, setBillingCycle] = useState("monthly");
    const isYearly = billingCycle === "yearly";

    const getPrice = (monthlyPrice) => {
        if (monthlyPrice === 0) return 0;
        if (!isYearly) return monthlyPrice;
        return Math.round(monthlyPrice * (1 - YEARLY_DISCOUNT));
    };

    return (
        <section className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Eyebrow badge */}
                <div className="flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-[2px] bg-violet-500" />
                    <span className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        PRICING
                    </span>
                    <span className="h-2 w-2 rounded-[2px] bg-violet-500" />
                </div>

                {/* Heading */}
                
                <Reveal direction="up" duration={0.6}>
                    <h2 className="mx-auto mt-4 max-w-xl text-center text-4xl font-semibold tracking-tight sm:text-5xl">
                        Pay for the leverage, not the listings
                    </h2>
                </Reveal>

                {/* Billing toggle */}
                <div className="mt-8 flex justify-center">
                    <div className="relative inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                        <button
                            type="button"
                            onClick={() => setBillingCycle("monthly")}
                            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition ${billingCycle === "monthly"
                                ? "bg-white text-black shadow dark:bg-neutral-100"
                                : "text-neutral-500 dark:text-neutral-400"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setBillingCycle("yearly")}
                            className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${billingCycle === "yearly"
                                ? "bg-white text-black shadow dark:bg-neutral-100"
                                : "text-neutral-500 dark:text-neutral-400"
                                }`}
                        >
                            Yearly
                            <span className="rounded-full bg-fuchsia-500 px-2 py-0.5 text-xs font-semibold text-white">
                                25%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Plan cards */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plans.map(({ icon: Icon, name, monthlyPrice, description, features, highlighted }) => {
                        const price = getPrice(monthlyPrice);
                        return (
                            <div
                                key={name}
                                className={`flex flex-col rounded-2xl border p-6 ${highlighted
                                    ? "border-violet-500 bg-neutral-950 text-white shadow-lg shadow-violet-500/10 dark:border-violet-500"
                                    : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${highlighted
                                                ? "bg-violet-500/20 text-violet-400"
                                                : "bg-violet-500/10 text-violet-500"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span
                                            className={`text-base font-medium ${highlighted ? "text-white" : "text-foreground"
                                                }`}
                                        >
                                            {name}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className={`text-2xl font-semibold ${highlighted ? "text-white" : "text-foreground"
                                                }`}
                                        >
                                            ${price}
                                        </span>
                                        <span
                                            className={`text-xs ${highlighted ? "text-neutral-400" : "text-neutral-500 dark:text-neutral-400"
                                                }`}
                                        >
                                            /month
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p
                                    className={`mt-6 text-sm font-medium ${highlighted ? "text-white" : "text-foreground"
                                        }`}
                                >
                                    {description}
                                </p>

                                {/* Features */}
                                <ul className="mt-4 flex flex-1 flex-col gap-3">
                                    {features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <span
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${highlighted
                                                    ? "bg-white/10 text-neutral-300"
                                                    : "bg-neutral-200/60 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                                                    }`}
                                            >
                                                <FiPlus className="h-3.5 w-3.5" />
                                            </span>
                                            <span
                                                className={`text-sm ${highlighted ? "text-neutral-200" : "text-neutral-600 dark:text-neutral-300"
                                                    }`}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <button
                                    type="button"
                                    className={`mt-8 flex w-full items-center justify-between rounded-xl px-5 py-3 text-sm font-medium transition ${highlighted
                                        ? "bg-white text-black hover:bg-neutral-200"
                                        : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-white"
                                        }`}
                                >
                                    Choose this plan
                                    <FiArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
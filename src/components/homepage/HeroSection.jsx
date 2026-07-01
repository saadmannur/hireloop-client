'use client';

import { Button, Input } from '@heroui/react';
import {
    HiOutlineBriefcase,
    HiOutlineMapPin,
    HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import Reveal from '../motionAnimation/Reveal';
import { RevealGroup, RevealItem } from '../motionAnimation/RevealGroup';

const trendingJobs = [
    'Product Designer',
    'AI Engineering',
    'DevOps Engineer',
];

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="h-full w-full bg-white dark:bg-[#050505] transition-colors duration-300" />

                {/* Glow (Dark Mode) */}
                <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-violet-700/20 blur-[140px]" />

                {/* Glow (Light Mode) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-violet-500/10 blur-[140px] dark:hidden" />
            </div>

            <div className="max-w-7xl mx-auto px-5 pt-36 pb-28">

                {/* Badge */}

                <div className="flex justify-center">

                    <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] px-5 py-2 shadow-lg">

                        <span className="text-lg">💼</span>

                        <span className="font-semibold text-gray-900 dark:text-white">
                            50,000+
                        </span>

                        <span className="text-gray-500 uppercase tracking-widest text-sm">
                            New Jobs This Month
                        </span>

                    </div>

                </div>

                {/* Heading */}

                <div className="mt-10 text-center">

                    <Reveal direction="up" duration={0.6}>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">

                            Find Your Dream Job
                            <br />
                            Today

                        </h1>
                    </Reveal>

                    <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-400 leading-8">

                        HireLoop connects top talent with world-class companies.
                        Browse thousands of curated opportunities and land your next
                        role faster.

                    </p>

                </div>

                {/* Search */}

                <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] p-3 shadow-xl">

                    <div className="grid lg:grid-cols-[1fr_1px_1fr_auto] items-center gap-3">

                        <Input
                            variant="bordered"
                            placeholder="Job title, skill or company"

                            classNames={{
                                inputWrapper:
                                    'border-none shadow-none bg-transparent',
                            }}
                        />

                        <div className="hidden lg:block h-8 w-px bg-gray-300 dark:bg-white/10" />

                        <Input
                            variant="bordered"
                            placeholder="Location or Remote"

                            classNames={{
                                inputWrapper:
                                    'border-none shadow-none bg-transparent',
                            }}
                        />

                        <Button
                            isIconOnly
                            color="secondary"
                            className="h-14 w-14"
                        >
                            <HiOutlineMagnifyingGlass size={24} />
                        </Button>

                    </div>

                </div>

                {/* Trending */}

                <RevealGroup className="mt-8 flex flex-wrap justify-center items-center gap-3" staggerDelay={0.08}>

                    <span className="text-gray-500">
                        Trending Position
                    </span>

                    {trendingJobs.map((job) => (
                        <RevealItem
                            direction="up"
                            key={job}
                            className="
                rounded-full
                border
                border-gray-200
                dark:border-white/10
                bg-gray-100
                dark:bg-[#151515]
                px-4
                py-2
                text-sm
                text-gray-700
                dark:text-gray-300
                hover:border-violet-500
                hover:text-violet-500
                transition
              "
                        >
                            {job}
                        </RevealItem>
                    ))}

                </RevealGroup>

            </div>
        </section>
    );
};

export default HeroSection;
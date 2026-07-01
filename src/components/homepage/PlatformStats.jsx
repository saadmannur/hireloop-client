'use client';

import Image from 'next/image';
import {
    HiOutlineBriefcase,
    HiOutlineBuildingOffice2,
    HiOutlineUsers,
    HiOutlineStar,
} from 'react-icons/hi2';
import Globe from '@/assets/images/globe.png'

const stats = [
    {
        id: 1,
        icon: HiOutlineBriefcase,
        value: '50K',
        label: 'Active Jobs',
    },
    {
        id: 2,
        icon: HiOutlineBuildingOffice2,
        value: '12K',
        label: 'Companies',
    },
    {
        id: 3,
        icon: HiOutlineUsers,
        value: '2M',
        label: 'Job Seekers',
    },
    {
        id: 4,
        icon: HiOutlineStar,
        value: '97%',
        label: 'Satisfaction Rate',
    },
];

const PlatformStats = () => {
    return (
        <div className='container mx-auto'>
            <section className="relative overflow-hidden py-28 transition-colors duration-300 bg-gray-50 dark:bg-[#050505]">

                {/* Background Image শুধু Dark Mode এ */}
                <div className="hidden dark:block absolute inset-0 bottom-40">

                    <Image
                        src={Globe}
                        alt="background"
                        fill
                        priority
                        className="object-cover object-center opacity-90"
                    />

                    <div className="absolute inset-0 bg-black/35" />

                </div>

                {/* Light Mode Background */}
                <div className="absolute inset-0 dark:hidden bg-gradient-to-b from-violet-50 via-white to-white" />

                <div className="relative max-w-7xl mx-auto px-5">

                    {/* Heading */}

                    <div className="text-center max-w-3xl mx-auto mb-16">

                        <h2 className="text-2xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Assisting over
                            <span className="text-violet-600 dark:text-violet-400">
                                {' '}
                                15,000{' '}
                            </span>
                            job seekers
                            <br />
                            find their dream positions.
                        </h2>

                    </div>

                    {/* Cards */}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                        {stats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="
                  rounded-2xl
                  p-7
                  border
                  border-gray-200
                  dark:border-white/10
                  bg-white/80
                  dark:bg-black/40
                  backdrop-blur-xl
                  shadow-lg
                  dark:shadow-none
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-violet-500
                "
                                >
                                    <Icon
                                        size={24}
                                        className="text-violet-600 dark:text-violet-400"
                                    />

                                    <h3 className="mt-12 text-5xl font-bold text-gray-900 dark:text-white">
                                        {item.value}
                                    </h3>

                                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                                        {item.label}
                                    </p>
                                </div>
                            );
                        })}

                    </div>

                </div>
            </section>
        </div>
    );
};

export default PlatformStats;
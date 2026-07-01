'use client';

import Link from 'next/link';
import {
    FaFacebookF,
    FaLinkedinIn,
    FaGithub,
    FaXTwitter,
} from 'react-icons/fa6';

const footerLinks = {
    Product: [
        { name: 'Browse Jobs', href: '/jobs' },
        { name: 'Companies', href: '/companies' },
        { name: 'Post a Job', href: '/post-job' },
        { name: 'Pricing', href: '/pricing' },
    ],

    Navigation: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Career Blog', href: '/blog' },
        { name: 'FAQ', href: '/faq' },
    ],

    Resources: [
        { name: 'Help Center', href: '/help' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms' },
    ],
};

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-white/10 transition-colors duration-300">

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid lg:grid-cols-4 gap-12">

                    {/* Logo */}

                    <div>

                        <Link href="/">
                            <h2 className="text-4xl font-extrabold">
                                <span className="text-blue-500">hire</span>
                                <span className="text-orange-500">loop</span>
                            </h2>
                        </Link>

                        <p className="mt-6 text-gray-600 dark:text-gray-400 leading-8">
                            The AI-native career platform built for professionals,
                            recruiters and companies to hire smarter.
                        </p>

                        <div className="flex gap-3 mt-8">

                            <a
                                href="#"
                                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-violet-600 hover:text-white transition flex items-center justify-center text-gray-700 dark:text-gray-300"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-violet-600 hover:text-white transition flex items-center justify-center text-gray-700 dark:text-gray-300"
                            >
                                <FaLinkedinIn />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-violet-600 hover:text-white transition flex items-center justify-center text-gray-700 dark:text-gray-300"
                            >
                                <FaGithub />
                            </a>

                            <a
                                href="#"
                                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-violet-600 hover:text-white transition flex items-center justify-center text-gray-700 dark:text-gray-300"
                            >
                                <FaXTwitter />
                            </a>

                        </div>

                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (

                        <div key={title}>

                            <h3 className="text-lg font-semibold text-violet-600 dark:text-violet-400 mb-6">
                                {title}
                            </h3>

                            <div className="space-y-4">

                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                            </div>

                        </div>

                    ))}

                </div>

                <div className="border-t border-gray-200 dark:border-white/10 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-5">

                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        © {new Date().getFullYear()} HireLoop. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm">

                        <Link
                            href="/terms"
                            className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            Terms
                        </Link>

                        <Link
                            href="/privacy-policy"
                            className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/cookies"
                            className="text-gray-500 hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            Cookies
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;
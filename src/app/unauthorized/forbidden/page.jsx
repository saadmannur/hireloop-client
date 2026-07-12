import Link from 'next/link';
import { FiShieldOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Button } from '@heroui/react';

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mb-6">
                    <FiShieldOff size={22} className="text-red-600 dark:text-red-400" />
                </div>

                <span className="inline-block text-xs font-semibold tracking-wide uppercase text-red-600 dark:text-red-400 mb-2">
                    403 — Forbidden
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    You don&apos;t have permission to view this page
                </h1>

                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    You&apos;re signed in, but your account doesn&apos;t have the access
                    level this page requires. If you think that&apos;s wrong, reach out
                    to your admin.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="w-full">
                        <Button className="w-full font-medium bg-primary text-white">
                            <FiArrowLeft size={16} />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/" className="w-full">
                        <Button className="w-full font-medium bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
                            Go to Dashboard
                            <FiArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-500">
                    Need access?{' '}
                    <a href="/contact" className="text-primary font-medium hover:underline">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ForbiddenPage;
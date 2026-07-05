import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiArrowRight, FiHome, FiMail } from 'react-icons/fi';
import { Button } from '@heroui/react';
import { createSubscription } from '@/lib/actions/subscriptions';

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id) throw new Error('Please provide a valid session_id (`cs_test_...`)');

    const {
        status,
        customer_details: { email: customerEmail },
        line_items,
        metadata,
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent'],
    });

    if (status === 'open') {
        return redirect('/');
    }

    const planName = line_items?.data?.[0]?.description ?? 'your plan';

    if (status === 'complete') {

        const subscriptionInfo = {
            email: customerEmail,
            planId : metadata.planId,
        }

        const result = await createSubscription(subscriptionInfo)
        console.log(result);

        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-16">
                <div className="max-w-md w-full text-center">
                    {/* Success icon */}
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/10 animate-ping opacity-75" />
                        <div className="relative w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                            <FiCheck size={28} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    <span className="inline-block text-xs font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400 mb-2">
                        Payment successful
                    </span>

                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        We appreciate your business
                    </h1>

                    <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        You are now subscribed to <span className="font-medium text-neutral-700 dark:text-neutral-300">{planName}</span>.
                        A confirmation email is on its way to{' '}
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{customerEmail}</span>.
                    </p>

                    {/* Details card */}
                    <div className="mt-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 text-left">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500 dark:text-neutral-400">Plan</span>
                            <span className="font-medium text-neutral-900 dark:text-white">{planName}</span>
                        </div>
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-3" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500 dark:text-neutral-400">Email</span>
                            <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[220px]">
                                {customerEmail}
                            </span>
                        </div>
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-3" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500 dark:text-neutral-400">Status</span>
                            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Complete
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Link href="/dashboard" className="w-full">
                            <Button className="w-full font-medium bg-primary text-white">
                                Go to Dashboard
                                <FiArrowRight size={16} />
                            </Button>
                        </Link>
                        <Link href="/" className="w-full">
                            <Button className="w-full font-medium bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
                                <FiHome size={16} />
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-500 inline-flex items-center gap-1.5">
                        <FiMail size={13} />
                        Questions?{' '}
                        <a href="mailto:orders@example.com" className="text-primary font-medium hover:underline">
                            orders@example.com
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}
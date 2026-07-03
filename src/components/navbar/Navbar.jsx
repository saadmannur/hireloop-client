'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import Theming from '../theme/Theming';
import { authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

const navItems = [
    {
        label: 'Browse Jobs',
        href: '/jobs',
    },
    {
        label: 'Companies',
        href: '/companies',
    },
    {
        label: 'Pricing',
        href: '/pricing',
    },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname()

    const { data: session, isPending } = authClient.useSession()
    const user = session?.user;
    // console.log(user)

    const router = useRouter()
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // redirect to login page
                },
            },
        });
    }


    return (
        <header className="w-full">

            <div className="container mx-auto">

                <div
                    className=" h-20 rounded-2xl bg-white/90 dark:bg-[#111111]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg transition-colors  duration-300  px-6  lg:px-8 flex items-center  justify-between " >
                    {/* Logo */}

                    <Link href="/" className="flex items-center">
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            <span className="text-blue-500">hire</span>
                            <span className="text-orange-500">loop</span>
                        </h1>
                    </Link>

                    {/* Desktop Menu */}

                    <div className="hidden lg:flex items-center gap-5">

                        {navItems.map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className=" text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition font-medium " >
                                {item.label}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-gray-300 dark:bg-white/10"></div>

                        {/* Theme Toggle */}

                        <Theming></Theming>

                        {
                            isPending ? 
                                <>
                                    <FiLoader className="h-4 w-4 animate-spin" /> Loading...
                                </> :
                            user && pathname !== "/login" ?

                                <div className='flex items-center gap-2'>
                                    <h3 className='text-violet-600'>Hi, {user?.name}</h3>
                                    <Button onClick={handleSignOut} variant='ghost' className={'hover:bg-violet-600 hover:text-white'}>SignOut</Button>
                                </div> :

                                <div className='lg:flex items-center gap-5'>
                                    <Link
                                        href="/login"
                                        className=" text-violet-600 dark:text-violet-400 font-semibold hover:opacity-80" >
                                        Sign In
                                    </Link>

                                    <Link href="/signup">
                                        <Button
                                            as={Link}
                                            className="w-full bg-violet-600 text-white rounded-xl"
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                        }

                    </div>

                    {/* Mobile Button */}

                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden text-gray-800 dark:text-white"
                    >
                        {open ? (
                            <HiOutlineX size={28} />
                        ) : (
                            <HiOutlineMenuAlt3 size={28} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}

                <div
                    className={`overflow-hidden lg:hidden transition-all duration-300 ${open ? 'max-h-[500px] mt-3' : 'max-h-0'
                        }`}
                >
                    <div
                        className=" rounded-2xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 shadow-lg p-6 ">
                        <div className="flex flex-col gap-6">

                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className=" text-gray-600 dark:text-gray-300 hover:text-violet-600  dark:hover:text-violet-400  " >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t border-gray-200 dark:border-white/10 pt-4 ">

                                <Theming></Theming>

                                {
                                    user && pathname !== "/login" ?

                                        <div>
                                            <Button onClick={handleSignOut} variant='ghost' className={'hover:bg-violet-600 hover:text-white'}>SignOut</Button>
                                        </div> :

                                        <div className='lg:flex items-center gap-5'>
                                            <Link
                                                href="/login"
                                                className=" text-violet-600 dark:text-violet-400 font-semibold  hover:opacity-80 " >
                                                Sign In
                                            </Link>

                                            <Link href="/signup">
                                                <Button
                                                    as={Link}
                                                    className="w-full bg-violet-600 text-white rounded-xl"
                                                >
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </div>
                                }

                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </header>
    );
};

export default Navbar;
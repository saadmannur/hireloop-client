'use client'
import StatCardGrid from '@/components/dashboard/StateCard';
import { authClient } from '@/lib/auth-client';
import React from 'react';
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineClipboardDocumentCheck, HiOutlineUsers } from 'react-icons/hi2';

const RecruiterDashboard =  () => {

    const { data: session} = authClient.useSession()
    const user = session?.user;

    const recruiterStats = [
        { id: "posted", label: "Jobs Posted", value: 12, icon: HiOutlineBriefcase },
        { id: "applications", label: "New Applications", value: 214, icon: HiOutlineClipboardDocumentCheck },
        { id: "shortlisted", label: "Shortlisted", value: 26, icon: HiOutlineUsers },
        { id: "hired", label: "Hired", value: 5, icon: HiOutlineCheckCircle },
    ];



    return (
        <div className="container mx-auto p-4">
            <h2 className='text-2xl font-semibold p-1'>Welcome Back, {user?.name}</h2>
            <StatCardGrid stats={recruiterStats}></StatCardGrid>
        </div>
    );
};

export default RecruiterDashboard;
'use client';

import { FiTrash2 } from 'react-icons/fi';
import { useTransition } from 'react';

const DeleteJobButton = ({ jobId }) => {
    // const [isPending, startTransition] = useTransition();

    // const handleDelete = () => {
    //     const confirmed = window.confirm('আপনি কি নিশ্চিত এই job টি delete করতে চান?');
    //     if (!confirmed) return;

    //     startTransition(async () => {
    //         await deleteJob(jobId);
    //         // router.refresh() ব্যবহার করে list refresh করতে পারেন
    //     });
    // };

    return (
        <button
            // onClick={handleDelete}
            // disabled={isPending}
            title="Delete"
            className='p-1.5 rounded hover:bg-red-100 text-red-600 disabled:opacity-50'
        >
            <FiTrash2 size={18} />
        </button>
    );
};

export default DeleteJobButton;
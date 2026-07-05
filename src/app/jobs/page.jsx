import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { getJobs } from '@/lib/api/jobs';
import React from 'react';

const BrowseJobsPage = async ({ searchParams }) => {
    const params = await searchParams;

    const jobs = await getJobs({
        jobType: params?.jobType,
        category: params?.category,
        search: params?.search,
    })
    // console.log(jobs);

    return (
        <div className='container mx-auto'>
            <div className='mx-4 my-8'>
                <JobFilters />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 m-4'>
                {
                    jobs.map(job => <JobCard
                        key={job._id}
                        job={job}
                    ></JobCard>)
                }
            </div>
        </div>
    );
};

export default BrowseJobsPage;
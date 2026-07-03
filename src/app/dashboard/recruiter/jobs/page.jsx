import { getCompanyJobs } from '@/lib/api/jobs';
import { Table } from '@heroui/react';
import { FiEye, FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';
import React from 'react';
import DeleteJobButton from '@/components/dashboard/recruiter/DeleteJobButton';
import { getUserSession } from '@/lib/core/session';
import { getRecruiterCompany } from '@/lib/api/companies';

const RecruiterJobs = async () => {

    const user = await getUserSession()
        // console.log(user, 'user response');
    
        const company = await getRecruiterCompany(user?.id)
        // console.log(company);

    const jobs = await getCompanyJobs(company._id)
    // console.log(jobs);

    return (
        <div className='container mx-auto'>
            <div className=' m-4'>
                <div>
                    <h2 className='text-3xl font-bold mb-1'>Manage All Jobs</h2>
                    <p className='mb-4'>View, update and manage your current job posting</p>
                </div>
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Team members" className="min-w-[600px]">
                            <Table.Header>
                                <Table.Column isRowHeader>Job Title</Table.Column>
                                <Table.Column>Type/Category</Table.Column>
                                <Table.Column>Location</Table.Column>
                                <Table.Column>Status</Table.Column>
                                <Table.Column>Actions</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {
                                    jobs.map(job => <Table.Row key={job._id}>
                                        <Table.Cell>{job.title}</Table.Cell>
                                        <Table.Cell>
                                            <p>{job.jobType}</p>
                                            <p>{job.category}</p>
                                        </Table.Cell>
                                        <Table.Cell>{job.isRemote ? "Remote" : `${job.city}, ${job.country}`}</Table.Cell>
                                        <Table.Cell>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                                                        ? 'bg-green-400 text-green-800'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {job.status === 'active' ? 'Active' : job.status}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex items-center gap-2'>
                                                <Link
                                                    href={`/recruiter/jobs/${job._id}`}
                                                    title="View"
                                                    className='p-1.5 rounded hover:bg-gray-100'
                                                >
                                                    <FiEye size={18} />
                                                </Link>
                                                <Link
                                                    href={`/recruiter/jobs/${job._id}/edit`}
                                                    title="Edit"
                                                    className='p-1.5 rounded hover:bg-gray-100'
                                                >
                                                    <FiEdit2 size={18} />
                                                </Link>
                                                <DeleteJobButton jobId={job._id} />
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>)
                                }
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </div>
        </div>
    );
};

export default RecruiterJobs;
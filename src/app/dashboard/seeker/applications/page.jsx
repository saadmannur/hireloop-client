import { getApplicationByApplicantId } from '@/lib/api/applications';
import { getUserSession } from '@/lib/core/session';
import React from 'react';
import ApplicationsTable from './ApplicationsTable';

const ApplicationPage = async () => {

    const user = await getUserSession()
    const appliedJobs = await getApplicationByApplicantId(user?.id)

    return (
        <div>
            <ApplicationsTable appliedJobs={appliedJobs}></ApplicationsTable>
        </div>
    );
};

export default ApplicationPage;
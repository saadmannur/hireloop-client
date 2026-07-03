import React from 'react';

import { getUserSession } from '@/lib/core/session';
import { getRecruiterCompany } from '@/lib/api/companies';
import NewJob from '@/components/dashboard/recruiter/newjob&company/NewJob';


const NewJobPage = async () => {

     const user = await getUserSession()
        // console.log(user, 'user response');
    
        const company = await getRecruiterCompany(user?.id)
        // console.log(company);

    return (
        <div>
            <NewJob companyA={company}></NewJob>
        </div>
    );
};

export default NewJobPage;
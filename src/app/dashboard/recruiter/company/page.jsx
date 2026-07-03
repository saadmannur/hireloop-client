import React from 'react';
import { getUserSession } from '@/lib/core/session';
import { getRecruiterCompany } from '@/lib/api/companies';
import RecruiterCompany from '@/components/dashboard/recruiter/newjob&company/CompanyProfile';


const CompanyPage = async () => {

    const user = await getUserSession()
    // console.log(user, 'user response');

    const company = await getRecruiterCompany(user?.id)
    // console.log(company);

    return (
        <div>
            <RecruiterCompany recruiter={user} recruiterCompany={company}></RecruiterCompany>
        </div>
    );
};

export default CompanyPage;
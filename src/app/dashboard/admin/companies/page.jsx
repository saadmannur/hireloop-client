import { getCompanies } from '@/lib/api/companies';
import React from 'react';
import CompaniesTable from './CompaniesTable';

const AdminCompanyPage = async () => {

    const companies = await getCompanies()
    // console.log(companies);

    return (
        <div>
            <CompaniesTable companies={companies}></CompaniesTable>
        </div>
    );
};

export default AdminCompanyPage;
'use server'

import { serverMutation } from "../core/server"

export const createCompany = async (newCompanyData) => {
    return serverMutation('/api/companies', newCompanyData)
}

// const baseurl = process.env.NEXT_PUBLIC_SERVER_URL;

// export const createCompany = async (newCompanyData) => {
//     const res = await fetch(`${baseurl}/api/companies`, {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json',
//         },
//         body: JSON.stringify(newCompanyData)
//     })
//     return res.json()
// }
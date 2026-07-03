'use server'

import { serverMutation } from "../core/server"

export const createJob = async (newJobData) => {
    return serverMutation('/api/jobs', newJobData)
}

// const baseurl = process.env.NEXT_PUBLIC_SERVER_URL;

// export const createJob = async (newJobData) => {
//     const res = await fetch(`${baseurl}/api/jobs`, {
//         method: 'POST',
//         headers: {
//             'content-type' : 'application/json',
//         },
//         body: JSON.stringify(newJobData)
//     })
//     return res.json()
// }
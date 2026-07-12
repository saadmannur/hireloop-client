import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseurl = process.env.NEXT_PUBLIC_SERVER_URL;

export const authHeader = async () => {
    const token = await getUserToken()
    const header = token ? {
        authorization : `Bearer ${token}`
    } : {};
    return header ; 
}

export const serverFetch = async (path) => {
    const res = await fetch(`${baseurl}${path}`);
    return await res.json();
}

export const protectedFetch = async (path) => {
    const res = await fetch(`${baseurl}${path}`, {
        headers : await authHeader()
    })

    return handleStatusCode(res)
}

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseurl}${path}`, {
        method: method,
        headers: {
            'content-type': 'application/json',
            ... await authHeader()
        },
        body: JSON.stringify(data)
    });

    return handleStatusCode(res)
}

//handle 401, 403 
const handleStatusCode = (res) => {
    // console.log('status code', res.status);
    if (res.status === 401) {
        redirect('/unauthorized')
    }
    if (res.status === 403) {
        redirect('/unauthorized/forbidden')
    }

    return res.json()
}
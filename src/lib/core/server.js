const baseurl = process.env.NEXT_PUBLIC_SERVER_URL;

export const serverFetch = async (path) => {
    const res = await fetch(`${baseurl}${path}`);
    return await res.json();
}

export const serverMutation = async (path, data) => {
    const res = await fetch(`${baseurl}${path}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return res.json()
}
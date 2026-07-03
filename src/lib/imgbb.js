// lib/imgbb.js
//
// Uploads a base64 (data URL) image to imgbb and returns the hosted URL.
// Requires NEXT_PUBLIC_IMGBB_API_KEY in your .env (get one free at
// https://api.imgbb.com/). It's exposed client-side on purpose — imgbb's
// free-tier keys are meant to be used from the browser — but if you'd
// rather keep the key server-only, move this call into your server
// action (createCompany) instead and send the raw base64 there.

export async function uploadToImgbb(base64DataUrl) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error("Missing NEXT_PUBLIC_IMGBB_API_KEY in your environment.");
    }

    // imgbb wants the raw base64 payload, not the "data:image/...;base64," prefix
    const base64 = base64DataUrl.split(",")[1] ?? base64DataUrl;

    const formData = new FormData();
    formData.append("image", base64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
        throw new Error(data?.error?.message || "Image upload to imgbb failed.");
    }

    // data.data.url = direct image link, data.data.display_url = same thing
    return data.data.url;
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import { submitApplication } from "@/lib/actions/applications";
import { toast } from "@heroui/react";

const inputClasses =
    "w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2.5 text-sm text-foreground placeholder:text-default-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors";

const labelClasses =
    "text-sm font-medium text-foreground/80 mb-1.5 block";

const ApplyForm = ({ job, user }) => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: "",
        portfolioUrl: "",
        coverLetter: "",
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setResumeFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            setErrorMsg("Please attach your resume.");
            return;
        }

        setStatus("submitting");
        setErrorMsg("");

        try {
            const payload = new FormData();
            payload.append("jobId", job._id);
            payload.append("jobName", job.title);
            payload.append("companyName", job.companyName);
            payload.append("userId", user?.id || "");
            payload.append("userName", user?.name || "");
            payload.append("userEmail", user?.email || "");
            Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
            payload.append("resume", resumeFile);

            const applicationInfo = Object.fromEntries(payload.entries());
            console.log(applicationInfo);

            const data = await submitApplication(applicationInfo)
            // console.log(data)

            if (data.acknowledged === true) {
                toast.success("Application Submitted", {
                    description: "Thankyou for contributing",
                });
            }

            setStatus("success");
            router.refresh()

        } catch (err) {
            setStatus("error");
            setErrorMsg("Something went wrong while submitting. Please try again.");
        }

    };

    if (status === "success") {
        return (
            <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-3">
                <FiCheckCircle className="mx-auto text-green-500" size={32} />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Application submitted
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    We have sent your application to the recruiter. You can track its status from
                    your dashboard.
                </p>
                <button
                    onClick={() => router.push("/dashboard/applications")}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    View my applications
                </button>
            </div>
        );
    }


    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-5"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="Your full name"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="+880 1XXX-XXXXXX"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Portfolio / LinkedIn</label>
                    <input
                        type="url"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="https://..."
                    />
                </div>
            </div>

            <div>
                <label className={labelClasses}>Cover Letter</label>
                <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={5}
                    className={inputClasses}
                    placeholder="Tell the recruiter why you're a good fit for this role..."
                />
            </div>

            <div>
                <label className={labelClasses}>Resume</label>
                <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 py-6 text-sm text-neutral-500 dark:text-neutral-400 cursor-pointer hover:border-primary hover:text-primary transition-colors"
                >
                    <FiUpload />
                    {resumeFile ? resumeFile.name : "Click to upload PDF/DOC (max 5MB)"}
                </label>
                <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {errorMsg && (
                <p className="text-sm text-red-500 dark:text-red-400">{errorMsg}</p>
            )}

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === "submitting" ? "Submitting..." : "Submit Application"}
            </button>
        </form>
    );
};

export default ApplyForm;
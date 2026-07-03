"use client";

export function StatCard({ icon: Icon, label, value, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-black/10 bg-white p-5
        dark:border-white/10 dark:bg-[#141414] ${className}`}
        >
            <div
                className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg
          bg-black/5 dark:bg-white/5"
            >
                {Icon ? (
                    <Icon className="h-4 w-4 text-black/70 dark:text-white/80" />
                ) : null}
            </div>

            <p className="mb-1.5 text-sm text-black/50 dark:text-white/50">
                {label}
            </p>
            <p className="text-2xl font-semibold text-black dark:text-white">
                {value}
            </p>
        </div>
    );
}


export function StatCardGrid({ stats = [], className = "" }) {
    return (
        <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
        >
            {stats.map((stat) => (
                <StatCard
                    key={stat.id ?? stat.label}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                />
            ))}
        </div>
    );
}

export default StatCardGrid;

// Example: define per-role stat configs, then feed them into <StatCardGrid stats={...} />
// Swap icon libraries freely — this uses react-icons (Hi/Fi), works the same with your icon set.

// import {
//     HiOutlineDocumentText,
//     HiOutlineUserGroup,
//     HiOutlineBolt,
//     HiOutlineCheckCircle,
//     HiOutlineBriefcase,
//     HiOutlineClipboardDocumentCheck,
//     HiOutlineUsers,
//     HiOutlineChartBar,
// } from "react-icons/hi2";

// // Admin dashboard (matches the screenshot)
// export const adminStats = [
//     { id: "posts", label: "Total Job Posts", value: 48, icon: HiOutlineDocumentText },
//     { id: "applicants", label: "Total Applicants", value: "1,284", icon: HiOutlineUserGroup },
//     { id: "active", label: "Active Jobs", value: 18, icon: HiOutlineBolt },
//     { id: "closed", label: "Jobs Closed", value: 32, icon: HiOutlineCheckCircle },
// ];

// // Recruiter dashboard
// export const recruiterStats = [
//     { id: "posted", label: "Jobs Posted", value: 12, icon: HiOutlineBriefcase },
//     { id: "applications", label: "New Applications", value: 214, icon: HiOutlineClipboardDocumentCheck },
//     { id: "shortlisted", label: "Shortlisted", value: 26, icon: HiOutlineUsers },
//     { id: "hired", label: "Hired", value: 5, icon: HiOutlineCheckCircle },
// ];

// // Job seeker dashboard
// export const jobSeekerStats = [
//     { id: "applied", label: "Jobs Applied", value: 9, icon: HiOutlineDocumentText },
//     { id: "saved", label: "Saved Jobs", value: 15, icon: HiOutlineBolt },
//     { id: "interviews", label: "Interviews", value: 3, icon: HiOutlineUsers },
//     { id: "profileViews", label: "Profile Views", value: 41, icon: HiOutlineChartBar },
//];

/* --- In a page/component --- */
// import { StatCardGrid } from "./StatCard";
// import { adminStats } from "./statsData";
//
// export default function AdminDashboardPage() {
//   return (
//     <div className="min-h-screen bg-black p-8">
//       <StatCardGrid stats={adminStats} />
//     </div>
//   );
// }
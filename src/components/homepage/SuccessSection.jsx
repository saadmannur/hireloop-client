import {
    FiSearch,
    FiTrendingUp,
    FiBarChart2,
    FiBookmark,
    FiMousePointer,
    FiFileText,
    FiArrowUpRight,
} from "react-icons/fi";
import { PiHexagon } from "react-icons/pi";
import { RevealGroup, RevealItem } from "../motionAnimation/RevealGroup";

const features = [
    {
        icon: FiSearch,
        title: "Smart Search",
        description: "Find your ideal job with advanced filters.",
    },
    {
        icon: FiTrendingUp,
        title: "Salary Insights",
        description: "Get real salary data to negotiate confidently.",
    },
    {
        icon: FiBarChart2,
        title: "Top Companies",
        description: "Apply to vetted companies that are hiring.",
    },
    {
        icon: FiBookmark,
        title: "Saved Jobs",
        description: "Manage apps & favorites on your dashboard.",
    },
    {
        icon: FiMousePointer,
        title: "One-Click Apply",
        description: "Simplify your job applications for an easier process!",
    },
    {
        icon: FiFileText,
        title: "Resume Builder",
        description: "Create professional resumes with modern templates.",
    },
    {
        icon: PiHexagon,
        title: "Skill-Based Matching",
        description: "Discover jobs that match your skills and experience.",
    },
    {
        icon: FiArrowUpRight,
        title: "Career Growth Resources",
        description: "Boost your career with quick interview tips.",
    },
];

const SuccessSection = () => {
    return (
        <div>
            <section className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Eyebrow badge */}
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-2 w-2 rounded-[2px] bg-violet-500" />
                        <span className="text-xs font-medium tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            FEATURES JOB
                        </span>
                        <span className="h-2 w-2 rounded-[2px] bg-violet-500" />
                    </div>

                    {/* Heading */}
                    <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-semibold tracking-tight sm:text-5xl">
                        Everything you need to succeed
                    </h2>

                    {/* Feature grid */}
                    <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
                        {features.map(({ icon: Icon, title, description }) => (
                            <RevealItem 
                                direction="up"
                                key={title}
                                className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-violet-500/40 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-500 transition group-hover:bg-violet-500/15">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-base font-medium">{title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    {description}
                                </p>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </div>
            </section>
        </div>
    );
};

export default SuccessSection;
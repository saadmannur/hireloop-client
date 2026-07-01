import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import bgImageLight from "@/assets/images/cta-bg.png";
import Reveal from "../motionAnimation/Reveal";

const ExploreSection = () => {
    return (
        <section className="relative flex min-h-[600px] items-end justify-center overflow-hidden bg-white px-4 pb-16 pt-32 dark:bg-black sm:min-h-[650px]">
            {/* Background image — light mode */}
            <Image
                src={bgImageLight}
                alt="background"
                fill
                priority
                className="block object-cover object-top dark:hidden"
            />

            {/* CSS-generated grid + glow — dark mode */}
            <div
                className="pointer-events-none absolute inset-0 hidden dark:block"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 90% 70% at 50% 0%, rgba(99, 91, 255, 0.55) 0%, rgba(99, 91, 255, 0.15) 45%, transparent 70%),
                        linear-gradient(rgba(120, 113, 255, 0.35) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(120, 113, 255, 0.35) 1px, transparent 1px)
                    `,
                    backgroundSize: "100% 100%, 40px 40px, 40px 40px",
                    backgroundPosition: "center top",
                    maskImage:
                        "radial-gradient(ellipse 80% 65% at 50% 0%, black 55%, transparent 80%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 80% 65% at 50% 0%, black 55%, transparent 80%)",
                }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">

                <Reveal direction="up" duration={0.6}>
                    <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
                        Your next role is
                        <br />
                        already looking for you
                    </h1>
                </Reveal>

                <p className="mx-auto mt-5 max-w-lg text-sm text-neutral-600 dark:text-neutral-300 sm:text-base">
                    Build a profile in three minutes. The matches start arriving tomorrow morning.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/signup"
                        className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        Create a free account
                    </Link>
                    <Link
                        href="/pricing"
                        className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white/80 px-6 py-3 text-sm font-medium text-neutral-900 backdrop-blur-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-white dark:hover:bg-neutral-800"
                    >
                        View pricing
                        <FiArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ExploreSection;
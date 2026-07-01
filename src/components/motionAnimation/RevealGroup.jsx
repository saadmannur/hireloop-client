// components/motion/RevealGroup.jsx
"use client";

import { motion } from "motion/react";

export function RevealGroup({
    children,
    className = "",
    staggerDelay = 0.1,
    once = true,
    amount = 0.2,
}) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount }}
            variants={{
                hidden: {},
                show: {
                    transition: { staggerChildren: staggerDelay },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({ children, className = "", direction = "up", duration = 0.5 }) {
    const directionOffsets = {
        up: { y: 30, x: 0 },
        down: { y: -30, x: 0 },
        left: { x: 30, y: 0 },
        right: { x: -30, y: 0 },
    };
    const offset = directionOffsets[direction] ?? directionOffsets.up;

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, ...offset },
                show: { opacity: 1, x: 0, y: 0, transition: { duration, ease: [0.25, 0.1, 0.25, 1] } },
            }}
        >
            {children}
        </motion.div>
    );
}
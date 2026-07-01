// components/motion/Reveal.jsx
"use client";

import { motion } from "motion/react";

const directionOffsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
};

export default function Reveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.6,
    once = true,
    amount = 0.2,
    className = "",
}) {
    const offset = directionOffsets[direction] ?? directionOffsets.up;

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, amount }}
            transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {children}
        </motion.div>
    );
}
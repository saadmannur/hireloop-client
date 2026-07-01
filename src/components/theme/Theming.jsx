'use client'

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

const Theming = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <button
                onClick={() =>
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                }
                className="
                            h-10
                            w-10
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            bg-gray-100
                            dark:bg-white/5
                            hover:bg-violet-600
                            hover:text-white
                            transition
                            text-gray-700
                            dark:text-gray-300
                          "
            >
                {theme === 'dark' ? (
                    <FiSun size={18} />
                ) : (
                    <FiMoon size={18} />
                )}
            </button>
        </div>
    );
};

export default Theming;
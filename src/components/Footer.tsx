import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from "react-icons/fi";
import { useFeatureFlags } from "../context/FeatureFlagContext";
// import logo from "../assets/ChatGPT Image Jul 18, 2026, 06_54_16 PM.png";

const EVOLVE_ASCII = `  _____   _____ | |_   _____ 
  / _ \\ \\ / / _ \\| \\ \\ / / _ \\
 |  __/\\ V / (_) | |\\ V /  __/
  \\___| \\_/ \\___/|_| \\_/ \\___|`;

const navLinks = [
    { label: "Home", to: "/", flag: "" },
    { label: "About", to: "/about", flag: "nav.about" },
    { label: "Solutions", to: "/solutions", flag: "nav.solutions" },
    { label: "Docs", to: "/docs", flag: "nav.docs" },
    { label: "Infrastructure", to: "/infrastructure", flag: "nav.infrastructure" },
    { label: "Support", to: "/Donate", flag: "nav.support" },
];

const socials = [
    {
        label: "GitHub",
        href: "https://github.com/sahilkadampng",
        icon: <FiGithub />,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com",
        icon: <FiLinkedin />,
    },
    {
        label: "Email",
        href: "mailto:sahilkadam@gmail.com",
        icon: <FiMail />,
    },
];

export default function Footer() {
    const { isEnabled } = useFeatureFlags();
    const visibleLinks = navLinks.filter(
        (link) => !link.flag || isEnabled(link.flag)
    );

    useEffect(() => {
        console.log(
            `%c\n${EVOLVE_ASCII}\n`,
            "color: #685AFF; font-family: monospace; font-weight: bold; font-size: 13px;"
        );
    }, []);


    return (
        <footer className="z-20 bg-[#111214] border-t border-white/[0.06] text-white font-michroma">
            {/* Subtle top gradient line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#685AFF]/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">

                    {/* LEFT: Navigation & Connect */}
                    <div className="flex flex-col gap-10">
                        {/* Navigation Section */}
                        <div>
                            <h3 className="text-[11px] tracking-[0.25em] text-gray-500 uppercase mb-5 text-left">
                                Navigation
                            </h3>
                            <ul className="w-full space-y-3 text-left">
                                {visibleLinks.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="text-sm text-gray-400 hover:text-[#685AFF] transition-colors flex items-center gap-0 group font-arimo w-fit"
                                        >
                                            <span className="w-0 group-hover:w-4 h-px bg-[#685AFF] transition-all duration-300 mr-0 group-hover:mr-1.5" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Connect Section */}
                        <div>
                            <h3 className="text-[11px] tracking-[0.25em] text-gray-500 uppercase mb-5 text-left">
                                Connect
                            </h3>
                            <div className="space-y-3">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-sm text-gray-400 hover:text-[#685AFF] transition-colors group font-arimo w-fit"
                                    >
                                        <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-base group-hover:border-[#685AFF]/30 group-hover:bg-[#685AFF]/10 transition-all">
                                            {s.icon}
                                        </span>
                                        {s.label}
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CENTER: ASCII Evolve */}
                    <div className="flex flex-col items-start md:items-center text-left md:text-center justify-center h-full pt-2">
                        <pre className="font-mono text-[9px] sm:text-xs md:text-xs lg:text-sm text-gray-500 hover:text-[#685AFF] transition-colors leading-[1.15] select-none">
                            {EVOLVE_ASCII}
                        </pre>
                    </div>

                    {/* RIGHT: Empty placeholder to keep center mathematically aligned on desktop */}
                    <div className="hidden md:block" />

                </div>

                {/* Divider */}
                <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Bottom bar */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <p className="text-[11px] text-gray-600 tracking-wide font-arimo">
                        © {new Date().getFullYear()} Sahil Kadam. Built with
                        <span className="text-[#685AFF]"> violet.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
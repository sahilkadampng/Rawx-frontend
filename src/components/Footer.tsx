import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from "react-icons/fi";
import { useFeatureFlags } from "../context/FeatureFlagContext";
import footerImage from "../assets/mobile2.png";

const EVOLVE_ASCII = `E V O L V E`;

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">

                    {/* Navigation (Left) & Connect (Right) on Mobile | Stacked on Desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-38 sm:gap-10 w-full text-left">
                        {/* Navigation Section */}
                        <div className="flex flex-col items-start">
                            <h3 className="text-[11px] tracking-[0.25em] text-gray-500 uppercase mb-5">
                                Navigation
                            </h3>
                            <ul className="space-y-3 flex flex-col items-start">
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
                        <div className="flex flex-col items-start">
                            <h3 className="text-[11px] tracking-[0.25em] text-gray-500 uppercase mb-5">
                                Connect
                            </h3>
                            <div className="space-y-3 flex flex-col items-start">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2.5 sm:gap-3 text-sm text-gray-400 hover:text-[#685AFF] transition-colors group font-arimo w-fit"
                                    >
                                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-sm sm:text-base group-hover:border-[#685AFF]/30 group-hover:bg-[#685AFF]/10 transition-all flex-shrink-0">
                                            {s.icon}
                                        </span>
                                        <span className="truncate">{s.label}</span>
                                        <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Evolve */}
                    <div className="flex flex-col items-center justify-center text-center h-full py-4 md:py-0">
                        <pre className="font-russo text-[10px] sm:text-xs md:text-xs lg:text-sm text-gray-500 hover:text-[#685AFF] transition-colors leading-[1.15] select-none">
                            {EVOLVE_ASCII}
                        </pre>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center justify-center md:justify-end w-full">
                        <img
                            src={footerImage}
                            alt="EVOLVE — Backend Developer"
                            className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain select-none pointer-events-none bg-transparent mx-auto md:mx-0"
                        />
                    </div>

                </div>

                {/* Divider */}
                <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Bottom bar */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                    <p className="text-[11px] text-gray-600 tracking-wide font-arimo">
                        © {new Date().getFullYear()} Sahil Kadam. Built with
                        <span className="text-[#685AFF]"> violet.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
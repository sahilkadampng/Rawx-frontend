import { Link } from 'react-router-dom';
import { FaXTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { FeatureGate, useFeatureFlags } from '../context/FeatureFlagContext';
import ProfileActivityCards from './ProfileActivityCards';

const socialLinks = [
    { icon: FaXTwitter, label: 'Twitter / X', href: '#' },
    { icon: FaGithub, label: 'GitHub', href: 'https://github.com/sahilkadampng' },
    { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
];

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'sahilkadampng';
const leetcodeUsername = import.meta.env.VITE_LEETCODE_USERNAME || 'sahil_kadam9195';

const platformLinks = [
    { label: 'Infrastructure', to: '/infrastructure' },
    { label: 'Solutions', to: '/solutions' },
    { label: 'Docs', to: '/docs' },
    { label: 'Login', to: '/login' },
];

export default function Footer() {
    const { isEnabled } = useFeatureFlags();
    const visiblePlatformLinks = platformLinks.filter((link) => {
        const flagMap: Record<string, string> = {
            '/infrastructure': 'nav.infrastructure',
            '/solutions': 'nav.solutions',
            '/docs': 'nav.docs',
            '/login': 'nav.login',
        };

        const flag = flagMap[link.to];
        return flag ? isEnabled(flag) : true;
    });

    return (
        <footer className="w-full bg-black px-6">
            {/* MAIN */}
            <div className="max-w-7xl mx-auto pt-12 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                    {/* LEFT — SOCIAL */}
                    <div className="space-y-3">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition font-arimo"
                            >
                                <link.icon className="w-4 h-4 text-gray-500" />
                                {link.label}
                            </a>
                        ))}
                    </div>
                    {/* RIGHT — PLATFORM (mobile) */}
                    <div className="space-y-2 md:hidden">
                        {visiblePlatformLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="flex justify-end text-sm text-[#685AFF] hover:text-[#364fc7] transition font-arimo"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a href='#' className='flex items-center text-xl -mt-20 -ml-10 text-gray-400 hover:text-[#685AFF] transition font-arimo'>RAW</a>
                    </div>
                    {/* CENTER — LOGO (desktop only) */}
                    <div className="hidden md:flex flex-col items-center">
                        <a className="text-2xl font-extrabold tracking-[0.15em] text-gray-200 hover:text-[#685AFF] uppercase">
                            RAW
                        </a>
                    </div>
                    {/* RIGHT — PLATFORM (desktop only) */}
                    <div className="hidden md:block md:text-right">
                        <h4 className="text-xs font-mono tracking-[0.2em] text-gray-500 uppercase mb-5">
                            Platform
                        </h4>
                        <ul className="space-y-2">
                            {visiblePlatformLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-[#685AFF] hover:text-[#364fc7] transition font-arimo"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <FeatureGate flagKey="content.footer.activity" fallback={null}>
                    <ProfileActivityCards githubUsername={githubUsername} leetcodeUsername={leetcodeUsername} />
                </FeatureGate>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

                    <p className="text-xs font-mono tracking-[0.15em] text-gray-600 uppercase text-center sm:text-left">
                        © 2026 RAW
                    </p>

                </div>
            </div>

        </footer>
    )
}

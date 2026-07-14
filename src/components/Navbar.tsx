import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useFeatureFlags } from '../context/FeatureFlagContext';

const navLinks = [
    { label: 'About', to: '/about', flag: 'nav.about' },
    { label: 'Solutions', to: '/solutions', flag: 'nav.solutions' },
    { label: 'Docs', to: '/docs', flag: 'nav.docs' },
    { label: 'Infrastructure', to: '/infrastructure', flag: 'nav.infrastructure' },
    { label: 'Support', to: '/Donate', flag: 'nav.support' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isEnabled } = useFeatureFlags();
    const visibleLinks = navLinks.filter((link) => isEnabled(link.flag));

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-black/40 border-b border-gray-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-16 h-16 flex items-center justify-between">
                {/* LEFT → LOGO */}
                <Link to="/" className="font-arimo text-xl font-bold text-white">
                    RAW
                </Link>

                {/* CENTER → MENU (desktop) */}
                <ul className="hidden md:flex gap-8">
                    {visibleLinks.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className="text-white hover:text-gray-500 transition-colors">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* RIGHT → LOGIN (desktop) */}
                <div className="hidden md:block">
                    <Link
                        to="/login"
                        className="text-white hover:text-gray-600 transition-colors"
                    >
                        Login
                    </Link>
                </div>

                {/* MOBILE → HAMBURGER */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden backdrop-blur-sm bg-black/10 border-b border-gray-300">
                    <ul className="flex flex-col gap-4 px-6 py-4">
                        {visibleLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to} className="text-white hover:text-gray-500 transition-colors" onClick={() => setMenuOpen(false)}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link to="/login" className="text-white hover:text-gray-500 transition-colors" onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

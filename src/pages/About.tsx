import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import VisibilityNotice from '../components/VisibilityNotice';
import { FeatureGate, useFeatureFlag } from '../context/FeatureFlagContext';

const timeline = [
    { year: '2024', title: 'Started Web Development', desc: 'Began learning JavaScript, HTML & CSS — built first static sites and explored the fundamentals of frontend development.' },
    { year: '2024', title: 'Dove Into Backend', desc: 'Picked up Node.js and Express.js. Built REST APIs, connected MongoDB databases, and started thinking in systems.' },
    { year: '2025', title: 'First Full-Stack Project', desc: 'Shipped ResolvexPro — a complaint management SaaS platform with auth, dashboards, and real-time data pipelines.' },
    { year: '2025', title: 'Second Full-Stack Project', desc: 'Shipped Inventoxpro — a stock management system with inventory tracking, barcode scanning, and real-time updates.' },
    { year: '2026', title: 'logic building', desc: 'Started learning data structures, algorithms, and computer science fundamentals to build scalable and efficient systems.' },
];

// const values = [
//     { label: 'Simplicity First', desc: 'Clean architecture over clever hacks. Every system should be readable and maintainable.' },
//     { label: 'Ship & Iterate', desc: 'Launch early, learn fast. Production feedback beats theoretical perfection.' },
//     { label: 'Security by Default', desc: 'Auth, validation, and encryption aren\'t afterthoughts — they\'re built into the foundation.' },
//     { label: 'Scale-Ready', desc: 'From day one, code is structured for growth. Microservices, modular design, clean separation.' },
// ];

export default function About() {
    const pageVisible = useFeatureFlag('page.about');

    if (!pageVisible) {
        return (
            <VisibilityNotice
                title="About"
                description="The About page is currently disabled by the site administrator."
                backHref="/"
                backLabel="Back to home"
            />
        );
    }

    return (
        <>
            <Navbar />
            <main className="bg-[#f4f6fb] min-h-screen">
                {/* Hero section */}
                <section className="pt-32 pb-16 sm:pb-20 px-4 sm:px-6 bg-[#121212]">
                    <div className="max-w-6xl mx-auto text-cente">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#685AFF] uppercase mb-6"
                        >
                             About - Overview 
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-100 uppercase leading-tight tracking-tight"
                        >
                            The Developer
                            <br />
                            <span className="text-[#685AFF]">Behind ME.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-6 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto"
                        >
                            Engineering scalable backend systems and modern APIs that power reliable, high-performance web applications.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-12 flex flex-wrap justify-center divide-x divide-gray-200"
                        >
                            {[
                                // { value: '19', label: 'Years Old' },
                                // { value: 'India', label: 'Location' },
                                { value: 'SDE', label: 'Focus' },
                                { value: '2024', label: 'Started' },
                            ].map((stat) => (
                                <div key={stat.label} className="px-5 sm:px-10 py-2 text-center">
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stat.value}</p>
                                    <p className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-400 uppercase mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Bio card */}
                <section className="px-4 sm:px-6 pb-16 bg-[#121212]">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="max-w-4xl mx-auto bg-[#181818] border border-gray-600 rounded-xl p-8 sm:p-12"
                    >
                        <div className="flex items-center justify-between mb-6 sm:px-2">
                            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase">
                                Profile - Summary
                            </span>
                            <span className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                AVAILABLE FOR WORK
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#685AFF] uppercase tracking-tight mb-4">
                            Sahil Kadam
                        </h3>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4">
                            I'm a self-taught developer who started from YouTube video's and built my way into backend engineering.
                            I think in systems — databases, APIs, auth layers, and deployment pipelines. My goal isn't
                            just to write code, but to build infrastructure that scales and lasts.
                        </p>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                            When I'm not coding, I'm studying system design patterns, exploring new technologies,
                            and working toward becoming a production-grade engineer who ships with confidence.
                        </p>
                        {/* <div className="mt-6 flex flex-wrap gap-2">
                            {['Node.js', 'Express', 'MongoDB', 'React', 'TypeScript', 'Tailwind CSS', 'Git'].map((tag) => (
                                <span key={tag} className="px-3 py-1 border border-gray-600 rounded-md font-mono text-[10px] sm:text-xs tracking-wider text-gray-600 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div> */}
                    </motion.div>
                </section>

                {/* Timeline */}
                <FeatureGate flagKey="content.about.timeline">
                    <section className="pt-32 px-4 sm:px-6 pb-20 bg-[#1c1c1c]">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase mb-8">
                                    Journey - Timeline
                                </p>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-100 uppercase tracking-tight">
                                    The Path So <span className="text-[#685AFF]">Far.</span>
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {timeline.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-[#121212] border border-gray-700 rounded-xl p-6 sm:p-8 flex gap-6 items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex flex-col items-center shrink-0">
                                            <span className={`w-3 h-3 rounded-full ${i === timeline.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                            {i < timeline.length - 1 && <span className="w-px h-full bg-gray-200 mt-1" />}
                                        </div>
                                        <div>
                                            <span className="font-mono text-[10px] tracking-wider text-gray-400 uppercase">{item.year}</span>
                                            <h3 className="text-lg font-extrabold text-[#685AFF] tracking-tight mt-1 mb-2">{item.title}</h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </FeatureGate>

                {/* Values */}
            </main>
            {/* <Footer /> */}
        </>
    );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
    FiBox,
    FiChevronDown,
    FiCode,
    FiCpu,
    FiDatabase,
    FiDownload,
    FiGlobe,
    FiLayers,
    FiMonitor,
    FiServer,
} from 'react-icons/fi';

type Service = {
    title: string;
    description: string;
    icon: ReactNode;
    topics: string[];
};

const services: Service[] = [
    {
        title: 'React / Next.js',
        description: 'Building modern, responsive interfaces and full-stack web applications with component-driven architecture.',
        icon: <FiMonitor />,
        topics: [
            'Functional components & hooks',
            'Client / server components',
            'App Router & routing',
            'State (Context, Zustand)',
            'API routes & data fetching',
            'Tailwind UI & responsive layout',
        ],
    },
    {
        title: 'TypeScript',
        description: 'Writing safer, more maintainable code with strong typing and scalable application architecture.',
        icon: <FiCode />,
        topics: [
            'Types, interfaces & unions',
            'Generics',
            'Utility types',
            'Typing APIs & props',
            'Strict mode & narrowing',
        ],
    },
    {
        title: 'Node.js / Express',
        description: 'Building scalable backend systems, REST APIs, authentication flows, and server-side applications.',
        icon: <FiServer />,
        topics: [
            'REST API design',
            'Middleware pipelines',
            'JWT / session auth',
            'Error handling',
            'File uploads & env config',
        ],
    },
    {
        title: 'MongoDB',
        description: 'Designing flexible database structures and efficient data models for modern applications.',
        icon: <FiDatabase />,
        topics: [
            'Schema & document modeling',
            'Mongoose',
            'CRUD & aggregations',
            'Indexes',
            'Relationships & population',
        ],
    },
    {
        title: 'Python',
        description: 'Using Python for backend development, automation, scripting, and problem-solving.',
        icon: <FiCode />,
        topics: [
            'Core syntax & data types',
            'OOP in Python',
            'Data structures & algorithms',
            'File I/O & scripting',
            'APIs (FastAPI / Flask)',
            'Automation & problem solving',
        ],
    },
    {
        title: 'Docker / Kubernetes',
        description: 'Containerizing applications and understanding the infrastructure behind scalable deployments.',
        icon: <FiBox />,
        topics: [
            'Dockerfiles & images',
            'Volumes & networking',
            'Docker Compose',
            'Pods, services & deployments',
            'Basic cluster concepts',
        ],
    },
    {
        title: 'DSA (C++)',
        description: 'Solving problems using efficient algorithms, data structures, and optimized approaches.',
        icon: <FiCpu />,
        topics: [
            'Arrays, strings & hashing',
            'Linked lists & stacks / queues',
            'Trees & graphs',
            'Sorting & searching',
            'Recursion & dynamic programming',
            'STL basics',
        ],
    },
    {
        title: 'OOP',
        description: 'Designing modular, reusable, and maintainable software using object-oriented principles.',
        icon: <FiLayers />,
        topics: [
            'Encapsulation',
            'Inheritance',
            'Polymorphism',
            'Abstraction',
            'SOLID principles',
        ],
    },
    {
        title: 'Computer Networking',
        description: 'Understanding the protocols and architecture behind communication between clients, servers, and modern applications.',
        icon: <FiGlobe />,
        topics: [
            'OSI & TCP/IP models',
            'HTTP / HTTPS',
            'DNS',
            'IP, ports & sockets',
            'REST vs WebSockets',
        ],
    },
];

const marqueeItems = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'Python',
    'Docker',
    'Kubernetes',
    'DSA',
    'OOP',
    'CN',
];

function ServiceCard({
    service,
    index,
    expanded,
    onToggle,
}: {
    service: Service;
    index: number;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className={`group relative h-fit overflow-hidden rounded-[11px] border bg-[#161616] px-6 py-6 text-left transition-colors duration-300 ${
                expanded
                    ? 'border-[#685AFF]/55'
                    : 'border-white/10 hover:border-[#685AFF]/30'
            }`}
        >
            <span className="absolute left-0 top-5 h-12 w-1 rounded-r-full bg-[#685AFF]" />
            <div className="absolute inset-0 bg-linear-to-br from-white/[0.035] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="relative flex w-full cursor-pointer items-start gap-4 text-left"
            >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1d1d1d] text-xl text-white">
                    {service.icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[1.05rem] font-michroma tracking-tight text-[#FFFFFF]">
                            {service.title}
                        </h3>
                        <FiChevronDown
                            className={`mt-1 shrink-0 text-lg text-[#685AFF] transition-transform duration-300 ${
                                expanded ? 'rotate-180' : ''
                            }`}
                        />
                    </div>
                    <p className="mt-2 text-[12px] leading-5 text-white/45 font-michroma">
                        What I know
                    </p>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="relative overflow-hidden"
                    >
                        <p className="mt-4 text-[13px] leading-6 text-white/58 font-michroma">
                            {service.description}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {service.topics.map((topic) => (
                                <li
                                    key={topic}
                                    className="rounded-full border border-[#685AFF]/35 bg-[#685AFF]/10 px-3 py-1.5 text-[11px] font-michroma tracking-wide text-[#c8c3ff]"
                                >
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

export default function Skills() {
    const [openTitle, setOpenTitle] = useState<string | null>(null);

    return (
        <section className="relative z-10 overflow-hidden bg-[#050505] px-4 py-20 text-white sm:px-6 sm:py-28">
            <div className="relative mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center gap-3 text-center"
                >
                    <span className="h-px w-10 bg-[#685AFF]" />
                    <span className="text-[10px] font-michroma uppercase tracking-[0.34em] text-white/85 sm:text-xs">
                        My Specialization
                    </span>
                    <span className="h-px w-10 bg-[#685AFF]" />
                </motion.div>

                <div className="relative mt-5 text-center">
                    <p className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-2 select-none text-[clamp(3.75rem,10vw,7.25rem)] font-black uppercase tracking-[0.18em] text-white/2 sm:block">
                        SKILL
                    </p>

                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="relative text-[clamp(2.2rem,5vw,4.2rem)] font-russo leading-[0.95] tracking-[-0.04em] text-white"
                    >
                        <span className="text-[#685AFF]">SKILLS</span>{' '}
                        <span className="text-white">I HAVE</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.12 }}
                        className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50 sm:text-base"
                    >
                        The technologies I use to build, scale, and ship modern backend systems.
                    </motion.p>
                </div>

                <div className="mt-12 grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.title}
                            service={service}
                            index={index}
                            expanded={openTitle === service.title}
                            onToggle={() =>
                                setOpenTitle((current) =>
                                    current === service.title ? null : service.title,
                                )
                            }
                        />
                    ))}
                </div>

                <div className="mt-16 border-t border-white/10 pt-14 text-center sm:pt-16">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mx-auto max-w-4xl text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-white"
                    >
                        Let&apos;s Create an <span className="text-[#685AFF]">Amazing</span>{' '}
                        <span className="text-[#685AFF]">Project Together!</span>
                    </motion.h3>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <motion.a
                            id="contact"
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.08 }}
                            href="#CTA"
                            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white/90"
                        >
                            Contact Us
                        </motion.a>

                        <motion.a
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.12 }}
                            href="/resume.pdf"
                            download="resume.pdf"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-[#161616] px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-[#685AFF]/60 hover:bg-[#1d1d1d] hover:text-[#685AFF]"
                        >
                            <FiDownload className="text-base" />
                            <span>Download CV</span>
                        </motion.a>
                    </div>
                </div>

                <div className="skill-marquee relative mt-14 overflow-hidden border-y border-gray-700/20 py-4">
                    <div className="skill-marquee-track flex w-max items-center gap-4 text-sm font-medium tracking-[-0.03em] text-white/82">
                        {[...marqueeItems, ...marqueeItems].map((item, index) => (
                            <div
                                key={`${item}-${index}`}
                                className="inline-flex items-center gap-4 whitespace-nowrap"
                            >
                                <span className="rounded-full border border-white/10 bg-white/4 px-4 py-2">
                                    {item}
                                </span>
                                <span className="text-[#685AFF]">*</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

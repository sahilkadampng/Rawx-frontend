import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VisibilityNotice from '../components/VisibilityNotice';
import { FeatureGate, useFeatureFlag } from '../context/FeatureFlagContext';

const solutions = [
    {
        tag: 'API Layer',
        tagColor: 'text-blue-600',
        title: 'RESTful API Design',
        desc: 'Structured, versioned REST endpoints with proper error handling, pagination, and consistent response schemas. Built for consumption by any client.',
        features: ['Versioned Routes', 'Error Middleware', 'JSON Schema Validation'],
    },
    {
        tag: 'Auth Layer',
        tagColor: 'text-blue-600',
        title: 'Authentication & Security',
        desc: 'JWT-based auth flows with refresh tokens, role-based access control, and bcrypt password hashing. Security is foundational, not bolted on.',
        features: ['JWT + Refresh Tokens', 'RBAC', 'bcrypt Hashing'],
    },
    {
        tag: 'Data Layer',
        tagColor: 'text-gray-500',
        title: 'Database Architecture',
        desc: 'Schema-first MongoDB design with Mongoose ODM — optimized indexes, population strategies, and aggregation pipelines for complex queries.',
        features: ['Schema Validation', 'Indexed Queries', 'Aggregation Pipelines'],
    },
    {
        tag: 'Integration Layer',
        tagColor: 'text-gray-500',
        title: 'Third-Party Integrations',
        desc: 'Seamless integration with payment gateways, email services, cloud storage, and external APIs. Modular adapters for easy swapping.',
        features: ['Payment APIs', 'Email Services', 'Cloud Storage'],
    },
    {
        tag: 'DevOps Layer',
        tagColor: 'text-blue-600',
        title: 'Deployment & CI/CD',
        desc: 'Production deployments with Git-based workflows. Environment management, build optimization, and continuous integration pipelines.',
        features: ['Git Workflows', 'Env Management', 'Build Optimization'],
    },
    {
        tag: 'Frontend Layer',
        tagColor: 'text-gray-500',
        title: 'UI & Client Applications',
        desc: 'Modern React interfaces with Tailwind CSS. Component-driven architecture, responsive design, and optimized performance out of the box.',
        features: ['React + TypeScript', 'Tailwind CSS', 'Responsive Design'],
    },
];

const processSteps = [
    { step: '01', title: 'Discovery', desc: 'Understand the problem, define requirements, and map out the system architecture before writing a single line of code.' },
    { step: '02', title: 'Architecture', desc: 'Design database schemas, API contracts, and service boundaries. Plan for scale from the start.' },
    { step: '03', title: 'Implementation', desc: 'Build incrementally with clean code, proper testing, and frequent commits. Ship features that work.' },
    { step: '04', title: 'Deployment', desc: 'Production-ready deployment with monitoring, error tracking, and documentation. Built to maintain.' },
];

export default function Solutions() {
    const pageVisible = useFeatureFlag('page.solutions');

    if (!pageVisible) {
        return (
            <VisibilityNotice
                title="Solutions"
                description="The Solutions page is currently disabled by the site administrator."
                backHref="/"
                backLabel="Back to home"
            />
        );
    }

    return (
        <>
            <Navbar />
            <main className="bg-[#f4f6fb] min-h-screen">
                
                <section className="pt-32 pb-16 sm:pb-20 px-4 sm:px-6 bg-[#121212]">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#685AFF] uppercase mb-6"
                        >
                            ● Solutions :: Catalog ●
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-100 uppercase leading-tight tracking-tight"
                        >
                            What I <span className="text-[#685AFF]">Build.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-6 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto"
                        >
                            End-to-end solutions from database design to deployment — every layer
                            engineered for reliability, security, and scale.
                        </motion.p>

                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-3 mt-8"
                        >
                            {['Full-Stack', 'API-First', 'Production-Ready'].map((tag) => (
                                <span key={tag} className="px-4 py-1.5 border border-gray-700 rounded-md font-mono text-[10px] sm:text-xs tracking-wider text-gray-600 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </section>

                
                <FeatureGate flagKey="content.solutions.grid">
                    <section className="px-4 sm:px-6 pb-20 bg-[#121212]">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {solutions.map((sol, i) => (
                                    <motion.div
                                        key={sol.title}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-[#181818] border border-gray-700 rounded-xl p-6 sm:p-8 text-left flex flex-col justify-between min-h-70 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-5">
                                                <span className={`font-mono text-[10px] tracking-wider uppercase ${sol.tagColor}`}>
                                                    {sol.tag}
                                                </span>
                                                <span className="font-mono text-xs text-gray-300">{String(i + 1).padStart(2, '0')}</span>
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-extrabold text-[#685AFF] uppercase tracking-tight mb-3">
                                                {sol.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                                {sol.desc}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {sol.features.map((f) => (
                                                <span key={f} className="px-2.5 py-1 border border-gray-700 rounded-md font-mono text-[10px] tracking-wider text-gray-500 uppercase">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </FeatureGate>

                
                <FeatureGate flagKey="content.solutions.process">
                    <section className="pt-32 px-4 sm:px-6 pb-20 bg-[#181818]">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase mb-4">
                                    Process :: Pipeline
                                </p>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-100 uppercase tracking-tight">
                                    How It <span className="text-[#685AFF]">Ships.</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {processSteps.map((s, i) => (
                                    <motion.div
                                        key={s.step}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-[#121212] border border-gray-700 rounded-xl p-6 sm:p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="w-10 h-10 rounded-lg bg-[#1f1f1f] border border-gray-700 flex items-center justify-center font-mono text-sm font-bold text-gray-400">
                                                {s.step}
                                            </span>
                                            <h3 className="text-lg font-extrabold text-[#685AFF] uppercase tracking-tight">{s.title}</h3>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            
                            
                            <p className="mt-8 text-center font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase">
                                Every layer. Production grade.
                            </p>
                        </div>
                    </section>
                </FeatureGate>
            </main>
            <Footer />
        </>
    );
}

import { motion } from 'framer-motion';

export default function Architecture() {
    const stats = [
        { value: '100%', label: 'Schema Validation' },
        { value: 'AES-256', label: 'Encryption' },
        { value: '<50ms', label: 'Overhead' },
    ]

    const layers = [
        {
            tag: 'Layer: Structure',
            tagColor: 'text-gray-500',
            icon: '⊞',
            iconBg: 'bg-gray-100 text-gray-400',
            title: 'Schema Enforcement',
            desc: 'Every input is typed and validated against strict definitions before processing.',
            badge: 'Ad-hoc → Defined',
        },
        {
            tag: 'Layer: Encapsulation',
            tagColor: 'text-blue-600',
            icon: '.',
            iconBg: 'bg-blue-50 text-blue-500',
            title: 'Logic Encapsulation',
            desc: 'Business logic is isolated. Backend complexity is never exposed to the client.',
            badge: 'Exposed → Secured',
        },
        {
            tag: 'Layer: Governance',
            tagColor: 'text-gray-500',
            icon: '⚙',
            iconBg: 'bg-gray-100 text-gray-400',
            title: 'Centralized Policy',
            desc: 'Centralized constraints on cost, rate limits, and safety for every request.',
            badge: 'Variance → Predictable',
        },
        {
            tag: 'Layer: Deployment',
            tagColor: 'text-blue-600',
            icon: '🔗',
            iconBg: 'bg-blue-50 text-blue-500',
            title: 'Unified Deployment',
            desc: 'One core serves REST APIs, webhooks, and internal services simultaneously.',
            badge: 'Fragmented → Unified',
        },
    ]

    return (
        <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#f4f6fb] -mt-36">
            <div className="max-w-6xl mx-auto text-center">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <span className="font-mono sm:text-[10px] tracking-[0.2em] text-gray-500 uppercase">
                        Architecture :: Core
                    </span>
                    <span className="w-12 h-px bg-gray-300" />
                    <span className="font-mono text-[10px] sm:text-[13px] tracking-wider text-gray-400">
                        System Guarantees
                    </span>
                </motion.div>

                
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-2xl sm:text-3xl md:text-6xl font-extrabold text-gray-900 uppercase leading-tight tracking-tight"
                >
                    Technical
                    <br />
                    <span className="text-blue-600 italic">Skills</span>
                </motion.h2>

                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-gray-500 text-base sm:text-md max-w-2xl mx-auto"
                >
                    Outcomes compound because the architecture is stable. Buildr provides a single layer that
                    validates inputs, protects logic, and governs execution across every API you ship.
                </motion.p>
                <hr className="mt-9 text-gray-300" />

                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12 flex flex-wrap justify-center divide-x divide-gray-200"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="px-6 sm:px-10 py-2 text-center">
                            <p className="text-xl sm:text-1xl font-bold text-gray-900">{stat.value}</p>
                            <p className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-400 uppercase mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {layers.map((layer, idx) => (
                        <motion.div
                            key={layer.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-6 text-left flex flex-col justify-between min-h-65 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div>
                                
                                <div className="flex items-center justify-between mb-5">
                                    <span
                                        className={`font-mono text-[10px] tracking-wider uppercase ${layer.tagColor}`}
                                    >
                                        {layer.tag}
                                    </span>
                                    <span
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${layer.iconBg}`}
                                    >
                                        {layer.icon}
                                    </span>
                                </div>

                                
                                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight mb-2">
                                    {layer.title}
                                </h3>

                                
                                <p className="text-gray-500 text-sm leading-relaxed">{layer.desc}</p>
                            </div>

                            
                            <span className="mt-5 inline-block self-start px-3 py-1 border border-gray-200 rounded-md font-mono text-[10px] tracking-wider text-gray-500 uppercase">
                                {layer.badge}
                            </span>
                        </motion.div>
                    ))}
                </div>

                
                <div className="mt-16 h-px w-full bg-linear-to-r from-transparent via-gray-300 to-transparent" />

                
                <p className="mt-8 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-blue-600 uppercase">
                    ..
                </p>
            </div>
        </section>
    )
}

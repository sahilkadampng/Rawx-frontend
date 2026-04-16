import { motion } from 'framer-motion';
// import Noise from '../components/noise'

export default function Platforms() {
    return (
        <section className="relative py-20 sm:py-28 px-4 overflow-hidden w-full sm:px-6 bg-[#111214]">
            <div className="max-w-6xl mx-auto text-center">
                <div className="max-w-6xl mx-auto text-center">
                    {/* <Noise /> */}
                    {/* Badge */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#685AFF] uppercase mb-6"
                    >
                        ● Target Architectures ●
                    </motion.p>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-xl sm:text-xl md:text-2xl xl:text-6xl font-arimo font-arimo text-white uppercase leading-tight tracking-tight"
                    >
                        Built For{' '}
                        <span className="text-gray-400 text-3xl sm:text-5xl md:text-6xl">→</span>{' '}
                        <span className="text-[#685AFF]">Clients</span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-gray-500 text-base sm:text-[17px] max-w-2xl mx-auto"
                    >
                        RAW reflects how I build: scalable, reliable, and intuitive. Whether you’re developing SaaS, fintech, or marketplace solutions, the infrastructure is designed so creators like me can ship confidently
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-gray-500 uppercase"
                    >
                        Built for clients who don’t just dream — they build businesses that scale.
                    </motion.p>

                    {/* Tags */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="flex flex-wrap justify-center gap-3 mt-4"
                    >
                        {['Built to Grow', 'Trust by Design'].map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-1.5 bg-gray-800/10 border border-gray-700 rounded-md font-mono text-[10px] sm:text-xs tracking-wider text-gray-600 uppercase"
                            >
                                {tag}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Cards */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 lg:mb-0">
                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#06080b] border border-gray-900 rounded-xl p-6 sm:p-8 text-left flex flex-col justify-between min-h-70 hover:shadow-lg hover:border-[#685AFF]"
                    ><div className="-mt-6 lg:-mt-8 h-px w-full bg-linear-to-r from-transparent via-[#685AFF] to-transparent" />
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-500 uppercase">
                                    SaaS Platforms
                                </span>
                                <span className="font-mono text-xs text-gray-300">01</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight mb-3">
                                ResolvexPro
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                A secure platform I built to manage public complaints effortlessly.
                            </p>
                        </div>
                        <a href="https://resolvexpro.vercel.app/" className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-wider text-white uppercase hover:text-[#685AFF] transition-colors">
                            View site <span>→</span>
                        </a>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#06080b] border border-gray-500 rounded-xl p-6 sm:p-8 text-left flex flex-col justify-between min-h-70 hover:shadow-lg"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-500 uppercase">
                                    SaaS Platforms
                                </span>
                                <span className="font-mono text-xs text-gray-300">02</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight mb-3">
                                INVENTOXPRO
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                a smart business engine. Scan, track, update, and manage your entire stock in real-time using your phone and laptop together. Built for speed, accuracy, and modern businesses.
                            </p>
                        </div>
                        <a href="https://inventoxpro.vercel.app/" className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-wider text-white uppercase hover:text-[#685AFF] transition-colors">
                            View site <span>→</span>
                        </a>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#06080b] border border-gray-500 rounded-xl p-6 sm:p-8 text-left flex flex-col justify-between min-h-70 hover:shadow-lg"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-500 uppercase">
                                    N/A
                                </span>
                                <span className="font-mono text-xs text-gray-300">03</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight mb-3">
                                coming soon
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                N/A.
                            </p>
                        </div>
                        <a href="#" className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-wider text-white uppercase hover:text-[#685AFF] transition-colors">
                            N/A <span>→</span>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

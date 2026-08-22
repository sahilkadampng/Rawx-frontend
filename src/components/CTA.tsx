import { useState } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';

function FooterRevealEdge() {
    return (
        <>
            
            <svg
                viewBox="0 0 1440 80"
                className="absolute inset-x-0 bottom-0 h-[28px] w-full sm:hidden"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    d="M0,20 L120,60 L240,20 L360,60 L480,20 L600,60 L720,20 L840,60 L960,20 L1080,60 L1200,20 L1320,60 L1440,20 L1440,80 L0,80 Z"
                    fill="#000000"
                />
            </svg>

            
            <svg
                viewBox="0 0 1440 80"
                className="absolute inset-x-0 bottom-0 hidden h-[40px] w-full sm:block"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    d="M0,20 L30,60 L60,20 L90,60 L120,20 L150,60 L180,20 L210,60 L240,20 L270,60 L300,20 L330,60 L360,20 L390,60 L420,20 L450,60 L480,20 L510,60 L540,20 L570,60 L600,20 L630,60 L660,20 L690,60 L720,20 L750,60 L780,20 L810,60 L840,20 L870,60 L900,20 L930,60 L960,20 L990,60 L1020,20 L1050,60 L1080,20 L1110,60 L1140,20 L1170,60 L1200,20 L1230,60 L1260,20 L1290,60 L1320,20 L1350,60 L1380,20 L1410,60 L1440,20 L1440,80 L0,80 Z"
                    fill="#000000"
                />
            </svg>
        </>
    );
}

export default function CTA() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleSubmit = async () => {
        if (!email) return;
        setSubmitting(true);
        setMessage('');
        try {
            const res = await fetch(`${API_URL}/emails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'cta' }),
            });
            const data = await res.json();
            setMessage(data.message);
            setMessageType(data.status === 'success' ? 'success' : 'error');
            if (data.status === 'success') setEmail('');
        } catch {
            setMessage('Connection failed. Try again later.');
            setMessageType('error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="CTA" className="relative z-10 w-full overflow-hidden rounded-t-[50px] bg-[#f4f6fb] px-4 py-16 pb-24 md:py-24 md:pb-32 flex items-center justify-center scroll-mt-32">
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-3xl bg-[#eceef4]/40 rounded-3xl border border-gray-200/60 shadow-sm px-6 sm:px-12 md:px-16 py-14 md:py-20 flex flex-col items-center text-center"
            >
                
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-bebas text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-gray-900"
                >
                    Have a project in mind?
                </motion.h2>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-[#685AFF]"
                >
                    Let's Talk
                </motion.h2>

                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-5 text-gray-500 text-base sm:text-lg font-arimo max-w-md"
                >
                    Step into your power and build your empire with unwavering confidence.
                </motion.p>

                



                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg"
                >
                    <input
                        type="email"
                        placeholder="Enter work email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 w-full sm:w-auto px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition font-arimo"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !email}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#685AFF] hover:bg-[#364fc7] disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer font-arimo whitespace-nowrap flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Get in Touch'
                        )}
                    </button>
                </motion.div>

                
                {message && (
                    <p className={`mt-3 text-sm font-arimo ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}

                
                <motion.a
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    href="/about"
                    className="mt-5 text-[#685AFF] text-sm font-medium font-arimo hover:underline flex items-center gap-1 transition"
                >
                    Explore About me
                    <span className="text-xs">→</span>
                </motion.a>

                



                


            </motion.div>
            <FooterRevealEdge />
        </section>
    );
}

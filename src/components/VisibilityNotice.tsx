import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function VisibilityNotice({
    title,
    description,
    backHref = '/',
    backLabel = 'Return home',
}: {
    title: string;
    description: string;
    backHref?: string;
    backLabel?: string;
}) {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-[#0f1115] text-white">
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-2xl"
            >
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#685AFF] mb-4">
                    Content restricted
                </p>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight">
                    {title}
                </h1>
                <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                    {description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                        to={backHref}
                        className="inline-flex items-center justify-center rounded-full bg-[#685AFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4f40ff]"
                    >
                        {backLabel}
                    </Link>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-gray-500">
                        MANAGED BY ADMIN
                    </span>
                </div>
            </motion.div>
        </main>
    );
}
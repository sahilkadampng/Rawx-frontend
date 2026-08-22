import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VisibilityNotice from '../components/VisibilityNotice';
import { FeatureGate, useFeatureFlag } from '../context/FeatureFlagContext';


function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}


function CodeBlock({ title, code, lang = 'bash' }: { title: string; code: string; lang?: string }) {

    const [closed, setClosed] = useState(false)
    const [minimized, setMinimized] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)

    useEffect(() => {
        const esc = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false)
        window.addEventListener("keydown", esc)
        return () => window.removeEventListener("keydown", esc)
    }, [])

    if (closed) return null

    return (
        <>
            {fullscreen && (
                <div
                    onClick={() => setFullscreen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                />
            )}

            <motion.div
                layout
                initial={false}
                animate={
                    fullscreen
                        ? {
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            x: "-50%",
                            y: "-50%",
                            width: "90vw",
                            height: "85vh",
                            zIndex: 50,
                        }
                        : { zIndex: 0 }
                }
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="rounded-xl border border-gray-700/50 shadow-xl bg-[#0d1117] overflow-hidden flex flex-col"
            >
                <div className="rounded-xl border border-gray-700/50 shadow-2xl bg-[#0d1117] flex flex-col h-full">
                    
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#121212] border-b border-gray-700/50">
                        <div className="flex items-center gap-2">
                            
                            <span onClick={() => setClosed(true)} className="group traffic-btn bg-[#ff5f57]">
                                <span className="traffic-icon">✕</span>
                            </span>
                            
                            <span onClick={() => setMinimized(!minimized)} className="group traffic-btn bg-[#febc2e]">
                                <span className="traffic-icon">-</span>
                            </span>
                            
                            <span onClick={() => setFullscreen(!fullscreen)} className="group traffic-btn bg-[#28c840]">
                                <span className="traffic-icon">⤢</span>
                            </span>
                            <span className="ml-3 font-mono text-[11px] text-gray-500 tracking-wide">
                                {title}
                            </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-600 uppercase tracking-wider">{lang}</span>
                    </div>
                    
                    {!minimized && (
                        <>
                            
                            <div className="flex-1 overflow-auto p-3 sm:p-5">
                                <div className="flex">
                                    
                                    <div className="mr-3 text-right select-none text-gray-500 text-[11px] sm:text-[13px] font-mono leading-5 sm:leading-6">
                                        {code.split("\n").map((_, i) => (
                                            <div key={i}>{i + 1}</div>
                                        ))}
                                    </div>
                                    
                                    <pre className="flex-1 min-w-0">
                                        <code className="text-[11px] sm:text-[13px] font-mono leading-5 sm:leading-6 text-gray-300 whitespace-pre">
                                            {code.split('\n').map((line, i) => {
                                                if (/^\s*(\/\/|#)/.test(line)) {
                                                    return (
                                                        <div key={i} className="text-green-400/70 italic truncate">
                                                            {line}
                                                        </div>
                                                    )
                                                }
                                                const keywords = ['import', 'export', 'const', 'let', 'async', 'await', 'function', 'return', 'from', 'if', 'try', 'catch']
                                                const functions = ['app.', 'res', 'next', 'jwt', 'Admin', 'express']
                                                const error = ['error']
                                                const key = ['use', 'json']
                                                let highlightedLine = line
                                                keywords.forEach(k => {
                                                    highlightedLine = highlightedLine.replace(
                                                        new RegExp(`\\b${k}\\b`, 'g'),
                                                        `<span class="text-purple-500">${k}</span>`
                                                    )
                                                })
                                                functions.forEach(f => {
                                                    highlightedLine = highlightedLine.replace(
                                                        new RegExp(`\\b${f}\\b`, 'g'),
                                                        `<span class="text-pink-500">${f}</span>`
                                                    )
                                                })
                                                error.forEach(e => {
                                                    highlightedLine = highlightedLine.replace(
                                                        new RegExp(`\\b${e}\\b`, 'g'),
                                                        `<span class="text-red-500">${e}</span>`
                                                    )
                                                })
                                                key.forEach(t => {
                                                    highlightedLine = highlightedLine.replace(
                                                        new RegExp(`\\b${t}\\b`, 'g'),
                                                        `<span class="text-blue-400">${t}</span>`
                                                    )
                                                })
                                                return <div
                                                    key={i}
                                                    className="whitespace-pre"
                                                    dangerouslySetInnerHTML={{ __html: highlightedLine }}
                                                />
                                            })}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                            
                            <div className="h-7 px-3 flex items-center justify-between bg-[#121212] border-t border-white/10 text-[11px] font-mono shrink-0 rounded-b-xl">
                                <span className="text-gray-600 lowercase">
                                    {lang}
                                </span>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span>{code.split('\n').length} lines</span>
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
}


const stackLayers = [
    {
        tag: 'Layer 01',
        tagColor: 'text-blue-600',
        title: 'API Gateway',
        desc: 'Express.js REST API with versioned routes, JSON schema validation, and structured error handling. Every request is authenticated, rate-limited, and logged.',
        features: ['Express.js v5', 'JWT Auth', 'Rate Limiting', 'CORS'],
        code: `

            import express from 'express';
            import cors from 'cors';
            import {checkBlocked, publicLimiter, authLimiter} from '../rateLimiter.js';

            const app = express();

            
            app.set('trust proxy', true);

            
            app.use(cors({
                origin: ['https:/abc.app', 'http://localhost:-0000'],
            credentials: true
}));

            app.use(express.json());
            app.use(checkBlocked);

            
            app.use('/api/v1/auth', auth);
            app.use('/api/v1/emails', public);
            app.use('/api/v1/visitors', publicLimiter);`,
        codeTitle: 'gateway.js',
        codeLang: 'javascript',
    },
    {
        tag: 'Layer 02',
        tagColor: 'text-gray-500',
        title: 'Authentication',
        desc: 'JWT-based auth with bcrypt password hashing, token refresh, and role-based access control. Auto-blocks brute-force attempts.',
        features: ['JWT Tokens', 'bcrypt', 'RBAC', 'Auto-Block'],
        code: `
            import jwt from 'jsonwebtoken';
            import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
    return res.status(401).json({
                status: 'error',
            message: 'Not authorized. Token missing.'
    });
    }

            try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = await Admin.findById(decoded.id);
            next();
    } catch {
    return res.status(401).json({
                status: 'error',
            message: 'Token expired or invalid.'
    });
    }
};`,
        codeTitle: 'auth.middleware.js',
        codeLang: 'javascript',
    },
    {
        tag: 'Layer 03',
        tagColor: 'text-blue-600',
        title: 'Data Layer',
        desc: 'MongoDB with Mongoose ODM — schema-first design with strategic indexing, validation, and aggregation pipelines for complex queries.',
        features: ['MongoDB', 'Mongoose ODM', 'Indexes', 'Aggregation'],
        code: `
            import mongoose from 'mongoose';

            const visitorSchema = new mongoose.Schema({
                ip:       {type: String, required: true },
            device:   {type: String, default: 'Unknown' },
            browser:  {type: String, default: 'Unknown' },
            os:       {type: String, default: 'Unknown' },
            page:     {type: String, default: '/' },
            country:  {type: String, default: 'Unknown' },
            city:     {type: String, default: 'Unknown' },
            region:   {type: String, default: 'Unknown' },
}, {timestamps: true });

            
            visitorSchema.index({ip: 1 });
            visitorSchema.index({createdAt: -1 });

            const Visitor = mongoose.model('Visitor', visitorSchema);`,
        codeTitle: 'Visitor.model.js',
        codeLang: 'javascript',
    },
    {
        tag: 'Layer 04',
        tagColor: 'text-gray-500',
        title: 'Rate Limiting',
        desc: 'Tiered rate limiting per endpoint type using express-rate-limit. Auth abuse auto-blocks IPs. Returns structured 429 responses.',
        features: ['Public: 100/min', 'Auth: 10/min', 'Admin: 20/min', 'Auto-Block'],
        code: `
            import rateLimit from 'express-rate-limit';

            
            export const publicLimiter = rateLimit({
                windowMs: 60 * 1000,
            max: 100,
            standardHeaders: true,
            message: {
                status: 'error',
            message: 'Too many requests, please try again later.'
  }
});

            
            export const authLimiter = rateLimit({
                windowMs: 60 * 1000,
            max: 10,
            standardHeaders: true,
            message: {
                status: 'error',
            message: 'Too many requests, please try again later.'
  }
});

            
            export const adminLimiter = rateLimit({
                windowMs: 60 * 1000,
            max: 20,
            standardHeaders: true,
            message: {
                status: 'error',
            message: 'Too many requests, please try again later.'
  }
});`,
        codeTitle: 'rateLimiter.js',
        codeLang: 'javascript',
    },
    {
        tag: 'Layer 05',
        tagColor: 'text-blue-600',
        title: 'Frontend Client',
        desc: 'React 19 with TypeScript, Tailwind CSS, Framer Motion animations, and a visitor tracking hook. Deployed on Vercel with edge caching.',
        features: ['React 19', 'TypeScript', 'Tailwind v4', 'Framer Motion'],
        code: `
            import {useEffect} from 'react';
            import {useLocation} from 'react-router-dom';
            import {API_URL} from '../config/api';

            export function useVisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      const {device, browser, os} = getDeviceInfo();
            const clientIP = await getPublicIP();

            await fetch(\`\${API_URL}/visitors/track\`, {
                method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: location.pathname,
            referrer: document.referrer || 'direct',
            device, browser, os, clientIP
        })
      });
    };

            track();
  }, [location.pathname]);
}`,
        codeTitle: 'useVisitorTracker.ts',
        codeLang: 'typescript',
    },
    {
        tag: 'Layer 06',
        tagColor: 'text-gray-500',
        title: 'Deployment Pipeline',
        desc: 'Backend on Render with auto-deploy from GitHub. Frontend on Vercel with edge functions. MongoDB Atlas for managed database.',
        features: ['Render', 'Vercel', 'MongoDB Atlas', 'GitHub CI'],
        code: `# Deployment configuration
            # ── Backend (Render) ──────────────
            # Build Command:
            npm install

            # Start Command:
            node index.js

            # Environment Variables:
            MONGODB_URI=mongodb+srv://...
            JWT_SECRET=<secure-random-key>
                FRONTEND_URL=https://abc.com

                # ── Frontend (Vercel) ─────────────
                # Framework: Vite
                # Build: npm run build
                # Output: dist/

                # vercel.json
                {
                    "rewrites": [
                {"source": "/(.*)", "destination": "/" }
                ]
}`,
        codeTitle: 'deploy.config',
        codeLang: 'shell',
    },
];

const techStack = [
    { name: 'Node.js', category: 'Runtime' },
    { name: 'Express.js', category: 'Framework' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Mongoose', category: 'ODM' },
    { name: 'React 19', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Tailwind v4', category: 'Styling' },
    { name: 'Framer Motion', category: 'Animation' },
    { name: 'JWT', category: 'Auth' },
    { name: 'bcrypt', category: 'Security' },
    { name: 'Vercel', category: 'Hosting' },
    { name: 'Render', category: 'Backend' },
];

export default function Infrastructure() {
    const pageVisible = useFeatureFlag('page.infrastructure');
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

    if (!pageVisible) {
        return (
            <VisibilityNotice
                title="Infrastructure"
                description="The Infrastructure page is currently disabled by the site administrator."
                backHref="/"
                backLabel="Back to home"
            />
        );
    }

    return (
        <>
            <Navbar />
            <main className="bg-[#121212] min-h-screen overflow-hidden">
                <FeatureGate flagKey="content.infrastructure.hero">
                    <section ref={heroRef} className="relative pt-32 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }} />

                        <motion.div
                            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
                            className="max-w-6xl mx-auto text-center relative z-10"
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#685AFF] uppercase mb-6"
                            >
                                ● Infrastructure :: Overview ●
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-gray-100 uppercase leading-[0.95] tracking-tight"
                            >
                                The Stack
                                <br />
                                <span className="text-[#685AFF]">Under The Hood.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-6 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto"
                            >
                                A deep dive into every layer of the system — from API gateway to deployment pipeline.
                                Real code. Real architecture. Production-grade.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.55 }}
                                className="flex flex-wrap justify-center gap-3 mt-8"
                            >
                                {['Express.js', 'MongoDB', 'React', 'TypeScript', 'JWT', 'Vercel'].map((tag, index) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
                                        className="px-4 py-1.5 border border-gray-700 rounded-md font-mono text-[10px] sm:text-xs tracking-wider text-gray-600 uppercase hover:border-gray-500 hover:text-[#685AFF] transition-colors cursor-default"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
                        >
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-5 h-8 border-2 border-gray-300 rounded-full flex items-start justify-center p-1"
                            >
                                <motion.span className="w-1 h-2 bg-gray-400 rounded-full" />
                            </motion.div>
                        </motion.div>
                    </section>
                </FeatureGate>

                <FeatureGate flagKey="content.infrastructure.stack">
                    <section className="px-4 sm:px-6 pb-20">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {stackLayers.map((layer, index) => (
                                    <Reveal key={layer.title} delay={index * 0.05} className="w-full">
                                        <div className="bg-[#1c1c1c] border border-gray-700 rounded-2xl p-5 sm:p-7 h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-5">
                                                <span className={`font-mono text-[10px] tracking-wider uppercase ${layer.tagColor}`}>{layer.tag}</span>
                                                <span className="font-mono text-xs text-gray-400">{String(index + 1).padStart(2, '0')}</span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-100 uppercase tracking-tight mb-4">
                                                {layer.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-5">{layer.desc}</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {layer.features.map((feature) => (
                                                    <span key={feature} className="px-2.5 py-1 border border-gray-700 rounded-md font-mono text-[10px] tracking-wider text-gray-500 uppercase">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="mt-auto">
                                                <CodeBlock title={layer.codeTitle} code={layer.code} lang={layer.codeLang} />
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>
                </FeatureGate>

                <section className="px-4 sm:px-6 pb-14 sm:pb-24 bg-[#1c1c1c] border-b border-gray-600">
                    <div className="max-w-6xl mx-auto py-12 sm:py-20">
                        <Reveal>
                            <div className="text-center mb-8 sm:mb-14">
                                <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase mb-4">
                                    Technologies :: Stack
                                </p>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-100 uppercase tracking-tight">
                                    Built <span className="text-[#685AFF]">With.</span>
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {techStack.map((tech) => (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-[#121212] border border-gray-800 rounded-xl p-4 text-center hover:border-gray-800 hover:shadow-md"
                                >
                                    <p className="text-sm font-bold text-[#685AFF]">{tech.name}</p>
                                    <p className="font-mono text-[9px] tracking-wider text-gray-400 uppercase mt-1">{tech.category}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-4 sm:px-6 py-14 sm:py-24 bg-[#1c1c1c]">
                    <div className="max-w-4xl mx-auto">
                        <Reveal>
                            <div className="text-center mb-14">
                                <p className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase mb-4">
                                    System :: Flow
                                </p>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-100 uppercase tracking-tight">
                                    Request <span className="text-[#685AFF]">Lifecycle.</span>
                                </h2>
                            </div>
                        </Reveal>

                        <div className="space-y-0">
                            {[
                                { step: '01', label: 'Client Request', detail: 'React app sends HTTP request with JWT token', color: 'bg-[#121212]' },
                                { step: '02', label: 'Rate Limiter', detail: 'express-rate-limit enforces per-endpoint limits', color: 'bg-[#121212]' },
                                { step: '03', label: 'Auth Middleware', detail: 'JWT verification and role-based access control', color: 'bg-[#121212]' },
                                { step: '04', label: 'Route Handler', detail: 'Business logic execution with input validation', color: 'bg-[#121212]' },
                                { step: '05', label: 'Database Query', detail: 'Mongoose ODM with indexed queries to MongoDB Atlas', color: 'bg-[#121212]' },
                                { step: '06', label: 'JSON Response', detail: 'Structured response with status, data, and metadata', color: 'bg-[#121212]' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="relative"
                                >
                                    <div className={`flex items-center gap-4 pl-4 p-4 sm:p-5 rounded-xl border ${item.color} hover:shadow-md transition-all duration-200`}>
                                        <span className="w-10 h-10 shrink-0 rounded-lg bg-[#1c1c1c] border border-gray-200 flex items-center justify-center font-mono text-xs font-bold text-gray-500">
                                            {item.step}
                                        </span>
                                        <div className="justify-start">
                                            <p className="font-bold flex text-[#685AFF] text-sm uppercase tracking-tight">{item.label}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{item.detail}</p>
                                        </div>
                                    </div>
                                    {index < 5 && (
                                        <div className="flex justify-center py-1">
                                            <motion.div
                                                initial={{ scaleY: 0 }}
                                                whileInView={{ scaleY: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: index * 0.08 + 0.3 }}
                                                className="w-px h-6 bg-gray-300 origin-top"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pt-20 px-4 sm:px-6 pb-20">
                    <div className="max-w-4xl mx-auto">
                        <Reveal>
                            <div className="bg-[#1c1c1c] rounded-2xl p-8 sm:p-12 text-center border-gray-700/30">
                                <p className="font-mono text-[10px] tracking-[0.3em] text-[#685AFF] uppercase mb-4">
                                    ● System :: Status ●
                                </p>
                                <h3 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-3">
                                    All Systems <span className="text-[#685AFF]">Operational.</span>
                                </h3>
                                <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
                                    This infrastructure runs 24/7 on Render and Vercel. Every request is authenticated,
                                    rate-limited, and monitored. Built to scale.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121212] border border-green-700/30 font-mono text-[10px] text-green-400 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        API Online
                                    </span>
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121212] border border-green-700/30 font-mono text-[10px] text-green-400 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        DB Connected
                                    </span>
                                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121212] border border-green-700/30 font-mono text-[10px] text-green-400 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        CDN Active
                                    </span>
                                </div>
                            </div>
                        </Reveal>

                        <div className="mt-16 h-px w-full bg-linear-to-r from-transparent via-gray-300 to-transparent" />
                        <p className="mt-8 text-center font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase">
                            Every layer. Production grade. Open source.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

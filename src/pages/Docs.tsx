import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VisibilityNotice from '../components/VisibilityNotice';
import { useFeatureFlag } from '../context/FeatureFlagContext';

type SectionKey = 'getting-started' | 'api-reference' | 'auth' | 'database' | 'deployment' | 'rate-limiting';

interface DocSection {
    title: string;
    tag: string;
    content: { heading: string; code?: string; text: string }[];
}

// Terminal panel component — renders code blocks in a macOS-style terminal window
function TerminalPanel({ title, code }: { title: string; code: string }) {
    const [copied, setCopied] = useState(false)
    const [closed, setClosed] = useState(false)
    const [minimized, setMinimized] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)

    useEffect(() => {
        const esc = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false)
        window.addEventListener("keydown", esc)
        return () => window.removeEventListener("keydown", esc)
    }, [])

    if (closed) return null

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

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
                className="rounded-xl border border-gray-700/50 shadow-xl bg-[#0d1117] overflow-hidden"
            >
                <div className="rounded-xl overflow-hidden border border-gray-700/50 bg-[#0d1117] flex flex-col h-full">
                    {/* Terminal title bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#121212] border-b border-gray-700/50">
                        <div className="flex items-center gap-2">
                            {/* CLOSE */}
                            <span onClick={() => setClosed(true)} className="group traffic-btn bg-[#ff5f57]">
                                <span className="traffic-icon">✕</span>
                            </span>
                            {/* MINIMIZE */}
                            <span onClick={() => setMinimized(!minimized)} className="group traffic-btn bg-[#febc2e]">
                                <span className="traffic-icon">-</span>
                            </span>
                            {/* FULLSCREEN */}
                            <span onClick={() => setFullscreen(!fullscreen)} className="group traffic-btn bg-[#28c840]">
                                <span className="traffic-icon">⤢</span>
                            </span>
                            <span className="ml-3 font-mono text-[11px] text-gray-500 tracking-wide">
                                {title}
                            </span>
                        </div>
                        <button onClick={handleCopy} className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white">
                            {copied ? '✓ Copied' : 'Copy'}
                        </button>
                    </div>
                    {/* Terminal content with line numbers */}
                    {!minimized && (
                        <div className="p-4 overflow-auto flex-1">
                            <div className="flex text-left">
                                {/* Line Numbers */}
                                <div className="select-none pr-4 border-r border-gray-700/30 mr-4 flex flex-col">
                                    {code.split('\n').map((_, i) => (
                                        <div
                                            key={i}
                                            className="text-right font-mono text-[11px] leading-6 text-gray-600 min-w-8"
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>

                                {/* Code Content */}
                                <pre className="flex-1 m-0 p-0">
                                    <code className="text-[13px] font-mono leading-6 text-gray-300 whitespace-pre wrap-break-words">
                                        {code.split('\n').map((line, i) => {
                                            // Highlight comments
                                            if (/^\s*(#|\/\/)/.test(line)) {
                                                return (
                                                    <div key={i} className="text-gray-500 italic">
                                                        {line}
                                                    </div>
                                                );
                                            }
                                            // Highlight keywords/functions (optional)
                                            const keywords = ['import', 'export', 'const', 'let', 'async', 'await', 'function', 'return', 'from', 'if', 'try', 'catch'];
                                            const functions = ['app', 'res', 'next', 'jwt', 'Admin'];
                                            let highlighted = line;
                                            // Wrap keywords in cyan
                                            keywords.forEach(k => {
                                                const regex = new RegExp(`\\b${k}\\b`, 'g');
                                                highlighted = highlighted.replace(regex, `%${k}%`);
                                            });
                                            // Wrap functions in orange
                                            functions.forEach(f => {
                                                const regex = new RegExp(`\\b${f}\\b`, 'g');
                                                highlighted = highlighted.replace(regex, `#${f}#`);
                                            });
                                            // Split by placeholders and render
                                            const parts = highlighted.split(/(%|#)/);
                                            return (
                                                <div
                                                    key={i}
                                                    className="hover:bg-gray-800/30 -mx-2 px-2 rounded transition"
                                                >
                                                    {parts.map((p, idx) => {
                                                        if (p.startsWith('%')) return <span key={idx} className="text-cyan-400">{p.slice(1)}</span>;
                                                        if (p.startsWith('#')) return <span key={idx} className="text-orange-400">{p.slice(1)}</span>;
                                                        return <span key={idx}>{p}</span>;
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    )}
                    {/* Terminal status bar */}
                    <div className="px-4 py-1.5 bg-[#121212] border-t border-gray-700/50 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-gray-600">bash</span>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-gray-600">{code.split('\n').length} lines</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </div>
                </div>
                {/* {fullscreen && (
                    <div
                        onClick={() => setFullscreen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                    />
                )} */}
            </motion.div>
        </>
    )
}
const sections: Record<SectionKey, DocSection> = {
    'getting-started': {
        title: 'Getting Started',
        tag: 'Quickstart',
        content: [
            {
                heading: 'Installation',
                code: `# Clone the repository
            git clone https://github.com/sahilkadampng/project.git
            cd project

            # Install dependencies
            npm install

            # Start development server
            npm run dev`,
                text: 'Clone the repo, install dependencies, and start the dev server. The application runs on port 3000 by default.',
            },
            {
                heading: 'Environment Setup',
                code: `# .env configuration
            PORT=3000
            MONGODB_URI=mongodb://localhost:27017/mydb
            JWT_SECRET=your-secret-key
            JWT_EXPIRY=7d
            NODE_ENV=development`,
                text: 'Create a .env file in the root directory. All environment variables are validated at startup.',
            },
        ],
    },
    'api-reference': {
        title: 'API Reference',
        tag: 'Endpoints',
        content: [
            {
                heading: 'Base URL & Headers',
                code: `// Base URL
            https://api.example.com/v1

            // Required Headers
            Content-Type: application/json
            Authorization: Bearer <token>`,
                text: 'All API requests require JSON content type. Protected routes need a valid JWT in the Authorization header.',
            },
            {
                heading: 'Response Format',
                code: `// Success Response
                {
                    "status": "success",
                "data": {... },
                "meta": {
                    "page": 1,
                "total": 42,
                "limit": 10
  }
}

                // Error Response
                {
                    "status": "error",
                "message": "Validation failed",
                "errors": [
                {"field": "email", "message": "Invalid format" }
                ]
}`,
                text: 'All responses follow a consistent schema. Pagination metadata is included for list endpoints.',
            },
            {
                heading: 'Users Endpoint',
                code: `GET    /api/v1/users          // List users
                GET    /api/v1/users/:id      // Get user
                POST   /api/v1/users          // Create user
                PATCH  /api/v1/users/:id      // Update user
                DELETE /api/v1/users/:id      // Delete user`,
                text: 'Full CRUD operations with role-based access control. Admin routes require elevated permissions.',
            },
        ],
    },
    auth: {
        title: 'Authentication',
        tag: 'Security',
        content: [
            {
                heading: 'Login Flow',
                code: `POST /api/v1/auth/login
                {
                    "email": "user@example.com",
                "password": "securePassword123"
}

                // Response
                {
                    "status": "success",
                "token": "eyJhbGciOiJIUzI1NiIs...",
                "refreshToken": "dGhpcyBpcyBhIHJl...",
                "expiresIn": "7d"
}`,
                text: 'Login returns a JWT access token and a refresh token. Store tokens securely — never in localStorage for production.',
            },
            {
                heading: 'Token Refresh',
                code: `POST /api/v1/auth/refresh
                {
                    "refreshToken": "dGhpcyBpcyBhIHJl..."
}

                // Response
                {
                    "token": "eyJhbGciOiJIUzI1NiIs...",
                "expiresIn": "7d"
}`,
                text: 'Use the refresh endpoint to get a new access token without re-authenticating. Refresh tokens are single-use.',
            },
        ],
    },
    database: {
        title: 'Database',
        tag: 'Data Layer',
        content: [
            {
                heading: 'Schema Design',
                code: `// User Schema (Mongoose)
                const userSchema = new Schema({
                    name:     {type: String, required: true, trim: true },
                email:    {type: String, required: true, unique: true },
                password: {type: String, required: true, select: false },
                role:     {type: String, enum: ['user', 'admin'], default: 'user' },
                active:   {type: Boolean, default: true }
}, {timestamps: true });

                userSchema.index({email: 1 });
                userSchema.index({role: 1, active: 1 });`,
                text: 'All schemas use timestamps and strategic indexing. Sensitive fields like password are excluded from queries by default.',
            },
            {
                heading: 'Query Patterns',
                code: `// Pagination helper
const paginate = async (Model, query, options) => {
  const {page = 1, limit = 10, sort = '-createdAt'} = options;
                const skip = (page - 1) * limit;

                const [data, total] = await Promise.all([
                Model.find(query).sort(sort).skip(skip).limit(limit),
                Model.countDocuments(query)
                ]);

                return {data, total, page, pages: Math.ceil(total / limit) };
};`,
                text: 'Reusable pagination utility. Supports sorting, filtering, and population — optimized for large collections.',
            },
        ],
    },
    'rate-limiting': {
        title: 'Rate Limiting',
        tag: 'Security',
        content: [
            {
                heading: 'Rate Limiter Configuration',
                code: `import rateLimit from 'express-rate-limit';

                // ── PUBLIC LIMITER ──────────────────────────
                // Homepage, fetch products, visitor tracking
                // 100 requests per 1-minute window per IP
                export const publicLimiter = rateLimit({
                    windowMs: 60 * 1000,
                max: 100,
                standardHeaders: true,
                legacyHeaders: false,
                message: {
                    status: 'error',
                message: 'Too many requests, please try again later.'
  }
});

                // ── AUTH LIMITER ────────────────────────────
                // Login, OTP, password reset (sensitive)
                // 10 requests per 1-minute window per IP
                export const authLimiter = rateLimit({
                    windowMs: 60 * 1000,
                max: 10,
                standardHeaders: true,
                legacyHeaders: false,
                message: {
                    status: 'error',
                message: 'Too many requests, please try again later.'
  }
});

                // ── ADMIN LIMITER ───────────────────────────
                // Dashboard actions, CRUD operations
                // 20 requests per 1-minute window per IP
                export const adminLimiter = rateLimit({
                    windowMs: 60 * 1000,
                max: 20,
                standardHeaders: true,
                legacyHeaders: false,
                message: {
                    status: 'error',
                message: 'Too many requests, please try again later.'
  }
});`,
                text: 'Three separate rate limiters for different endpoint tiers. Each returns a 429 status with a custom error message when exceeded.',
            },
            {
                heading: 'Applying Limiters to Routes',
                code: `import express from 'express';
                import {checkBlocked, publicLimiter, authLimiter, adminLimiter} from './middleware/rateLimiter.js';

                const app = express();

                // Block check runs on all routes first
                app.use(checkBlocked);

                // Apply endpoint-specific rate limiters
                app.use('/api/auth', authLimiter, authRoutes);
                app.use('/api/emails', publicLimiter, emailRoutes);
                app.use('/api/visitors', publicLimiter, visitorRoutes);
                app.use('/api/admin', adminLimiter, adminRoutes);`,
                text: 'Mount limiters per route group. Blocked IPs are checked first, then the appropriate rate limiter is applied.',
            },
            {
                heading: 'Rate Limit Summary',
                code: `// ┌──────────────────────────┬──────────────┬────────┐
// │  Endpoint Type           │ Max Requests │ Window │
// ├──────────────────────────┼──────────────┼────────┤
// │  Public (homepage, etc.) │ 100          │ 1 min  │
// │  Auth (login, OTP)       │ 10           │ 1 min  │
// │  Admin (dashboard)       │ 20           │ 1 min  │
// └──────────────────────────┴──────────────┴────────┘
//
// Exceeding limits returns HTTP 429:
// {"status": "error", "message": "Too many requests, please try again later." }
                //
                // Auth abuse auto-blocks the offending IP.`,
                text: 'Rate limits are enforced per IP using express-rate-limit. Auth abuse triggers automatic IP blocking via the BlockedIP model.',
            },
        ],
    },
    deployment: {
        title: 'Deployment',
        tag: 'DevOps',
        content: [
            {
                heading: 'Production Build',
                code: `# Build for production
                npm run build

                # Start production server
                NODE_ENV=production npm start

                # Or use PM2
                pm2 start ecosystem.config.js --env production`,
                text: 'Production builds are optimized with tree-shaking and minification. Use PM2 or Docker for process management.',
            },
            {
                heading: 'Docker Setup',
                code: `# Dockerfile
                FROM node:20-alpine
                WORKDIR /app
                COPY package*.json ./
                RUN npm ci --only=production
                COPY . .
                EXPOSE 3000
                CMD ["node", "dist/server.js"]

                # docker-compose.yml
                services:
                api:
                build: .
                ports: ["3000:3000"]
                env_file: .env
                depends_on: [mongo]
                mongo:
                image: mongo:7
                volumes: [mongo-data:/data/db]`,
                text: 'Docker container with multi-stage builds. Docker Compose for local development with MongoDB.',
            },
        ],
    },
};

const sidebarItems: { key: SectionKey; label: string }[] = [
    { key: 'getting-started', label: 'Getting Started' },
    { key: 'api-reference', label: 'API Reference' },
    { key: 'auth', label: 'Authentication' },
    { key: 'database', label: 'Database' },
    { key: 'rate-limiting', label: 'Rate Limiting' },
    { key: 'deployment', label: 'Deployment' },
];

export default function Docs() {
    const [active, setActive] = useState<SectionKey>('getting-started');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const section = sections[active];
    const pageVisible = useFeatureFlag('page.docs');

    if (!pageVisible) {
        return (
            <VisibilityNotice
                title="Docs"
                description="The documentation page is currently disabled by the site administrator."
                backHref="/"
                backLabel="Back to home"
            />
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 bg-[#121212]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#685AFF] uppercase mb-6"
                        >
                            ● Documentation :: Reference ●
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-100 uppercase leading-tight tracking-tight"
                        >
                            API <span className="text-[#685AFF]">Docs.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto"
                        >
                            Everything you need to understand, integrate, and deploy.
                        </motion.p>
                    </div>

                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden w-full mb-4 px-4 py-3 bg-[#121212] border border-gray-700 rounded-xl font-mono text-sm text-gray-300 flex items-center justify-between"
                    >
                        <span>{section.title}</span>
                        <span className="text-gray-400">{sidebarOpen ? '▲' : '▼'}</span>
                    </button>

                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <motion.aside
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}
                        >
                            <div className="bg-[#1c1c1c] border border-gray-700 rounded-xl p-4 sticky top-28">
                                <p className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4 px-2">
                                    Navigation
                                </p>
                                <nav className="space-y-1">
                                    {sidebarItems.map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => { setActive(item.key); setSidebarOpen(false); }}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-arimo transition-colors cursor-pointer ${active === item.key
                                                ? 'bg-[#121212] text-[#685AFF] font-semibold'
                                                : 'text-gray-600 hover:bg-[#121212] hover:text-gray-100'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>

                                {/* Terminal-style status in sidebar */}
                                <div className="mt-6 bg-[#0d1117] rounded-lg p-3 border border-gray-700/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-mono text-[10px] text-green-400">SYSTEM ONLINE</span>
                                    </div>
                                    <p className="font-mono text-[9px] text-gray-500 leading-relaxed">
                                        API v2.4 :: Express.js<br />
                                        Rate Limited :: Active<br />
                                        Last updated: Feb 2026
                                    </p>
                                </div>
                            </div>
                        </motion.aside>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-[#1c1c1c] border border-gray-700 rounded-xl p-6 sm:p-10"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 bg-[#0d1117] border border-gray-700 rounded-md font-mono text-[10px] tracking-wider text-[#685AFF] uppercase">
                                            {section.tag}
                                        </span>
                                        <span className="font-mono text-[10px] tracking-wider text-gray-400 uppercase">
                                            Last updated: Feb 2026
                                        </span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#685AFF] uppercase tracking-tight mb-8">
                                        {section.title}
                                    </h2>

                                    <div className="space-y-10">
                                        {section.content.map((block, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                            >
                                                <h3 className="text-lg font-bold text-gray-400 mb-3">{block.heading}</h3>
                                                {block.code && (
                                                    <TerminalPanel
                                                        title={`${section.title.toLowerCase().replace(/\s+/g, '-')} — ${block.heading.toLowerCase()}`}
                                                        code={block.code}
                                                    />
                                                )}
                                                <p className="text-gray-500 text-sm leading-relaxed">{block.text}</p>
                                                {i < section.content.length - 1 && (
                                                    <div className="mt-8 h-px bg-gray-100" />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Prev / Next nav */}
                            <div className="mt-6 flex justify-between">
                                {(() => {
                                    const idx = sidebarItems.findIndex((s) => s.key === active);
                                    const prev = idx > 0 ? sidebarItems[idx - 1] : null;
                                    const next = idx < sidebarItems.length - 1 ? sidebarItems[idx + 1] : null;
                                    return (
                                        <>
                                            {prev ? (
                                                <button onClick={() => setActive(prev.key)} className="px-4 py-2 bg-[#121212] border border-gray-700 rounded-lg font-mono text-xs text-[#685AFF] hover:text-[#5a4bff] hover:border-gray-600 transition cursor-pointer">
                                                    ← {prev.label}
                                                </button>
                                            ) : <span />}
                                            {next ? (
                                                <button onClick={() => setActive(next.key)} className="px-4 py-2 bg-[#121212] border border-gray-700 rounded-lg font-mono text-xs text-[#685AFF] hover:text-[#5a4bff] hover:border-gray-600 transition cursor-pointer">
                                                    {next.label} →
                                                </button>
                                            ) : <span />}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'



type StepKey = 'discover' | 'architect' | 'build'

interface ValidationItem {
    label: string
}

interface ProcessingItem {
    step: number
    label: string
}

interface StatusBadge {
    label: string
    color: 'blue' | 'green' | 'amber'
}

interface CodeLine {
    indent?: number
    text: string
    color?: string
}

interface StepConfig {
    title: string
    badge: string
    badgeStyle: string
    description: string
    terminal: {
        stepLabel: string
        leftTitle: string
        leftItems: ValidationItem[]
        rightTitle: string
        rightItems: ProcessingItem[]
        statuses: StatusBadge[]
        codeSnippet: CodeLine[]
    }
}


const stepsConfig: Record<StepKey, StepConfig> = {
    discover: {
        title: 'Problem Understanding',
        badge: 'DISCOVER',
        badgeStyle: 'border border-gray-300 text-gray-400',
        description:
            'Validate requirements, define DB schema, plan scalable architecture.',
        terminal: {
            stepLabel: 'DISCOVER::ACTIVE',
            leftTitle: 'Header Validation',
            leftItems: [
                { label: 'Requirements Parsed' },
                { label: 'Data Models Generated' },
                { label: 'Architecture Planned' },
            ],
            rightTitle: 'Processing',
            rightItems: [{ step: 1, label: 'Problem Context Analyzed' }, { step: 2, label: 'Entities & Relations Mapped' }, { step: 3, label: 'Scalable Pattern Selected' },],
            statuses: [
                { label: 'Blueprint Ready', color: 'blue' },
                { label: 'Awaiting Architecture', color: 'amber' },
            ],
            codeSnippet: [
                { text: '// schema/subscription.model.ts', color: 'text-gray-400' },
                { text: 'const SubscriptionSchema = new Schema({', color: 'text-gray-700' },
                { indent: 1, text: 'organization: { type: ObjectId, ref: "Org" },', color: 'text-green-600' },
                { indent: 1, text: 'plan: { type: String, enum: ["FREE","PRO","ENTERPRISE"] },', color: 'text-green-600' },
                { indent: 1, text: 'startDate: { type: Date, required: true },', color: 'text-blue-600' },
                { indent: 1, text: 'endDate: { type: Date, required: true },', color: 'text-blue-600' },
                { indent: 1, text: 'status: { type: String, default: "active" },', color: 'text-amber-600' },
                { text: '});', color: 'text-gray-700' },
            ],
        },
    },
    architect: {
        title: 'System Design & Security',
        badge: 'ARCHITECT',
        badgeStyle: 'border border-gray-300 text-gray-500',
        description:
            'JWT auth, RBAC, rate limiting, API structure, production folder setup.',
        terminal: {
            stepLabel: 'ARCHITECT::ACTIVE',
            leftTitle: 'Security Layer',
            leftItems: [
                { label: 'JWT Strategy Applied' },
                { label: 'Role Based Access Defined' },
                { label: 'Rate Limiter Configured' },
            ],
            rightTitle: 'System Design',
            rightItems: [
                { step: 1, label: 'API Gateway Structured' },
                { step: 2, label: 'Service Layer Separated' },
                { step: 3, label: 'Database Optimized' },
            ],
            statuses: [
                { label: 'Secure', color: 'green' },
                { label: 'Production Ready', color: 'green' },
            ],
            codeSnippet: [
                { text: '// middleware/auth.middleware.ts', color: 'text-gray-400' },
                { text: 'export const protect = async (req, res, next) => {', color: 'text-gray-700' },
                { indent: 1, text: 'const token = req.headers.authorization?.split(" ")[1];', color: 'text-blue-600' },
                { indent: 1, text: 'if (!token) throw new AuthError(401);', color: 'text-red-500' },
                { indent: 1, text: 'const decoded = jwt.verify(token, SECRET);', color: 'text-green-600' },
                { indent: 1, text: 'req.user = await User.findById(decoded.id);', color: 'text-green-600' },
                { indent: 1, text: 'checkRole(req.user, ["admin", "editor"]);', color: 'text-purple-600' },
                { indent: 1, text: 'next();', color: 'text-gray-700' },
                { text: '};', color: 'text-gray-700' },
            ],
        },
    },
    build: {
        title: 'Development & Integration',
        badge: 'BUILD',
        badgeStyle: 'border border-gray-300 text-gray-500',
        description:
            'REST APIs, WebSockets, payments, third-party integrations, deployment.',
        terminal: {
            stepLabel: 'BUILD::ACTIVE',
            leftTitle: 'Development',
            leftItems: [
                { label: 'REST Endpoints Created' },
                { label: 'Realtime Services Connected' },
                { label: 'Payment Integration Ready' },
            ],
            rightTitle: 'Deployment',
            rightItems: [
                { step: 1, label: 'Dockerized' },
                { step: 2, label: 'CI/CD Pipeline Active' },
                { step: 3, label: 'Live Environment Synced' },
            ],
            statuses: [
                { label: 'Build Successful', color: 'green' },
                { label: 'System Live', color: 'green' },
            ],
            codeSnippet: [
                { text: '// routes/payment.routes.ts', color: 'text-gray-400' },
                { text: 'router.post("/checkout", protect, async (req, res) => {', color: 'text-gray-700' },
                { indent: 1, text: 'const session = await stripe.checkout.sessions.create({', color: 'text-blue-600' },
                { indent: 2, text: 'payment_method_types: ["card"],', color: 'text-green-600' },
                { indent: 2, text: 'line_items: req.body.items,', color: 'text-green-600' },
                { indent: 2, text: 'mode: "subscription",', color: 'text-purple-600' },
                { indent: 2, text: 'success_url: REDIRECT_URL,', color: 'text-amber-600' },
                { indent: 1, text: '});', color: 'text-blue-600' },
                { indent: 1, text: 'res.json({ url: session.url });', color: 'text-gray-700' },
                { text: '});', color: 'text-gray-700' },
            ],
        },
    },
}

const stepOrder: StepKey[] = ['discover', 'architect', 'build']


const contentVariants = {
    initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.2 } },
}

const itemVariants = {
    initial: { opacity: 0, x: -8 },
    animate: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: 0.00 * i, duration: 0.0 },
    }),
}

const statusColors: Record<string, { bg: string; dot: string; text: string }> = {
    blue: { bg: 'bg-transparent', dot: 'bg-blue-500', text: 'text-[#685AFF]' },
    green: { bg: 'bg-transparent', dot: 'bg-green-500', text: 'text-[#685AFF]' },
    amber: { bg: 'bg-transparent', dot: 'bg-amber-500', text: 'text-[#685AFF]' },
}



function BlinkingCursor() {
    return (
        <motion.span
            className="inline-block w-2 h-4 bg-blue-500 ml-1 align-middle rounded-sm"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.0, repeat: Infinity, repeatType: 'reverse' }}
        />
    )
}

function ProcessingDots() {
    return (
        <span className="inline-flex gap-0.5 ml-2">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-blue-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
            ))}
        </span>
    )
}

function TimelineStep({
    config,
    isActive,
    onClick,
}: {
    config: StepConfig
    isActive: boolean
    onClick: () => void
}) {
    return (
        <motion.div
            onClick={onClick}
            className={`font-bebas relative cursor-pointer py-4 rounded-lg transition-colors ${isActive ? 'shadow-pink-500' : 'hover:text-pink-500'
                }`}
        >
            <div className="pl-0 lg:pl-8 sm:pl-4">
                <div className="flex items-center gap-3 mb-1.5 justify-start">
                    <h3
                        className={`text-lg font-extrabold uppercase tracking-wide transition-colors flex justify-start ${isActive ? 'text-white' : 'text-gray-600'
                            }`}
                    >
                        {config.title}
                    </h3>

                    <span
                        className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded border-2 ${isActive ? 'text-[#685AFF]' : config.badgeStyle
                            }`}
                    >
                        {config.badge}
                    </span>
                </div>

                <p
                    className={`text-sm flex justify-start ${isActive ? 'text-gray-400' : 'text-gray-600'
                        }`}
                >
                    {config.description}
                </p>
            </div>
        </motion.div>
    )
}

function TerminalPanel({ config, activeStep }: { config: StepConfig['terminal']; activeStep: StepKey }) {
    return (
        <div className="font-arimo mt-20 bg-[#06080b]/20 border border-gray-800 rounded-md overflow-hidden w-full">
            
            <div className="px-3 bg-[#121212] sm:px-6 py-3 sm:py-4 flex flex-col max-w-7xl sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-b border-[#121212">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="font-bebas text-[10px] sm:text-xs text-gray-500 ml-2 tracking-wider">
                        SYSTEM_STATE :: DEV_WORKFLOW
                    </span>
                    <ProcessingDots />
                </div>
                <motion.span
                    key={config.stepLabel}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase border border-[#685AFF] text-[#685AFF] rounded"
                >
                    {config.stepLabel}
                </motion.span>
            </div>

            
            <div className="h-2 bg-[#121212] border-b border-[#121212] flex">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-[#121212]" />
                ))}
            </div>

            
            <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <motion.span
                        className="w-2 h-2 rounded-full bg-[#685AFF]"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0 / 0, repeat: Infinity }}
                    />
                    <span className="font-bebas text-xs font-bold text-[#685AFF] tracking-wider uppercase">
                        {config.leftTitle}
                    </span>
                    <BlinkingCursor />
                </div>
                <span className="font-bebas text-xs text-gray-200">
                    {String(stepOrder.indexOf(activeStep) + 1).padStart(2, '0')} / {String(stepOrder.length).padStart(2, '0')}
                </span>
            </div>

            
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="px-3 sm:px-6 pb-4 sm:pb-6 min-h-0 sm:min-h-80"
                >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-7xl">
                        
                        <div className="flex flex-col gap-4 sm:gap-6 w-full sm:w-1/2"> 
                            
                            <div>
                                <p className="font-bebas text-[10px] tracking-wider text-gray-200 uppercase mb-3">
                                    {config.leftTitle}
                                </p>
                                <div className="space-y-2">
                                    {config.leftItems.map((item, i) => (
                                        <motion.div
                                            key={item.label}
                                            custom={i}
                                            variants={itemVariants}
                                            initial="initial"
                                            animate="animate"
                                            className="px-4 py-2.5 border border-gray-900 rounded-lg font-bebas text-sm text-gray-500 flex items-center gap-2"
                                        >
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.15 * i + 0.3, type: 'spring' }}
                                                className="text-green-500 text-xs"
                                            >
                                                ✔
                                            </motion.span>
                                            {item.label}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            
                            <div>
                                <p className="font-bebas text-[10px] tracking-wider text-gray-200 uppercase mb-3">
                                    {config.rightTitle}
                                </p>
                                <div className="space-y-2">
                                    {config.rightItems.map((item, i) => (
                                        <motion.div
                                            key={item.label}
                                            custom={i}
                                            variants={itemVariants}
                                            initial="initial"
                                            animate="animate"
                                            className="flex items-center gap-3"
                                        >
                                            <span className="w-5 h-5 rounded bg-gray-700 text-[10px] font-bold text-gray-400 flex items-center justify-center shrink-0">
                                                {item.step}
                                            </span>
                                            <span className="font-bebas text-sm text-gray-500">{item.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        
                        <div className="hidden sm:block w-px bg-[#685AFF]" />

                        
                        <div className="flex-1 min-w-0 w-full sm:w-1/2"> 
                            
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-bebas text-[10px] tracking-wider text-gray-200 uppercase">
                                    Source Preview
                                </p>
                                <span className="font-bebas text-[10px] text-pink-500">.ts</span>
                            </div>

                            
                            <div className="w-full bg-gray-50 border border-gray-100 rounded-md p-4 font-mono text-xs leading-relaxed overflow-x-auto">
                                <div className="min-w-max">
                                    {config.codeSnippet.map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0 * i, duration: 0.25 }}
                                            className="flex"
                                        >
                                            
                                            <div style={{ width: (line.indent ?? 0) * 16 }} />
                                            
                                            <span className={`${line.color ?? 'text-gray-700'} whitespace-pre`}>
                                                {line.text}
                                            </span>
                                        </motion.div>
                                    ))}
                                    <BlinkingCursor />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            
            <div className="font-arimo px-3 bg-gray-600/20 sm:px-6 py-3 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
                <p className="font-bebas text-[10px] tracking-wider text-gray-400 uppercase mr-2">
                    Status
                </p>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep + '-status'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3"
                    >
                        {config.statuses.map((s) => {
                            const c = statusColors[s.color]
                            return (
                                <span
                                    key={s.label}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${c.bg} font-bebas text-xs ${c.text}`}
                                >
                                    <span className={`w-2 h-2 rounded-full bg-gray-500 ${c.dot}`}></span>
                                    {s.label}
                                </span>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}


export default function Workflow() {
    const [activeStep, setActiveStep] = useState<StepKey>('discover')
    const active = stepsConfig[activeStep]

    return (
        <section className="relative z-10 w-full py-16 sm:py-24 overflow-hidden bg-[#06080b]">
            
            
            <div className="relative z-20 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-350 mx-auto px-0 sm:px-6 lg:px-10 xl:px-16">

                <div className="flex flex-col lg:flex-row gap-0 xl:gap-16 items-start px-4 lg:px-16">

                    
                    <div className="w-full lg:w-1/2">
                        <p className="font-mono text-xs tracking-[0.2em] text-[#685AFF] uppercase mb-6">
                            Workflow V2.0
                        </p>

                        <h2 className="text-2xl justify-start sm:text-3xl md:text-4xl lg:text-5xl font-arimo text-white uppercase leading-tight tracking-tight">
                            <p className='-mb-6 lg:-mb-16 flex justify-start'>
                                Request
                            </p>
                            <br />
                            <span className="flex items-left gap-3">
                                <span className="text-gray-400 text-4xl lg:mt-2 -mt-1.5">→</span>
                                <span className="text-[#685AFF]">Production</span>
                            </span>
                        </h2>

                        <p className="mt-6 text-gray-500 text-base sm:text-md max-w-md flex justify-start">
                            Shipping scalable backend systems for real-world products.
                        </p>

                        
                        <div className="mt-12 relative border-l-2 border-white space-y-2 pr-4">
                            <motion.div
                                className="absolute -left-px w-0.5 bg-[#685AFF] rounded-full"
                                animate={{
                                    top: `${stepOrder.indexOf(activeStep) * 33.33}%`,
                                }}
                                style={{ height: '33.33%' }}
                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            />

                            {stepOrder.map((key) => (
                                <TimelineStep
                                    key={key}
                                    config={stepsConfig[key]}
                                    isActive={activeStep === key}
                                    onClick={() => setActiveStep(key)}
                                />
                            ))}
                        </div>
                    </div>

                    
                    <div className="w-full lg:w-1/2">
                        <TerminalPanel
                            config={active.terminal}
                            activeStep={activeStep}
                        />
                    </div>

                </div>

                
                
            </div>
        </section>
    )
}

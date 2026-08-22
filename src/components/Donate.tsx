import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useRazorpay } from '../hooks/useRazorpay';
import supportimage from "../assets/support.png";
import { getDonationTotal, getRecentSupporters, type Supporter, type DonationStats } from '../services/donationService';
import VisibilityNotice from './VisibilityNotice';
import { FeatureGate, useFeatureFlag } from '../context/FeatureFlagContext';




const PRESET_AMOUNTS = [10, 20, 30, 40] as const;




function useAnimatedCounter(target: number, duration = 1200) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (target === 0) { setValue(0); return; }

        let start = 0;
        const startTime = performance.now();

        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(start + (target - start) * eased);
            setValue(current);
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [target, duration]);

    return value;
}




function ConfettiEffect() {
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d')!;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#3b5bdb', '#5c7cfa', '#748ffc', '#ffd43b', '#ff6b6b', '#51cf66', '#cc5de8'];
        const particles: { x: number; y: number; w: number; h: number; color: string; vx: number; vy: number; rotation: number; rv: number; opacity: number; }[] = [];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * -1,
                w: Math.random() * 8 + 4,
                h: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rv: (Math.random() - 0.5) * 10,
                opacity: 1,
            });
        }

        let frame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.rotation += p.rv;

                if (p.y > canvas.height) {
                    p.opacity -= 0.02;
                }

                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            }

            if (alive) {
                frame = requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        };

        frame = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(frame); canvas.remove(); };
    }, []);

    return null;
}




function SupporterTicker({ supporters }: { supporters: Supporter[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (supporters.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % supporters.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [supporters.length]);

    if (supporters.length === 0) return null;

    const supporter = supporters[index];
    const timeAgo = getTimeAgo(supporter.createdAt);

    return (
        <div className="min-h-6 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={`${supporter._id}-${index}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs text-gray-400 font-arimo"
                >
                    <span className="text-blue-400 font-medium">{supporter.name || 'Anonymous'}</span>
                    {' donated '}
                    <span className="text-emerald-400 font-semibold">₹{supporter.amount}</span>
                    {' · '}
                    {timeAgo}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

function getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}




function SuccessModal({ name, amount, onClose }: { name: string; amount: number; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <ConfettiEffect />
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 260 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-[#ffffff] shadow-2xl overflow-hidden"
            >
                
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#161b22]">
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                        donation_success.log
                    </p>
                </div>
                
                <div className="font-mono text-sm text-[#685AFF] p-6 space-y-2">
                    <p>
                        <span className="text-gray-500">$</span> initiating payment verification...
                    </p>
                    <p className="text-blue-400">
                        ✔ payment_signature_verified
                    </p>
                    <p className="text-blue-400">
                        ✔ transaction_added_to_ledger
                    </p>
                    <p className="text-blue-400">
                        ✔ supporter_registered
                    </p>
                    <br />
                    <p className="text-gray-500">
        
                    </p>
                    <pre className="text-sm leading-relaxed">
                        {`{
                            "status": 200,
                            "message": "DONATION_SUCCESS",
                            "supporter": "${name || "Anonymous"}",
                            "amount": "₹${amount}",
                            "impact": "Your contribution fuels new builds 🚀",
                            "timestamp": "${new Date().toLocaleString()}"
                        }`}
                    </pre>
                    <p className="text-emerald-400 mt-4">
                        ✔ system: gratitude.exe executed
                    </p>
                    <p className="text-gray-500 animate-pulse">
                        $ awaiting next command...
                    </p>
                </div>
                
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="text-xs font-mono text-gray-400 hover:text-white transition"
                    >
                        exit()
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}




function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}




export default function Donate() {
    const pageVisible = useFeatureFlag('page.support');
    
    const [selectedAmount, setSelectedAmount] = useState<number>(10);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    
    const [stats, setStats] = useState<DonationStats>({ total: 0, count: 0 });
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const animatedTotal = useAnimatedCounter(stats.total);

    
    const { status, error, successData, initiate, reset } = useRazorpay();

    
    useEffect(() => {
        const load = async () => {
            try {
                const [s, r] = await Promise.all([getDonationTotal(), getRecentSupporters()]);
                setStats(s);
                setSupporters(r);
            } catch {
                // silent
            }
        };
        load();
    }, []);

    
    useEffect(() => {
        if (status === 'success') {
            getDonationTotal().then(setStats).catch(() => { });
            getRecentSupporters().then(setSupporters).catch(() => { });
        }
    }, [status]);

    const finalAmount = isCustom ? Number(customAmount) : selectedAmount;

    const handlePay = useCallback(() => {
        if (!finalAmount || finalAmount < 10) return;
        initiate({ amount: finalAmount, name: name || undefined, message: message || undefined });
    }, [finalAmount, name, message, initiate]);

    const handleSelectPreset = (amt: number) => {
        setIsCustom(false);
        setSelectedAmount(amt);
        setCustomAmount('');
    };

    const handleCustom = () => {
        setIsCustom(true);
        setSelectedAmount(0);
    };

    if (!pageVisible) {
        return (
            <VisibilityNotice
                title="Support "
                description="The donation/support page is currently disabled by the site administrator."
                backHref="/"
                backLabel="Back to home"
            />
        );
    }

    return (
        <>
            <Navbar />
            <FeatureGate flagKey="content.support.hero" fallback={
                <VisibilityNotice
                    title="Support content hidden"
                    description="The donation experience is temporarily hidden by the site administrator."
                    backHref="/"
                    backLabel="Back to home"
                />
            }>
                <section id="donate" className="w-full bg-[#121212] py-20 md:py-28 px-4 flex flex-col items-center scroll-mt-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12 relative z-10"
                >
                    <h2 className="text-4xl font-extrabold pt-4 sm:text-5xl md:text-6xl text-gray-100 uppercase flex justify-center gap-6 tracking-tight">
                        Support<span className="text-[#685AFF] -ml-3">Me</span><img
                            src={supportimage}
                            className="-ml-3 w-10 sm:w-14 md:w-16 h-auto"
                            alt="support"
                        />
                    </h2>
                    <p className="mt-4 text-gray-400 text-base sm:text-lg font-arimo max-w-lg mx-auto">
                        If my work has helped you, consider buying me a coffee. Every contribution fuels the next build.
                    </p>

                    
                    {stats.count > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10"
                        >
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Raised</span>
                            <span className="text-xl font-bold flex gap-2 text-emerald-400">₹{animatedTotal.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-500">from {stats.count} supporters</span>
                        </motion.div>
                    )}
                </motion.div>

                
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="relative w-full max-w-lg z-10"
                >
                    



                    
                    <div className="rounded-2xl overflow-hidden border border-gray-700/60 ">
                        
                        <div className="flex items-center gap-2 bg-[#202020] px-4 py-3 border-b border-gray-700/50">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                            <span className="ml-3 text-xs text-gray-500 font-mono tracking-wide select-none">~/support — donate.sh</span>
                        </div>

                        
                        <div className="bg-[#0d1117] px-6 sm:px-8 py-7 font-mono text-[13px] leading-relaxed">
                            
                            <div className="flex gap-5">
                                
                                <div className="select-none text-gray-300 text-right text-xs leading-relaxed pt-px hidden sm:block">
                                    {Array.from({ length: isCustom ? 17 : 15 }, (_, i) => (
                                        <div key={i} className="h-6.5 flex items-center justify-end">{i + 1}</div>
                                    ))}
                                </div>

                                
                                <div className="flex-1 min-w-0">
                                    
                                    <p className="text-gray-400 italic h-6.5 flex items-center">
                                        <span className="text-gray-400">{'//'}</span> support configuration
                                    </p>

                                    
                                    <p className="h-6.5 flex items-center">
                                        <span className="text-purple-400">import</span>
                                        <span className="text-gray-800 ml-1"> {' { '}</span>
                                        <span className="text-blue-400 ml-1">razorpay</span>
                                        <span className="text-gray-800 ml-1">{' }'} </span>
                                        <span className="text-purple-400 ml-1"> from </span>
                                        <span className="text-[#685AFF] ml-1">  &apos;@payments&apos; </span>
                                        <span className="text-gray-400">;</span>
                                    </p>

                                    
                                    <div className="h-6.5" />

                                    
                                    <p className="h-6.5 flex items-center">
                                        <span className="text-purple-400"> const </span>
                                        <span className="text-blue-400 ml-1"> amount </span>
                                        <span className="text-gray-400 ml-1"> = </span>
                                        <span className="text-amber-400 ml-1">{finalAmount || '?'}</span>
                                        <span className="text-gray-400">;</span>
                                        <span className="text-gray-400 ml-3 text-xs italic">{'// ₹ INR'}</span>
                                    </p>

                                    
                                    <div className="grid grid-cols-5 gap-2 my-3">
                                        {PRESET_AMOUNTS.map((amt) => (
                                            <motion.button
                                                key={amt}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSelectPreset(amt)}
                                                className={`py-2.5 rounded-sm text-sm font-extrabold transition-all cursor-pointer ${!isCustom && selectedAmount === amt
                                                    ? 'bg-[#685AFF]/30 text-gray-600 border border-[#685AFF]'
                                                    : 'bg-[#121212] text-gray-400 hover:bg-[#121212] border border-gray-600 hover:text-gray-600'
                                                    }`}
                                            >
                                                ₹{amt}
                                            </motion.button>
                                        ))}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCustom}
                                            className={`py-2.5 rounded-sm text-sm font-extrabold transition-all cursor-pointer ${isCustom
                                                ? 'bg-[#685AFF]/30 text-gray-600 border border-[#685AFF]'
                                                : 'bg-[#121212] text-gray-400 hover:bg-[#121212] border border-gray-600 hover:text-gray-600'
                                                }`}
                                        >
                                            Custom
                                        </motion.button>
                                    </div>

                                    
                                    <AnimatePresence>
                                        {isCustom && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden mb-2"
                                            >
                                                <p className="h-6.5 flex items-center mb-1">
                                                    <span className="text-purple-400">let</span>
                                                    <span className="text-blue-400"> customAmount</span>
                                                    <span className="text-gray-400"> = </span>
                                                </p>
                                                <input
                                                    type="number"
                                                    min={10}
                                                    max={500000}
                                                    value={customAmount}
                                                    onChange={(e) => setCustomAmount(e.target.value)}
                                                    placeholder="10"
                                                    className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-amber-600 text-sm font-mono placeholder-gray-300 focus:outline-none focus:border-[#685AFF] focus:ring-1 focus:[#685AFF] transition-all"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    
                                    <div className="h-6.5" />

                                    
                                    <p className="text-gray-400 italic h-6.5 flex items-center">
                                        <span className="text-gray-400">{'//'}</span> donor details
                                    </p>

                                    
                                    <p className="h-6.5 flex items-center">
                                        <span className="text-purple-400">const</span>
                                        <span className="text-blue-400 ml-1"> donor</span>
                                        <span className="text-gray-400 ml-1"> = </span>
                                        <span className="text-gray-800 ml-1">{'{'}</span>
                                    </p>

                                    
                                    <div className="pl-5 mb-1">
                                        <p className="h-6.5 flex items-center">
                                            <span className="text-blue-400">name</span>
                                            <span className="text-gray-400">: </span>
                                        </p>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder='"Anonymous"'
                                            maxLength={100}
                                            className="w-full px-3 py-2 rounded border border-gray-800 bg-[#1c1c1c] text-[#685AFF] text-sm font-mono placeholder-gray-300 focus:outline-none focus:border-[#685AFF] focus:ring-1 focus:ring-[#685AFF] transition-all"
                                        />
                                    </div>

                                    
                                    <div className="pl-5 mt-2 mb-1">
                                        <p className="h-6.5 flex items-center">
                                            <span className="text-blue-400">message</span>
                                            <span className="text-gray-400">: </span>
                                        </p>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder='"your message here..."'
                                            maxLength={500}
                                            rows={2}
                                            className="w-full px-3 py-2 rounded border border-gray-800 bg-[#1c1c1c] text-[#685AFF] text-sm font-mono placeholder-gray-300 focus:outline-none focus:border-[#685AFF] focus:ring-1 focus:ring-[#685AFF] transition-all resize-none"
                                        />
                                    </div>

                                    
                                    <p className="h-6.5 flex items-center">
                                        <span className="text-gray-800">{'}'}</span>
                                        <span className="text-gray-400">;</span>
                                    </p>

                                    
                                    <div className="h-6.5" />

                                    
                                    <AnimatePresence>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-red-500 text-xs mb-3 font-mono flex items-center gap-2"
                                            >
                                                <span className="text-red-400">{'// ⚠'}</span> {error}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePay}
                                        disabled={status === 'loading' || (isCustom && (!customAmount || Number(customAmount) < 10))}
                                        className="w-full py-3 rounded border bg-[#1c1c1c] text-left font-mono text-sm flex items-center justify-center gap-1 hover:bg-[#685AFF] hover:border-[#685AFF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Spinner />
                                                <span className="text-gray-400 ml-2">awaiting response...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-purple-400">await</span>
                                                <span className="text-blue-400 ml-1">razorpay</span>
                                                <span className="text-gray-800">.</span>
                                                <span className="text-amber-400">pay</span>
                                                <span className="text-gray-800">(</span>
                                                <span className="text-emerald-400 flex gap-2">₹{finalAmount || '?'}</span>
                                                <span className="text-gray-800">)</span>
                                                <span className="text-gray-400">;</span>
                                            </>
                                        )}
                                    </motion.button>

                                    
                                    <div className="h-6.5" />

                                    
                                    <p className="text-gray-400 text-xs italic h-6.5 flex items-center">
                                        {'// '} secured by razorpay · encrypted
                                    </p>

                                    
                                    {supporters.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-gray-600 text-xs italic flex items-center mb-1">
                                                {'// '} recent supporters
                                            </p>
                                            <SupporterTicker supporters={supporters} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                
                <AnimatePresence>
                    {status === 'success' && successData && (
                        <SuccessModal
                            name={successData.name}
                            amount={successData.amount}
                            onClose={reset}
                        />
                    )}
                </AnimatePresence>
                </section>
            </FeatureGate>
        </>
    );
}

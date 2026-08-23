import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import logo from '../assets/ChatGPT Image Jul 18, 2026, 06_54_16 PM.png'
import bust from "../assets/dd8e08f0-8620-4563-b986-46c851730c42.png"
import certificate from '../assets/Screenshot 2026-07-19 213221.png'
import certificate1 from '../assets/Screenshot 2026-07-19 221351.png'
import certificate2 from '../assets/Screenshot 2026-07-19 221505.png'
import certificate3 from '../assets/Screenshot 2026-07-19 221558.png'
// import arrow from '../assets/arrow1.jpg'

function CircularSticker() {
    return (
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 mt-[-3rem] sm:mt-[-4.5rem]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
                <defs>
                    <path
                        id="circlePath"
                        d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                    />
                </defs>
                <circle cx="100" cy="100" r="95" fill="#fff" />
                <text
                    fill="#000"
                    fontSize="19"
                    fontWeight="800"
                    letterSpacing="2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    <textPath href="#circlePath" startOffset="0">
                        FOUNDERS BELIEFS • FOUNDERS BELIEFS •&nbsp;
                    </textPath>
                </text>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="h-8 w-8 sm:h-10 sm:w-10 -rotate-45">
                    <path
                        d="M6 20 L30 20 M22 12 L30 20 L22 28"
                        stroke="#f5b8d0"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
    );
}

function BackToTop() {
    const scrollTop = () =>
        window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="group relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 cursor-pointer"
        >
            <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full animate-spin-slow"
            >
                <defs>
                    <path
                        id="btt-path"
                        d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                    />
                </defs>
                <circle cx="100" cy="100" r="95" fill="#F4F6FB" />
                <text
                    fill="#685AFF"
                    fontSize="22"
                    fontWeight="800"
                    letterSpacing="4"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                    <textPath href="#btt-path" startOffset="0">
                        BACK TO TOP • BACK TO TOP •&nbsp;
                    </textPath>
                </text>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src={logo}
                    alt="RAW Logo"
                    className="h-28 w-auto sm:h-32 md:h-40 bg-transparent mt-1 sm:mt-2"
                />
            </div>
        </button>
    );
}

function Hero() {
    const bigTextRef = useRef<HTMLDivElement>(null);
    const inView = useInView(bigTextRef, { amount: 0.1, once: false });

    return (
        <section className="relative isolate min-h-[60svh] sm:min-h-[80svh] md:min-h-[100svh] w-full overflow-hidden bg-black">

            <div
                ref={bigTextRef}
                className={`pointer-events-none absolute inset-x-0 top-12 sm:top-16 md:top-0 z-0 mx-auto max-w-[92vw] select-none text-center font-sans uppercase leading-[0.85] tracking-[-0.03em] transition-opacity duration-700 ${inView ? "opacity-100" : "opacity-40"
                    }`}
                style={{
                    fontSize: "clamp(6rem, 15vw, 15rem)",
                    color: "#292522",
                    textShadow: "0 2px 0 rgba(68, 68, 68, 0.02)",
                }}
                aria-hidden="true"
            >
                <div>
                    <img
                        src="/ChatGPT Image Aug 23, 2026, 10_38_57 AM.png"
                        alt="Sahil Logo"
                        className="mx-auto w-[85vw] max-w-[1200px] h-auto object-contain"
                    />
                </div>
            </div>

            <div className="relative z-10 mx-auto mt-15 lg:mt-38 sm:mt-20 md:mt-18 flex justify-center">
                <img
                    src={bust}
                    alt="Classical bust with flowers blooming from the head"
                    className="pointer-events-none w-[60vw] sm:w-[45vw] md:w-[min(35vw,350px)] select-none drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
                />
            </div>
        </section>
    );
}

function TornPaperNote() {
    const [selected, setSelected] = useState<number | null>(null);

    const certificates = [
        {
            src: certificate,
            title: "C++ For C Programmers, Part A",
            issuer: "UC Santa Cruz",
            platform: "Coursera",
            date: "Nov 2025",
            verify: "https://coursera.org/verify/UORXSUKQ3H6G",
        },
        {
            src: certificate1,
            title: "Introduction to Front-End Development",
            issuer: "Meta",
            platform: "Coursera",
            date: "Nov 2025",
            verify: "https://coursera.org/verify/XNCKRZN1YKIW",
        },
        {
            src: certificate2,
            title: "C for Everyone: Structured Programming",
            issuer: "UC Santa Cruz",
            platform: "Coursera",
            date: "Nov 2025",
            verify: "https://coursera.org/verify/UP2MRAQ3LXQP",
        },
        {
            src: certificate3,
            title: "C for Everyone: Programming Fundamentals",
            issuer: "UC Santa Cruz",
            platform: "Coursera",
            date: "Nov 2025",
            verify: "https://coursera.org/verify/BS6DDHVJ5624",
        },
    ];

    useEffect(() => {
        if (selected === null) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelected(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected]);

    return (
        <section className="relative z-20 mx-auto max-w-3xl px-6 sm:px-4 pb-16 sm:pb-24 md:pb-32">

            <div className="pointer-events-none absolute ml-[-2rem] sm:ml-[-4rem] md:ml-[-5.5rem] -top-0 z-30 h-6 w-24 sm:h-8 sm:w-36 md:h-10 md:w-50 -rotate-40 bg-[#e6d3a3]/80 shadow-md sm:left-8" />

            <div className="pointer-events-none absolute z-30 bottom-14 right-[-0.5rem] h-5 w-20 -rotate-40 bg-[#e6d3a3]/80 shadow-md sm:bottom-20 sm:right-[-2rem] sm:h-7 sm:w-32 md:bottom-34 md:right-[-5.5rem] md:h-10 md:w-50" />

            <div className="absolute -right-1 top-2 z-40 sm:-right-4 sm:top-4 md:-right-6 md:top-6">
                <CircularSticker />
            </div>

            <div className="relative">
                <div className="torn-paper relative lg:-mt-10 bg-[#f6f2e9] px-3 py-6 sm:px-8 sm:py-10 md:px-12 md:py-14 lg:px-20 lg:py-20 text-black shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)]">

                    <svg className="absolute left-2 top-0 h-full w-6 -translate-x-full" preserveAspectRatio="none" viewBox="0 0 24 300" aria-hidden="true">
                        <path d="M0 0 Q 7 25 0 50 L 16 56 L 1 63 Q 8 105 0 145 L 10 150 L 0 156 Q 9 208 0 260 L 15 266 L 0 274 Q 6 287 0 300 L24 300 L24 0 Z" fill="#f6f2e9" />
                    </svg>

                    <svg className="absolute right-2 top-0 h-full w-6 translate-x-full" preserveAspectRatio="none" viewBox="0 0 24 300" aria-hidden="true">
                        <path d="M24 0 Q 17 17 24 35 L 14 40 L 24 46 Q 15 88 24 130 L 8 137 L 23 145 Q 16 182 24 220 L 14 225 L 24 232 Q 16 266 24 300 L0 300 L0 0 Z" fill="#f6f2e9" />
                    </svg>

                    <svg className="absolute top-2 left-0 w-full h-6 -translate-y-full" preserveAspectRatio="none" viewBox="0 0 300 24" aria-hidden="true">
                        <path d="M0 0 Q 22 7 45 0 L 50 10 L 56 0 Q 108 9 160 0 L 167 16 L 175 1 Q 212 6 250 0 L 256 15 L 264 0 Q 282 6 300 0 L300 24 L0 24 Z" fill="#f6f2e9" />
                    </svg>

                    <svg className="absolute bottom-2 left-0 w-full h-6 translate-y-full" preserveAspectRatio="none" viewBox="0 0 300 24" aria-hidden="true">
                        <path d="M0 24 Q 42 16 85 24 L 91 11 L 99 24 Q 142 17 185 24 L 190 14 L 196 24 Q 235 15 275 24 L 282 8 L 290 23 Q 295 18 300 24 L300 0 L0 0 Z" fill="#f6f2e9" />
                    </svg>

                    <div className="relative flex items-center justify-center">
                        <p className="absolute -top-10 left-0 font-hand text-xs sm:text-sm md:text-base">
                            20/04/2026
                        </p>
                        <h2 className="mb-4 font-bartle text-md font-bold leading-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-3xl">
                            Certifications
                        </h2>
                    </div>

                    <div className="mt-1 flex items-end justify-between gap-4 border-b border-[#2a2418]/20 pb-3">
                        <p className="font-hand text-base text-[#5c4d38] sm:text-lg">
                            Filed documents — originals on request
                        </p>
                        <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.22em] text-[#8a7a62] uppercase sm:inline">
                            04 records
                        </span>
                    </div>

                    <ul className="mt-6 divide-y divide-[#2a2418]/12">
                        {certificates.map((item, index) => {
                            const n = String(index + 1).padStart(2, "0");
                            return (
                                <li key={item.verify} className="group">
                                    <button
                                        type="button"
                                        onClick={() => setSelected(index)}
                                        className="grid w-full cursor-pointer grid-cols-[auto_1fr] items-start gap-4 py-5 text-left sm:grid-cols-[3.25rem_7.5rem_1fr] sm:items-center sm:gap-6"
                                    >
                                        <span className="pt-0.5 font-hand text-xl leading-none text-[#8a7a62] sm:pt-0 sm:text-2xl">
                                            {n}
                                        </span>

                                        <span className="hidden overflow-hidden border border-[#2a2418]/18 bg-[#fffdf8] shadow-[2px_3px_0_rgba(42,36,24,0.08)] sm:block">
                                            <img
                                                src={item.src}
                                                alt=""
                                                className="h-[4.4rem] w-full object-cover object-top"
                                            />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block font-arimo text-[0.95rem] font-semibold leading-snug tracking-[-0.02em] text-[#1c1812] sm:text-[1.05rem]">
                                                {item.title}
                                            </span>
                                            <span className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[12px] leading-relaxed text-[#6b5d48]">
                                                <span>{item.issuer}</span>
                                                <span className="text-[#c4b59a]">·</span>
                                                <span>{item.platform}</span>
                                                <span className="text-[#c4b59a]">·</span>
                                                <span>{item.date}</span>
                                            </span>
                                            <span className="mt-2 inline-flex items-center gap-1 font-hand text-sm text-[#5c4d38] underline decoration-[#c4b59a] decoration-1 underline-offset-4 transition-colors group-hover:text-[#1c1812]">
                                                Open original
                                                <span aria-hidden="true">→</span>
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-6 sm:mt-8">
                        <p className="text-black font-hand text-lg sm:text-xl md:text-2xl flex justify-end">Adding more...</p>
                        <p className="text-black font-hand text-lg sm:text-xl md:text-2xl flex justify-center mt-4 sm:mt-6">01</p>
                    </div>
                </div>
            </div>

            {selected !== null && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0b09]/86 p-3 backdrop-blur-[2px] sm:p-6"
                    onClick={() => setSelected(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={certificates[selected].title}
                >
                    <div
                        className="relative w-full max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-end justify-between gap-4 px-1 text-[#f6f2e9]">
                            <div>
                                <p className="font-bebas text-xl sm:text-2xl">{certificates[selected].title}</p>
                                <p className="mt-0.5 font-bebas text-[10px] tracking-[0.18em] uppercase text-[#f6f2e9]/55">
                                    {certificates[selected].issuer} · {certificates[selected].date}
                                </p>
                            </div>
                            <a
                                href={certificates[selected].verify}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden shrink-0 font-bebas text-lg underline decoration-[#f6f2e9]/35 underline-offset-4 sm:inline"
                            >
                                Verify on Coursera
                            </a>
                        </div>
                        <img
                            src={certificates[selected].src}
                            alt={certificates[selected].title}
                            className="max-h-[70vh] w-full object-contain bg-[#0c0b09]/86 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="absolute right-3 top-3 font-hand text-3xl leading-none text-[#f6f2e9] sm:right-6 sm:top-6 sm:text-4xl"
                        aria-label="Close preview"
                    >
                        ×
                    </button>
                </div>
            )}
        </section>
    );
}

function Footer() {
    return (
        <footer className="relative z-20 bg-black">

            <div className="absolute right-2 top-12 sm:right-6 sm:-top-14 md:right-10 md:-top-16">
                <BackToTop />
            </div>
        </footer>
    );
}

export default function App() {
    return (
        <main className="relative min-h-[180vh] w-full overflow-x-clip bg-black text-white">
            <Hero />
            <TornPaperNote />
            <Footer />
        </main>
    );
}
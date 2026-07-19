import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import logo from '../assets/ChatGPT Image Jul 18, 2026, 06_54_16 PM.png'
import bust from "../assets/dd8e08f0-8620-4563-b986-46c851730c42.png"
import certificate from '../assets/Screenshot 2026-07-19 213221.png'
import certificate1 from '../assets/Screenshot 2026-07-19 221351.png'
import certificate2 from '../assets/Screenshot 2026-07-19 221505.png'
import certificate3 from '../assets/Screenshot 2026-07-19 221558.png'
import arrow from '../assets/arrow1.jpg'


/* . Circular sticker . */
function CircularSticker() {
    return (
        <div className="relative h-24 w-24 sm:h-28 sm:w-28">
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
            {/* Pink arrow center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-45">
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

/* . Back To Top circular sticker */
function BackToTop() {
    const scrollTop = () =>
        window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="group relative h-24 w-24 sm:h-28 sm:w-28 cursor-pointer"
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
            {/* Star burst */}
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src={logo}
                    alt="RAW Logo"
                    className="h-40 w-auto bg-transparent mt-2"
                />
                {/* <svg viewBox="0 0 40 40" className="h-8 w-8 transition-transform group-hover:scale-110">
                    <g fill="#1e2fd4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <rect
                                key={i}
                                x="19"
                                y="2"
                                width="2"
                                height="10"
                                rx="1"
                                transform={`rotate(${i * 30} 20 20)`}
                            />
                        ))}
                        <circle cx="20" cy="20" r="3" />
                    </g>
                </svg> */}
            </div>
        </button>
    );
}

/* . Cute Eyes mascot . */
function EyesMascot() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            setPos({ x: dx * 3, y: dy * 3 });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <div className="flex items-center gap-1">
            {[0, 1].map((i) => (
                <div
                    key={i}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white ring-2 ring-black"
                >
                    <div
                        className="h-4 w-4 rounded-full bg-black animate-blink"
                        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                    />
                </div>
            ))}
        </div>
    );
}

/* . Marquee "AND COUNTING..." . */
// function TopMarquee() {
//     const items = Array.from({ length: 8 });
//     return (
//         <div className="absolute inset-x-0 top-0 z-20 overflow-hidden py-3">
//             <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap">
//                 {items.map((_, i) => (
//                     <span
//                         key={i}
//                         className="mx-6 font-display text-2xl uppercase tracking-widest text-white/90 sm:text-3xl"
//                     >
//                         WORK &nbsp;✦&nbsp;
//                     </span>
//                 ))}
//             </div>
//             <style>{`@keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }`}</style>
//         </div>
//     );
// }

/* . Hero with big text + bust . */
function Hero() {
    const bigTextRef = useRef<HTMLDivElement>(null);
    const inView = useInView(bigTextRef, { amount: 0.1, once: false });

    return (
        <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-black pt-16">
            {/* Giant background poem-style text */}
            <div
                ref={bigTextRef}
                className={`pointer-events-none absolute inset-x-0 top-24 z-0 mx-auto max-w-[92vw] select-none text-center font-display uppercase leading-[0.85] tracking-[-0.03em] transition-opacity duration-700 ${inView ? "opacity-100" : "opacity-40"
                    }`}
                style={{
                    fontSize: "clamp(3.5rem, 15vw, 15rem)",
                    color: "#1a1a1a",
                    textShadow: "0 2px 0 rgba(255,255,255,0.02)",
                }}
                aria-hidden="true"
            >
                <div>SAHIL</div>
            </div>

            {/* Bust image */}
            <div className="relative z-10 mx-auto mt-18 flex justify-center">
                <img
                    src={bust}
                    alt="Classical bust with flowers blooming from the head"
                    className="pointer-events-none w-[min(35vw,350px)] select-none drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
                />
            </div>
        </section>
    );
}

/* . Torn paper note . */
function TornPaperNote() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section className="relative z-20 mx-auto -mt-20 max-w-3xl px-4 pb-32 sm:-mt-32">
            {/* Tape top-left */}
            <div className="pointer-events-none absolute ml-[-5.5rem] -top-0 z-30 h-10 w-50 -rotate-40 bg-[#e6d3a3]/80 shadow-md sm:left-8" />

            {/* Tape bottom-right */}
            <div className="pointer-events-none absolute bottom-35 mr-[-5.5rem] z-30 h-10 w-50 -rotate-40 bg-[#e6d3a3]/80 shadow-md sm:right-8" />

            {/* Circular sticker top-right */}
            <div className="absolute -right-2 top-4 z-40 sm:-right-6 sm:top-6">
                <CircularSticker />
            </div>

            <div className="relative">
                <div
                    className="torn-paper relative -mt-20 bg-[#f6f2e9] px-8 py-12 text-black shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)] sm:px-14 sm:py-16"
                >
                    <svg
                        className="absolute left-0 top-0 h-full w-6 -translate-x-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 24 300"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 0 Q 7 25 0 50 L 16 56 L 1 63 Q 8 105 0 145 L 10 150 L 0 156 Q 9 208 0 260 L 15 266 L 0 274 Q 6 287 0 300 L24 300 L24 0 Z"
                            fill="#f6f2e9"
                        />
                    </svg>

                    {/* Right Edge: 3 random cuts at y=40 (shallow), y=137 (deep), y=225 (shallow) */}
                    <svg
                        className="absolute right-0 top-0 h-full w-6 translate-x-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 24 300"
                        aria-hidden="true"
                    >
                        <path
                            d="M24 0 Q 17 17 24 35 L 14 40 L 24 46 Q 15 88 24 130 L 8 137 L 23 145 Q 16 182 24 220 L 14 225 L 24 232 Q 16 266 24 300 L0 300 L0 0 Z"
                            fill="#f6f2e9"
                        />
                    </svg>

                    {/* Top Edge: 3 random cuts at x=50 (shallow), x=167 (deep), x=256 (medium) */}
                    <svg
                        className="absolute top-0 left-0 w-full h-6 -translate-y-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 300 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 0 Q 22 7 45 0 L 50 10 L 56 0 Q 108 9 160 0 L 167 16 L 175 1 Q 212 6 250 0 L 256 15 L 264 0 Q 282 6 300 0 L300 24 L0 24 Z"
                            fill="#f6f2e9"
                        />
                    </svg>

                    {/* Bottom Edge: 3 random cuts at x=91 (medium), x=190 (shallow), x=282 (deep) */}
                    <svg
                        className="absolute bottom-0 left-0 w-full h-6 translate-y-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 300 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M0 24 Q 42 16 85 24 L 91 11 L 99 24 Q 142 17 185 24 L 190 14 L 196 24 Q 235 15 275 24 L 282 8 L 290 23 Q 295 18 300 24 L300 0 L0 0 Z"
                            fill="#f6f2e9"
                        />
                    </svg>
                    <div className="flex gap-[9rem]">
                        <p className="font-hand">20/04/2026</p>
                        <h2 className="mb-6 font-hand text-4xl font-bold leading-tight sm:text-5xl">
                            Certifications
                        </h2>
                    </div>
                    <div className="flex justify-center lg:justify-start">
                        <img
                            src={certificate}
                            alt="Certificate 1"
                            onClick={() => setSelectedImage(certificate)}
                            className="mt-2 h-50 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                    <img
                        src={arrow}
                        alt="Arrow"
                        className="h-30 w-auto mt-2 ml-20 rotate-2 hidden sm:block"
                    />
                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={certificate1}
                            alt="Certificate 2"
                            onClick={() => setSelectedImage(certificate1)}
                            className="mt-2 h-50 w-auto cursor-pointer transition-transform duration-300 hover:scale-105 mt-[-9rem]"
                        />
                    </div>
                    <img
                        src={arrow}
                        alt="Arrow"
                        className="h-40 w-auto mt-2 ml-60 scale-x-[-1] rotate-2 hidden sm:block"
                    />
                    <div className="flex justify-center lg:justify-start">
                        <img
                            src={certificate2}
                            alt="Certificate 3"
                            onClick={() => setSelectedImage(certificate2)}
                            className="mt-2 h-50 w-auto cursor-pointer transition-transform duration-300 hover:scale-105 mt-[-9rem]"
                        />
                    </div>
                    <img
                        src={arrow}
                        alt="Arrow"
                        className="h-50 w-auto mt-2 ml-20 rotate-2 hidden sm:block"
                    />
                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={certificate3}
                            alt="Certificate 4"
                            onClick={() => setSelectedImage(certificate3)}
                            className="mt-2 h-50 w-auto cursor-pointer transition-transform duration-300 hover:scale-105 mt-[-9rem] mb-10"
                        />
                    </div>
                    <p className="text-black font-hand text-2xl">Adding more</p>
                </div>
            </div>

            {/* Floating Image Preview */}
            {selectedImage && (
                <div
                    className="fixed mt-14 inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Certificate Preview"
                        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute right-6 top-6 text-4xl text-white transition hover:scale-110"
                    >
                        ×
                    </button>
                </div>
            )}
        </section>
    );
}

/* . Footer . */
function Footer() {
    return (
        <footer className="relative z-20 bg-black">
            {/* Back to top absolute right */}
            <div className="absolute right-4 -top-16 sm:right-10">
                <BackToTop />
            </div>
        </footer>
    );
}

/* . App . */
export default function App() {
    return (
        <main className="relative min-h-screen w-full overflow-x-clip bg-black text-white">
            {/* <TopMarquee /> */}
            <Hero />
            <TornPaperNote />
            <Footer />
        </main>
    );
}

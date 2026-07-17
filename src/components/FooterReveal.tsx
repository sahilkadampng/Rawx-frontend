import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FooterReveal() {
    const revealRef = useRef<HTMLElement>(null);
    const isRevealVisible = useInView(revealRef, { amount: 0.08 });

    return (
        <section
            ref={revealRef}
            className="relative z-0 h-[125svh] bg-[#111214]"
            aria-label="Aether footer reveal"
        >
            <p
                className={`pointer-events-none fixed inset-x-0 top-1/2 z-10 -translate-y-1/2 select-none text-center font-sans text-[clamp(5.5rem,21vw,21rem)] font-black leading-none tracking-[-0.02em] text-white/10 transition-opacity duration-300 ${isRevealVisible ? 'opacity-70' : 'opacity-0'}`}
                aria-hidden="true"
            >
                SAHIL
            </p>
        </section>
    );
}

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Silk from '../components/silkbg'
// import Noise from '../components/noise'

import RotatingEarth from './ui/wireframe-dotted-globe'

export default function Hero() {
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input')
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 180])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.93])

    return (
        <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col rounded-b-[50px] items-center justify-center text-center overflow-hidden bg-transparent px-4 sm:px-6">
            <div className="absolute inset-0 -z-10">
                <Silk />
            </div>
            {/* Image background — behind everything */}


            {/* Globe background */}
            <div className="absolute top-40 sm:top-auto left-1/2 -translate-x-1/2 -translate-y-[40%] z-0 opacity-80 flex items-center justify-center mix-blend-screen pointer-events-none sm:pointer-events-auto scale-50 sm:scale-75 md:scale-100 origin-center">
                <RotatingEarth width={650} height={650} />
            </div>

            <motion.div
                style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
                className="max-w-5xl mx-auto px-2 sm:px-6 relative z-10 w-full"
            >
                {/* Top badge */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-20 text-[10px] tracking-[0.3em] text-gray-500 mb-6 uppercase"
                >
                    ●  ●
                </motion.p>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-3xl sm:text-5xl md:text-6xl font-bartle leading-tight text-white tracking-tight"
                >
                    BACKEND
                    <br />
                    <span className="text-[#685AFF]">DEVELOPER</span>
                </motion.h1>

                <div className="mt-6 relative z-10 flex justify-center">
                </div>

                {/* Glass card */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="
                relative max-w-2xl mx-auto p-4 sm:p-8
                rounded-2xl
                bg-white/10
                backdrop-blur-sm
                border border-white/10 mt-10
                ">
                    <p className="text-gray-800">
                        RAW design and engineer the control layer behind seamless digital
                        experiences, ensuring every project is robust, scalable, and polished.
                    </p>
                </motion.div> */}
                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-24 sm:mt-36 md:mt-56"
                >
                    <button
                        onClick={() =>
                            document.getElementById("CTA")?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-8 py-3 rounded-lg bg-[#685AFF] text-white font-michroma hover:bg-[#5040ff] transition shadow-lg cursor-pointer"
                    >
                        Get in touch
                    </button>
                    <button
                        onClick={() => {
                            document.getElementById('built-for-clients')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 rounded-lg bg-white text-gray-800 font-michroma border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                    >
                        View Projects
                    </button>
                </motion.div>
            </motion.div>

            {/* Terminal preview box */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-3xl mx-auto mt-10 sm:mt-16 px-2 sm:px-6"
            >
                <div className="relative bg-gray-500/40 border border-gray-200 rounded-md overflow-hidden">
                    {/* Background grid */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none mt-21.5"
                        style={{
                            backgroundImage:
                                'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '25px 25px',
                            backgroundRepeat: 'repeat',
                        }}
                    />
                    {/* Top bar */}
                    <div className="px-3 sm:px-6 py-3 sm:py-4 flex font-russo flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-b border-gray-100">
                        {/* <Noise /> */}
                        <div className="flex items-center gap-3">
                            {/* Window dots */}
                            <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                            </div>
                            <span className="font-mono text-xs sm:text-sm text-white ml-2">
                                DEVELOPER_PROFILE::/api/V1
                            </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                            <button
                                onClick={() => setActiveTab('input')}
                                className={`px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md transition cursor-pointer ${activeTab === 'input' ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-[#685AFF]'
                                    }`}
                            >
                                REQUEST
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={`px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md transition cursor-pointer ${activeTab === 'output' ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-[#685AFF]'
                                    }`}
                            >
                                RESPONSE
                            </button>
                        </div>
                    </div>

                    {/* Code content (fixed height & scrollable) */}
                    {/* Code content (fixed height & scrollable) */}
                    <div className="relative px-4 sm:px-8 py-4 sm:py-6 font-mono text-xs sm:text-sm leading-relaxed text-gray-800 w-full h-72 sm:h-100 md:h-112.5 overflow-auto text-left">
                        {activeTab === 'input' ? (
                            <div className="text-left">
                                <p className='text-white'>
                                    <span className="text-purple-500">const</span> developer = {'{'}
                                </p>
                                <div className="ml-8 mt-2 space-y-1">
                                    <p className='text-white'>
                                        name : <span className="text-green-600">"SAHIL KADAM"</span>,
                                    </p>
                                    <p className='text-white'>
                                        age : <span className="text-green-600">19</span>,
                                    </p>
                                    <p className='text-white'>
                                        role : <span className="text-green-600">"Backend Developer"</span>,
                                    </p>
                                    <p className='text-white'>
                                        location : <span className="text-green-600">"India"</span>,
                                    </p>
                                    <p className='text-white'>skills : [</p>
                                    <div className="ml-8 space-y-1">
                                        {/* <p><span className="text-green-600">"python"</span>,</p> */}
                                        <p><span className="text-green-600">"Mongoose"</span>,</p>
                                        <p><span className="text-green-600">"Node.js"</span>,</p>
                                        <p><span className="text-green-600">"Express"</span>,</p>
                                        <p><span className="text-green-600">"MongoDB"</span>,</p>
                                    </div>
                                    <p className='text-white'>] ,</p>
                                    <p className='text-white'>
                                        contact : <span className="text-green-600">"sahilkadam@gmail.com"</span>
                                    </p>
                                </div>
                                <p className='text-white'>{'}'};</p>
                            </div>
                        ) : (
                            <div className="text-left">
                                <p>
                                    <span className="text-gray-500">// Response </span>
                                    <span className="ml-2 px-2 py-0.5 bg-green-300 rounded text-sm text-green-700">200 OK</span>
                                </p>
                                <p className='text-white'>{'{'}</p>
                                <div className="ml-8 mt-1 space-y-1">
                                    <p>
                                        <span className="text-pink-500">"status"</span> :{' '}
                                        <span className="text-blue-600 font-semibold">200</span>,
                                    </p>
                                    <p>
                                        <span className="text-pink-500">"message"</span> :{' '}
                                        <span className="text-green-600">"profile loaded successfully"</span>,
                                    </p>
                                    <p>
                                        <span className="text-pink-600">"data"</span> : {'{'}
                                    </p>
                                    <div className="ml-8 space-y-1">
                                        <p><span className="text-pink-600">"available"</span> : <span className="text-blue-600 font-semibold">false</span>,</p>
                                        <p><span className="text-pink-600">"experience"</span> : <span className="text-green-600">"0 years"</span>,</p>
                                        <p><span className="text-pink-600">"open_to_work"</span> : <span className="text-blue-600 font-semibold">false</span>,</p>
                                        <p><span className="text-pink-600">"projects_completed"</span> : <span className="text-blue-600 font-semibold">2</span>,</p>
                                        <p>
                                            <span className="text-pink-600">"github"</span> :{' '}
                                            <a className="text-green-600" href="https://github.com/sahilkadampng">
                                                github.com/sahilkadampng
                                            </a>,
                                        </p>
                                    </div>
                                    <p className='text-white'>{'}'}</p>
                                </div>
                                <p className='text-white'>{'}'}</p>
                            </div>
                        )}
                    </div>
                    {/* Bottom status */}
                    <div className="px-4 sm:px-6 py-3 flex justify-end">
                        <span className="text-xs tracking-[0.2em] text-gray-500 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                            {activeTab === 'input' ? 'Ready to Deploy' : 'Profile Active'}
                        </span>
                    </div>
                </div>
            </motion.div>
            <div className="mt-12 my-12 h-px w-full bg-linear-to-r from-transparent via-gray-400 to-transparent" />
        </section>
    );
}
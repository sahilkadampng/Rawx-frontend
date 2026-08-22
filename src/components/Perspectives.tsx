import { motion } from 'framer-motion';


export default function Perspectives() {
    return (
        <section className="relative z-10 overflow-hidden w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#111214] -mt-28">
            
            <div className="max-w-6xl mx-auto">
                
                <div className="border-t border-gray-700 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-0 md:divide-x divide-gray-600">
                    {[
                        { num: '01', title: 'Structured Ingest', desc: 'Seamless, organized, and ready to scale.' },
                        { num: '02', title: 'Protected Core', desc: 'Logic stays server-side' },
                        { num: '03', title: 'Architectures', desc: 'Endpoints scale instantly' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.num}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex items-start gap-3 px-4 sm:px-8 py-2"
                        >
                            <span className="flex items-center justify-center w-7 h-7 border border-gray-700 rounded-md font-mono text-[10px] text-gray-400 shrink-0">
                                {item.num}
                            </span>
                            <div>
                                <h4 className="font-mono text-sm flex font-bold text-[#685AFF] uppercase tracking-wide">
                                    {item.title}
                                </h4>
                                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="border-t mt-8 border-gray-700 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-0 md:divide-x divide-gray-200" />

                
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 sm:mt-20 text-center font-mono text-[10px] sm:text-xs tracking-[0.2em] text-gray-500 uppercase"
                >
                    <span className='text-[#685AFF]'>Two perspectives</span>: backend config vs. the consumer's experience.
                </motion.p>

                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mt-10 grid grid-cols-1 md:grid-cols-2 border border-gray-900 rounded-xl overflow-hidden bg-[#685AFF]"
                >
                    
                    <div className="p-6 sm:p-10 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 border border-gray-900 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-gray-900 rounded mb-8">
                                Developer View
                            </span>

                            
                            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto mt-4">
                                
                                <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
                                    </div>
                                    <div className="w-12 h-1 bg-gray-200 rounded-full" />
                                </div>

                                
                                <div className="p-4 font-mono text-sm leading-loose text-gray-700 text-left">
                                    <p>
                                        <span className="text-blue-600">const</span> endpoint = {'{'}
                                    </p>
                                    <div className="space-y-0.5 ml-4">
                                        <p>
                                            path: <span className="text-gray-500">'/v1/charge'</span>,
                                        </p>
                                        <p>
                                            method: <span className="text-green-600">'POST'</span>,
                                        </p>
                                        <p>
                                            rate_limit: <span className="text-gray-500">'1000/min'</span>,
                                        </p>
                                        <p>
                                            schema: <span className="text-blue-500">Schema.Payment</span>
                                        </p>
                                    </div>
                                    <p>{'}'};</p>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mt-10">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">
                                Total Control
                            </h3>
                            <p className="text-gray-100 text-sm leading-relaxed">
                                You define the validation rules, methods, and schemas.
                                <br />
                                The complexity is managed by the developer
                            </p>
                        </div>
                    </div>

                    
                    <div className="p-6 sm:p-10 flex flex-col justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 border border-gray-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-white rounded mb-8">
                                Consumer View
                            </span>

                            
                            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto mt-4">

                                
                                <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-bebas justify-left">/v1/charge</p>
                                    <div className="w-12 h-1 bg-gray-200 rounded-full" />
                                </div>

                                
                                <div className="px-4 py-4 font-mono text-xs leading-relaxed text-left">
                                    <p>{'{'}</p>
                                    <div className="ml-4 space-y-1">
                                        <p>
                                            <span className="text-purple-600">"status"</span> :{' '}
                                            <span className="text-blue-600 font-semibold">success</span>,
                                        </p>
                                        <p>
                                            <span className="text-purple-600">"invoice"</span> : {'{'}
                                        </p>
                                        <div className="ml-4 space-y-1">
                                            <p>
                                                <span className="text-purple-600">"id"</span> :{' '}
                                                <span className="text-blue-600 font-semibold">inv_k3j9z8b2f</span>,
                                            </p>
                                            <p>
                                                <span className="text-purple-600">"customer"</span> :{' '}
                                                <span className="text-green-600">"sahil"</span>,
                                            </p>
                                            <p>
                                                <span className="text-purple-600">"amount"</span> :{' '}
                                                <span className="text-blue-600 font-semibold">5000</span>,
                                            </p>
                                            <p>
                                                <span className="text-purple-600">"currency"</span> :{' '}
                                                <span className="text-blue-600 font-semibold">INR</span>,
                                            </p>
                                            <p>
                                                <span className="text-purple-600">"status"</span> :{' '}
                                                <span className="text-green-600">completed</span>,
                                            </p>
                                        </div>
                                        <p>{'}'}</p>
                                    </div>
                                    <p>{'}'}</p>
                                </div>

                                
                                <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-gray-400">Latency: 42ms</span>
                                    <span className="font-mono text-[10px] text-green-600 font-bold">200 OK</span>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mt-10">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">
                                Predictable Response
                            </h3>
                            <p className="text-gray-100 text-sm leading-relaxed">
                                consumers interact with a clean, fast, and
                                documented product that just works.
                            </p>
                        </div>
                    </div>
                </motion.div>

                
                <p className="text-center font-mono text-[10px] sm:text-xs tracking-[0.2em] text-gray-400 uppercase">
                    ...
                </p>
            </div>
        </section >
    );
}

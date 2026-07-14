import { motion } from "framer-motion";
import clr from "../assets/CLR.jpg";
import db from "../assets/db.jpg";
// import Noise from '../components/noise'
// import support from "../assets/support.jpg";

export default function Skills() {
    const categories = [
        {
            tag: "Core: Languages",
            tagColor: "text-[#685AFF]",
            image: clr,
            title: "Languages",
            skills: [
                { name: "JavaScript", level: "Intermediate" },
                { name: "TypeScript", level: "Basic" },
                { name: "Node.js", level: "Intermediate" },
                { name: "Python", level: "Basic" },
            ],
        },
        {
            tag: "Core: Frameworks",
            tagColor: "text-[#685AFF]",
            title: "Frameworks & Libraries",
            skills: [
                { name: "React", level: "Basic" },
                { name: "Express.js", level: "Intermediate" },
                { name: "Tailwind CSS", level: "Intermediate" },
            ],
        },
        {
            tag: "Core: Database",
            tagColor: "text-[#685AFF]",
            image: db,
            title: "Database & Storage",
            skills: [{ name: "MongoDB", level: "Intermediate" }],
        },
        {
            tag: "Core: DevOps",
            tagColor: "text-[#685AFF]",
            title: "DevOps & Tools",
            skills: [
                { name: "Git & GitHub", level: "Advanced" },
                { name: "Docker", level: "Not started" },
                { name: "CI/CD", level: "Not started" },
            ],
        },
        {
            tag: "Core: logic building",
            tagColor: "text-[#685AFF]",
            title: "logic building & CS Fundamentals",
            skills: [
                { name: "Data Structures", level: "Intermediate" },
                { name: "Algorithms", level: "Basic" },
                { name: "Computer Science", level: "Basic" },
                { name: "OOPs", level: "Basic" },
            ],
        },
    ];

    const levelColor: Record<string, string> = {
        Advanced: "text-gray-400 bg-transperent border-gray-700",
        Intermediate: "text-gray-400 bg-transperent border-gray-700",
        Basic: "text-gray-400 bg-transperent border-gray-700",
        "Not started": "text-gray-400 bg-transperent border-gray-700",
    };

    return (
        <section className="relative overflow-hidden w-full py-20 sm:py-28 px-4 sm:px-6 bg-[#06080b]">
            <div className="max-w-6xl mx-auto text-center">
                <div className="max-w-6xl mx-auto text-center">
                    {/* <Noise /> */}
                    {/* Top badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center gap-3 mb-8"
                    >
                        <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase">
                            Stack :: Overview
                        </span>
                        <span className="w-12 h-px bg-gray-300" />
                        <span className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-400">
                            Technical Proficiency
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white uppercase leading-tight tracking-tight"
                    >
                        Technical
                        <br />
                        <span className="text-[#685AFF]">Skills</span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-6 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto"
                    >
                        Every tool in the stack is chosen for production reliability. From
                        database design to deployment pipelines
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-12 flex flex-wrap justify-center divide-x divide-gray-800"
                    >
                        {[
                            { value: "", label: "" },
                            // { value: "Backend", label: "Coverage" },
                            // { value: "Production", label: "Grade" },
                        ].map((stat) => (
                            <div key={stat.label} className="px-10 sm:px-10 py-2 text-center">
                                <p className="text-2xl sm:text-3xl font-bold text-gray-200">
                                    {stat.value}
                                </p>
                                <p className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-400 uppercase mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Cards */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-[#0d0e0f] border border-gray-900 rounded-xl p-6 text-left flex flex-col justify-between min-h-80 hover:shadow-lg"
                        >
                            <div>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <span
                                        className={`font-mono text-[10px] tracking-wider uppercase ${cat.tagColor}`}
                                    >
                                        {cat.tag}
                                    </span>
                                    <span className="font-mono text-xs text-gray-300">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Image */}
                                <div className="flex items-center gap-4 mb-4">
                                    {cat.image && (
                                        <div className="w-14 h-14 mb-4 rounded-xl bg-gray-50 flex items-center justify-center">
                                            <img
                                                src={cat.image}
                                                alt={cat.title}
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                    )}

                                    <h3 className="text-lg font-extrabold text-gray-100 tracking-tight mb-4">
                                        {cat.title}
                                    </h3>
                                </div>

                                {/* Skills */}
                                <div className="space-y-2.5">
                                    {cat.skills.map((skill) => (
                                        <div
                                            key={skill.name}
                                            className="flex items-center justify-between px-3 py-2 border border-gray-900 rounded-lg"
                                        >
                                            <span className="font-mono text-sm text-gray-100">
                                                {skill.name}
                                            </span>
                                            <span
                                                className={`font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border ${levelColor[skill.level] ||
                                                    "text-gray-500 bg-gray-50 border-gray-200"
                                                    }`}
                                            >
                                                {skill.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                {/* <div className="mt-16 h-px w-full bg-linear-to-r from-transparent via-gray-300 to-transparent" /> */}

                {/* Bottom */}
                <p className="mt-8 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#685AFF] uppercase">
                    Focused on backend systems.
                </p>
            </div>
        </section>
    );
}
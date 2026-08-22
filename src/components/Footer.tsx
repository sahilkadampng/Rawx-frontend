import React from "react";






const DiagonalArrow: React.FC = () => (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="w-[9px] h-[9px]">
        <path
            d="M3 9 L9 3 M9 3 H4 M9 3 V8"
            stroke="#20D472"
            strokeWidth={1.6}
            strokeLinecap="round"
        />
    </svg>
);

const RightArrow: React.FC<{ stroke: string }> = ({ stroke }) => (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className="w-[12px] h-[12px]">
        <path
            d="M3 9 H15 M15 9 L10 4 M15 9 L10 14"
            stroke={stroke}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);




const ContourLines: React.FC = () => (
    <div aria-hidden="true" className="absolute inset-0 rounded-[28px] sm:rounded-[40px] overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 520" preserveAspectRatio="none" className="w-full h-full block">
            <g fill="none" stroke="#2C2C29" strokeWidth={1.5}>
                <path d="M-20 250 C 100 270 160 350 115 450 C 95 490 60 505 30 540" />
                <path d="M620 -20 C 600 70 520 110 430 95 C 340 80 300 120 288 170 C 278 210 300 250 345 268" />
                <path d="M470 540 C 505 430 610 390 715 358 C 830 323 885 255 873 150 C 866 85 830 35 780 -20" />
                <path d="M1080 -20 C 1095 130 1075 260 1120 360 C 1162 450 1255 495 1288 540" />
                <path d="M1150 -20 C 1160 140 1140 270 1190 375 C 1228 450 1325 492 1358 540" />
            </g>
        </svg>
    </div>
);


const AsteriskLogo: React.FC = () => {
    const arms: string[] = [
        "rotate(330) scale(1 .90)",
        "rotate(30)  scale(1 1.02)",
        "rotate(90)  scale(1 .96)",
        "rotate(150) scale(1 1.03)",
        "rotate(210) scale(1 .93)",
        "rotate(270) scale(1 1.00)",
    ];

    return (
        <svg
            viewBox="-105 -105 210 210"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[110px] h-[110px] z-[3]"
        >
            <defs>
                <pattern
                    id="zstripes"
                    width={240}
                    height={11}
                    patternUnits="userSpaceOnUse"
                    x={-120}
                    y={-120}
                >
                    <path
                        d="M-20,5.5 Q-10,1.8 0,5.5 T20,5.5 T40,5.5 T60,5.5 T80,5.5 T100,5.5 T120,5.5 T140,5.5 T160,5.5 T180,5.5 T200,5.5 T220,5.5 T240,5.5 T260,5.5"
                        fill="none"
                        stroke="#14C968"
                        strokeWidth={5}
                    />
                </pattern>
                <path
                    id="arm"
                    d="M-14 10 C-18 -14 -10 -38 -14 -62 C-16 -78 -8 -90 2 -89 C12 -88 16 -77 13 -62 C9 -38 18 -14 13 10 C8 18 -9 18 -14 10 Z"
                />
            </defs>

            
            <g fill="#131413">
                {arms.map((t) => (
                    <use key={`sil-${t}`} href="#arm" transform={t} />
                ))}
            </g>

            
            <g fill="url(#zstripes)">
                {arms.map((t) => (
                    <use key={`str-${t}`} href="#arm" transform={t} />
                ))}
            </g>

            
            <path
                d="M-4 88 q6 5 10 1"
                stroke="#14C968"
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
};



interface LinkItem {
    label: string;
    href: string;
}

export interface FooterProps {
    email?: string;
    phone?: string;
    addressLines?: string[];
    socials?: LinkItem[];
    quickLinksLeft?: LinkItem[];
    quickLinksRight?: LinkItem[];
}

const defaultSocials: LinkItem[] = [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
];

const defaultQuickLinksLeft: LinkItem[] = [
    { label: "Onze club", href: "#" },
    { label: "Voor gasten", href: "#" },
    { label: "Beginnen met Golf", href: "#" },
];

const defaultQuickLinksRight: LinkItem[] = [
    { label: "De baan", href: "#" },
    { label: "Onze evenementen", href: "#" },
    { label: "Contact", href: "#" },
];

const headingCls = "text-[#FFF6DA] text-[13.5px] font-bold tracking-[0.2px] mb-2";
const bodyTextCls = "text-[11.5px] text-[#E8E2C6]";

const Footer: React.FC<FooterProps> = ({
    email = "info@leeuwardergolfclub.nl",
    phone = "0511 - 43 22 99",
    addressLines = ["Woelwijk 101,", "8926 XD Leeuwarden"],
    socials = defaultSocials,
    quickLinksLeft = defaultQuickLinksLeft,
    quickLinksRight = defaultQuickLinksRight,
}) => {
    return (
        <footer className="relative bg-[#1E1E1C] rounded-[28px] sm:rounded-[40px] text-[#EFE9CC] font-['Helvetica_Neue',Helvetica,Arial,system-ui,sans-serif] antialiased">
            <ContourLines />
            <AsteriskLogo />

            <div className="relative z-[2] px-8 lg:px-11 pt-[72px] lg:pt-[78px] pb-[18px]">
                
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-x-7 gap-y-7 text-center lg:text-left">
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-7">
                        <div className="text-left">
                            <h3 className={headingCls}>Contact</h3>
                            <p className={`${bodyTextCls} leading-[1.7]`}>
                                {addressLines.map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                                {phone}
                                <br />
                                <a
                                    href={`mailto:${email}`}
                                    className="underline underline-offset-[3px] decoration-1"
                                >
                                    {email}
                                </a>
                            </p>
                        </div>

                        <div className="flex flex-col gap-[5px] pt-0 sm:pt-5">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    className={`${bodyTextCls} inline-flex items-center gap-1.5 no-underline transition-opacity hover:opacity-75`}
                                >
                                    {s.label}
                                    <DiagonalArrow />
                                </a>
                            ))}
                        </div>
                    </div>

                    
                    <div className="text-center">
                        <h1 className="font-serif font-bold text-[#FFF7DC] text-[24px] lg:text-[30px] leading-[1.05] tracking-[-1.2px]">
                            Leeuwarder
                            <br />
                            Golfclub
                        </h1>
                        <p className="font-serif italic text-[13px] text-[#F1EACA] mt-2">
                            Waar golfgeluk begint
                        </p>

                        <div className="flex flex-col items-center min-[560px]:flex-row min-[560px]:justify-center gap-3 mt-4">
                            <a
                                href="#"
                                className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-1 py-1 text-[12.5px] font-semibold whitespace-nowrap no-underline bg-[#20D472] text-[#0B241A] transition-transform hover:-translate-y-px"
                            >
                                Starttijd reserveren
                                <span className="w-[26px] h-[26px] rounded-full bg-[#0A2A1E] flex items-center justify-center flex-none">
                                    <RightArrow stroke="#20D472" />
                                </span>
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2.5 rounded-full pl-4 pr-1 py-1 text-[12.5px] font-semibold whitespace-nowrap no-underline bg-[#0C5133] text-[#FFF3C6] transition-transform hover:-translate-y-px"
                            >
                                Direct lid worden
                                <span className="w-[26px] h-[26px] rounded-full bg-[#20D472] flex items-center justify-center flex-none">
                                    <RightArrow stroke="#0B3A26" />
                                </span>
                            </a>
                        </div>
                    </div>

                    
                    <div className="justify-self-center lg:justify-self-end text-left">
                        <h3 className={headingCls}>Snel naar</h3>
                        <div className="flex gap-6 min-[561px]:gap-8">
                            <ul className="list-none">
                                {quickLinksLeft.map((l) => (
                                    <li key={l.label} className="my-1">
                                        <a
                                            href={l.href}
                                            className={`${bodyTextCls} no-underline transition-opacity hover:opacity-70`}
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <ul className="list-none">
                                {quickLinksRight.map((l) => (
                                    <li key={l.label} className="my-1">
                                        <a
                                            href={l.href}
                                            className={`${bodyTextCls} no-underline transition-opacity hover:opacity-70`}
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                
                <div className="mt-7 flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col items-center lg:items-start">
                        <span className="inline-flex items-center gap-1.5 bg-[#131312] border border-[#2C2C29] rounded-full pl-[2px] pr-2.5 py-[2px]">
                            <span className="bg-[#20D472] text-[#0B241A] font-extrabold text-[10px] rounded-[6px] px-1.5 py-[3px]">
                                7.9
                            </span>
                            <span className="text-[10.5px] text-[#A6D9B0] tracking-[0.1px]">
                                Leadingcourses score
                            </span>
                        </span>

                        <div className="flex gap-1.5 mt-2">
                            <span className="w-[17px] h-[11px] rounded-[2px] bg-[linear-gradient(135deg,#F2A23C,#DE7A1E)]" />
                            <span className="w-[17px] h-[11px] rounded-[2px] bg-[linear-gradient(180deg,#2B2B4E,#1C1C33)] shadow-[inset_0_0_0_1px_#3a3a5e]" />
                            <span className="w-[17px] h-[11px] rounded-[2px] bg-[linear-gradient(180deg,#D8402F_50%,#B22C1F_50%)]" />
                            <span className="w-[17px] h-[11px] rounded-[2px] bg-[linear-gradient(180deg,#AE1C28_33.3%,#FFFFFF_33.3%_66.6%,#21468B_66.6%)]" />
                        </div>
                    </div>

                    <div className="bg-[#FFF8D6] text-[#1D1D1B] rounded-full px-4 py-2 text-[11px] flex gap-4 items-center">
                        <a href="#" className="no-underline text-inherit hover:underline">
                            Cookies policy
                        </a>
                        <a href="#" className="no-underline text-inherit hover:underline">
                            Privacy policy
                        </a>
                        <span className="font-semibold">©2025</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

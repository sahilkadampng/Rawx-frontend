import { useEffect, useState } from 'react';
import { API_URL } from '../config/api';
import { useFeatureFlag } from '../context/FeatureFlagContext';

type SeriesPoint = {
    date: string;
    count: number;
};

type ActivityCardData = {
    username: string;
    source: string;
    series?: SeriesPoint[];
    updatedAt?: string;
    total?: number;
    peak?: number;
    streak?: number;
    ranking?: number | null;
    contestRating?: number | null;
    topPercentage?: number | null;
    totalSolved?: number;
    easySolved?: number;
    mediumSolved?: number;
    hardSolved?: number;
    error?: string;
};

type CardKind = 'github' | 'leetcode';

type Props = {
    githubUsername: string;
    leetcodeUsername: string;
};

const intensityClasses = {
    github: [
        'bg-slate-800/50 border-slate-700/70',
        'bg-cyan-500/12 border-cyan-500/18',
        'bg-cyan-500/24 border-cyan-500/28',
        'bg-cyan-500/40 border-cyan-400/32',
        'bg-cyan-400/70 border-cyan-300/40',
    ],
    leetcode: [
        'bg-slate-800/50 border-slate-700/70',
        'bg-violet-500/12 border-violet-500/18',
        'bg-violet-500/24 border-violet-500/28',
        'bg-violet-500/40 border-violet-400/32',
        'bg-violet-400/70 border-violet-300/40',
    ],
} as const;

const monthFormatter = new Intl.DateTimeFormat([], { month: 'short' });

const getMonthMarkers = (series: SeriesPoint[]) => {
    const markers = new Map<number, string>();

    series.forEach((point, index) => {
        const month = new Date(`${point.date}T00:00:00`);
        if (index % 7 === 0) {
            markers.set(index, monthFormatter.format(month));
        }
    });

    return markers;
};

const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return '—';
    }

    return new Intl.NumberFormat().format(value);
};

const buildLevel = (count: number, peak: number, tone: keyof typeof intensityClasses) => {
    if (count <= 0) {
        return intensityClasses[tone][0];
    }

    if (peak <= 1) {
        return intensityClasses[tone][2];
    }

    const ratio = count / peak;

    if (ratio < 0.25) {
        return intensityClasses[tone][1];
    }

    if (ratio < 0.5) {
        return intensityClasses[tone][2];
    }

    if (ratio < 0.75) {
        return intensityClasses[tone][3];
    }

    return intensityClasses[tone][4];
};

const Heatmap = ({
    data,
    tone,
}: {
    data: SeriesPoint[];
    tone: keyof typeof intensityClasses;
}) => {
    const peak = data.reduce((max, point) => Math.max(max, point.count), 0);
    const monthMarkers = getMonthMarkers(data);
    const totalActivity = data.reduce((sum, point) => sum + point.count, 0);
    const activeDays = data.filter((point) => point.count > 0).length;

    return (
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">Contribution heatmap</p>
                    <p className="mt-1 text-sm text-slate-300">{data.length ? `${data.length} days of public activity` : 'No activity data yet'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        {totalActivity} total
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        {activeDays} active days
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">
                <span>Older</span>
                <div className="flex items-center gap-1.5 text-slate-400 normal-case tracking-normal">
                    <span className="h-2.5 w-2.5 rounded-sm border border-slate-700/80 bg-slate-800/60" />
                    <span>less</span>
                    <span className="h-2.5 w-2.5 rounded-sm border border-cyan-400/20 bg-cyan-500/20" />
                    <span>more</span>
                    <span className="h-2.5 w-2.5 rounded-sm border border-cyan-300/35 bg-cyan-400/70" />
                </div>
                <span>Newer</span>
            </div>

            <div className="mt-4 grid grid-flow-col grid-rows-7 gap-1 overflow-hidden">
                {data.map((point, index) => (
                    <span
                        key={point.date}
                        title={`${point.date} · ${point.count} activity`}
                        className={`relative h-4 w-4 rounded-md border ${buildLevel(point.count, peak, tone)} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.22)]`}
                    >
                        {monthMarkers.has(index) ? (
                            <span className="absolute -top-4 left-0 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">
                                {monthMarkers.get(index)}
                            </span>
                        ) : null}
                    </span>
                ))}
            </div>
        </div>
    );
};

const StatPill = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
);

const ActivityCard = ({
    title,
    subtitle,
    tone,
    href,
    data,
    fallback,
    kind,
}: {
    title: string;
    subtitle: string;
    tone: keyof typeof intensityClasses;
    href: string;
    data: ActivityCardData | null;
    fallback: string;
    kind: CardKind;
}) => {
    const series = data?.series || [];
    const hasError = Boolean(data?.error);

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 transition-all shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{title}</p>
                    <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-slate-500 mt-1">{subtitle}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-mono tracking-[0.22em] uppercase ${kind === 'github' ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200' : 'border-violet-400/20 bg-violet-500/10 text-violet-200'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${kind === 'github' ? 'bg-cyan-300' : 'bg-violet-300'}`} />
                    Live
                </span>
            </div>

            <div className="mt-4 space-y-4">
                {hasError ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-5 text-center">
                        <p className="text-sm text-slate-300">{data?.error}</p>
                        <p className="mt-2 text-xs text-slate-500">{fallback}</p>
                    </div>
                ) : series.length ? (
                    <Heatmap data={series} tone={tone} />
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-5 text-center">
                        <p className="text-sm text-slate-300">{fallback}</p>
                    </div>
                )}

                {data ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <StatPill label={kind === 'github' ? 'Recent events' : 'Solved'} value={formatNumber(kind === 'github' ? data.total : data.totalSolved)} />
                        <StatPill label={kind === 'github' ? 'Streak' : 'Ranking'} value={kind === 'github' ? `${formatNumber(data.streak)}d` : formatNumber(data.ranking)} />
                        <StatPill label={kind === 'github' ? 'Peak day' : 'Rating'} value={kind === 'github' ? formatNumber(data.peak) : formatNumber(data.contestRating)} />
                    </div>
                ) : null}

                {data && kind === 'leetcode' ? (
                    <div className="grid grid-cols-3 gap-2">
                        <StatPill label="Easy" value={formatNumber(data.easySolved)} />
                        <StatPill label="Medium" value={formatNumber(data.mediumSolved)} />
                        <StatPill label="Hard" value={formatNumber(data.hardSolved)} />
                    </div>
                ) : null}

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {kind === 'github'
                            ? 'Recent public activity is pulled live from GitHub and rendered as a concise contribution grid.'
                            : 'LeetCode activity is pulled live and normalized into a daily view with solved-problem summaries.'}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-[10px] font-mono tracking-[0.22em] text-slate-500 uppercase">
                <span>Updated {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Live'}</span>
                <span>{kind === 'github' ? 'public events' : 'submission calendar'}</span>
            </div>
        </a>
    );
};

export default function ProfileActivityCards({ githubUsername, leetcodeUsername }: Props) {
    const [github, setGithub] = useState<ActivityCardData | null>(null);
    const [leetcode, setLeetcode] = useState<ActivityCardData | null>(null);
    const [loading, setLoading] = useState(true);
    const githubVisible = useFeatureFlag('content.footer.githubActivity');
    const leetcodeVisible = useFeatureFlag('content.footer.leetcodeActivity');
    const visibleCardCount = Number(Boolean(githubVisible)) + Number(Boolean(leetcodeVisible));

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);

                const query = new URLSearchParams();
                query.set('github', githubUsername);

                if (leetcodeUsername) {
                    query.set('leetcode', leetcodeUsername);
                }

                const response = await fetch(`${API_URL}/profile-activity?${query.toString()}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const payload = await response.json();
                setGithub(payload?.data?.github || null);
                setLeetcode(payload?.data?.leetcode || null);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    setGithub({
                        username: githubUsername,
                        source: `https://github.com/${githubUsername}`,
                    });
                    setLeetcode(
                        leetcodeUsername
                            ? {
                                username: leetcodeUsername,
                                source: `https://leetcode.com/u/${leetcodeUsername}`,
                            }
                            : null
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        load();

        return () => controller.abort();
    }, [githubUsername, leetcodeUsername]);

    if (visibleCardCount === 0) {
        return null;
    }

    return (
        <div className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Profile activity</p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-100">Live contribution snapshots</h3>
                </div>
                <p className="max-w-xs text-right text-xs text-slate-500 leading-relaxed">
                    Clean public activity cards for GitHub and LeetCode, updated from live profile data.
                </p>
            </div>

            {visibleCardCount > 0 ? (
                <div className={`grid grid-cols-1 ${visibleCardCount > 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
                    {githubVisible ? (
                        <ActivityCard
                            title="GitHub Activity"
                            subtitle={loading ? 'Loading live activity' : 'Recent public activity'}
                            tone="github"
                            href={github?.source || `https://github.com/${githubUsername}`}
                            data={github}
                            fallback="Set the GitHub username to see a live contribution grid."
                            kind="github"
                        />
                    ) : null}

                    {leetcodeVisible ? (
                        <ActivityCard
                            title="LeetCode Activity"
                            subtitle={loading ? 'Loading live activity' : 'Problem solving stats'}
                            tone="leetcode"
                            href={leetcode?.source || (leetcodeUsername ? `https://leetcode.com/u/${leetcodeUsername}` : 'https://leetcode.com/')}
                            data={leetcode}
                            fallback={leetcodeUsername ? 'LeetCode stats are loading live.' : 'Set VITE_LEETCODE_USERNAME to show a live LeetCode widget.'}
                            kind="leetcode"
                        />
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
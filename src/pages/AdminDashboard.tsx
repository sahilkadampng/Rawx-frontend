import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoDownloadOutline,
    IoCalendarOutline,
    IoTrendingUpOutline,
    IoTrendingDownOutline,
    IoPeopleOutline,
    IoMailOutline,
    IoShieldCheckmarkOutline,
    IoPulseOutline,
    IoListOutline,
    IoSettingsOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

import { API_URL } from '../config/api';
import { useNotification } from '../context/NotificationContext';
import ConfirmationModal from '../components/ConfirmationModal';
import FeatureFlagsPanel from '../components/FeatureFlagsPanel';

// --- Types ---

interface EmailEntry {
    _id: string;
    email: string;
    source: string;
    status: 'new' | 'contacted' | 'archived';
    createdAt: string;
}

interface EmailStats {
    total: number;
    new: number;
    contacted: number;
    archived: number;
}

interface VisitorEntry {
    _id: string;
    ip: string;
    device: string;
    browser: string;
    os: string;
    page: string;
    referrer: string;
    country: string;
    city: string;
    region: string;
    createdAt: string;
}

interface VisitorStats {
    total: number;
    unique: number;
    today: number;
}

interface BlockedEntry {
    _id: string;
    ip: string;
    reason: string;
    requestCount: number;
    active: boolean;
    createdAt: string;
}

interface ActivityItem {
    type: 'visitor' | 'email';
    data: string;
    time: string;
}

type Tab = 'overview' | 'emails' | 'visitors' | 'blocked';
type ExtendedTab = Tab | 'flags';

// --- Sub-Components ---

const StatsChart = ({ data, label, color = '#3b82f6' }: { data: number[], label: string, color?: string }) => {
    const max = Math.max(...data, 1);
    const height = 100;
    const width = 400;
    const padding = 10;

    const points = useMemo(() => {
        if (data.length === 0) return '';
        const step = (width - padding * 2) / (data.length - 1 || 1);
        return data.map((val, i) => `${padding + i * step},${height - padding - (val / max) * (height - padding * 2)}`).join(' ');
    }, [data, max]);

    return (
        <div className="w-full bg-white border border-gray-100 rounded-2xl p-4 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2">
                <span className="font-mono text-[10px] tracking-wider text-gray-400 uppercase">{label}</span>
                <span className="font-mono text-xs text-blue-600 font-bold">{data[data.length - 1] || 0}</span>
            </div>
            <div className="relative h-20 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d">
                    <defs>
                        <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <motion.path
                        d={`M ${padding},${height} L ${points} L ${width - padding},${height} Z`}
                        fill={`url(#gradient-${label})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                </svg>
            </div>
        </div>
    );
};

// --- Main Component ---

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ExtendedTab>('overview');
    const [adminEmail, setAdminEmail] = useState('');
    const token = localStorage.getItem('raw_token');

    // --- Common UI state ---
    const { notifySuccess, notifyError } = useNotification();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning' | 'info';
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    // --- Stats state ---
    const [trends, setTrends] = useState<{ visitors: number[], emails: number[] }>({ visitors: [], emails: [] });
    const [overviewStats, setOverviewStats] = useState<any>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);

    // --- Email state ---
    const [emails, setEmails] = useState<EmailEntry[]>([]);
    const [emailStats, setEmailStats] = useState<EmailStats>({ total: 0, new: 0, contacted: 0, archived: 0 });
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailFilter, setEmailFilter] = useState('all');
    const [emailSearch, setEmailSearch] = useState('');
    const [emailPage, setEmailPage] = useState(1);
    const [emailTotalPages, setEmailTotalPages] = useState(1);

    // --- Visitor state ---
    const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
    const [visitorStats, setVisitorStats] = useState<VisitorStats>({ total: 0, unique: 0, today: 0 });
    const [visitorLoading, setVisitorLoading] = useState(false);
    const [visitorSearch, setVisitorSearch] = useState('');
    const [visitorPage, setVisitorPage] = useState(1);
    const [visitorMenuOpen, setVisitorMenuOpen] = useState<string | null>(null);
    const visitorMenuRef = useRef<HTMLDivElement>(null);

    // --- Blocked state ---
    const [blocked, setBlocked] = useState<BlockedEntry[]>([]);
    const [blockedLoading, setBlockedLoading] = useState(false);

    // Auth verify
    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetch(`${API_URL}/auth/verify`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data.status !== 'success') { localStorage.removeItem('raw_token'); navigate('/login'); }
                else setAdminEmail(data.admin.email);
            })
            .catch(() => { localStorage.removeItem('raw_token'); navigate('/login'); });
    }, [token, navigate]);

    // --- Fetchers ---

    const fetchOverviewData = useCallback(async () => {
        if (!token) return;
        try {
            const [overview, trendsRes, activityRes] = await Promise.all([
                fetch(`${API_URL}/stats/overview`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
                fetch(`${API_URL}/stats/trends`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
                fetch(`${API_URL}/stats/activity`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
            ]);

            if (overview.status === 'success') setOverviewStats(overview.data);
            if (trendsRes.status === 'success') setTrends(trendsRes.data);
            if (activityRes.status === 'success') setActivity(activityRes.data);
        } catch (err) { console.error('Overview error:', err); }
    }, [token]);

    const fetchEmails = useCallback(async () => {
        if (!token) return;
        setEmailLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(emailPage),
                limit: '15',
                status: emailFilter,
                search: emailSearch,
                startDate,
                endDate
            });
            const res = await fetch(`${API_URL}/emails?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.status === 'success') {
                setEmails(data.data);
                setEmailStats(data.stats);
                setEmailTotalPages(data.meta.pages);
            }
        } catch (err) { console.error('Fetch emails:', err); }
        finally { setEmailLoading(false); }
    }, [token, emailPage, emailFilter, emailSearch, startDate, endDate]);

    const fetchVisitors = useCallback(async () => {
        if (!token) return;
        setVisitorLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(visitorPage),
                limit: '20',
                search: visitorSearch,
                startDate,
                endDate
            });
            const res = await fetch(`${API_URL}/visitors?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.status === 'success') {
                setVisitors(data.data);
                setVisitorStats(data.stats);
            }
        } catch (err) { console.error('Fetch visitors:', err); }
        finally { setVisitorLoading(false); }
    }, [token, visitorPage, visitorSearch, startDate, endDate]);

    const fetchBlocked = useCallback(async () => {
        if (!token) return;
        setBlockedLoading(true);
        try {
            const res = await fetch(`${API_URL}/visitors/blocked`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.status === 'success') {
                setBlocked(data.data);
            }
        } catch (err) { console.error('Fetch blocked:', err); }
        finally { setBlockedLoading(false); }
    }, [token]);

    // --- Tab-based Effects ---
    useEffect(() => {
        if (activeTab === 'overview') fetchOverviewData();
        else if (activeTab === 'emails') fetchEmails();
        else if (activeTab === 'visitors') fetchVisitors();
        else if (activeTab === 'blocked') fetchBlocked();
    }, [activeTab, fetchOverviewData, fetchEmails, fetchVisitors, fetchBlocked]);

    // Close visitor menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (visitorMenuRef.current && !visitorMenuRef.current.contains(e.target as Node)) {
                setVisitorMenuOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Handlers ---

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        notifySuccess('Copied to clipboard');
        setVisitorMenuOpen(null);
    };

    const exportData = async () => {
        if (!token) return;
        setIsExporting(true);
        try {
            const endpoint = activeTab === 'emails' ? 'emails/export' : 'visitors/export';
            const params = new URLSearchParams({
                status: emailFilter,
                search: activeTab === 'emails' ? emailSearch : visitorSearch,
                startDate,
                endDate
            });
            const res = await fetch(`${API_URL}/${endpoint}?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${activeTab}-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                notifySuccess(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} exported successfully.`);
            } else throw new Error('Export failed');
        } catch (err) {
            notifyError('Failed to export data.');
            console.error('Export error:', err);
        } finally { setIsExporting(false); }
    };

    const blockVisitorIP = (ip: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Block IP Address',
            message: `Are you sure you want to block ${ip}? This will restrict their access to the API.`,
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await fetch(`${API_URL}/visitors/block-ip`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ ip, reason: 'Manually blocked from admin panel' }),
                    });
                    notifySuccess(`IP ${ip} blocked.`);
                    fetchVisitors();
                    fetchBlocked();
                } catch (err) { notifyError('Failed to block IP.'); }
            }
        });
        setVisitorMenuOpen(null);
    };

    const deleteVisitor = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Record',
            message: 'This action cannot be undone. Permanent deletion of visitor metrics.',
            onConfirm: async () => {
                try {
                    await fetch(`${API_URL}/visitors/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    notifySuccess('Visitor record deleted.');
                    fetchVisitors();
                } catch (err) { notifyError('Failed to delete visitor.'); }
            }
        });
        setVisitorMenuOpen(null);
    };

    const updateEmailStatus = async (id: string, status: string) => {
        try {
            await fetch(`${API_URL}/emails/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
            notifySuccess(`Status updated to ${status}.`);
            fetchEmails();
        } catch (err) { notifyError('Failed to update status.'); }
    };

    const deleteEmail = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Email',
            message: 'Are you sure you want to delete this email entry permanently?',
            onConfirm: async () => {
                try {
                    await fetch(`${API_URL}/emails/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    notifySuccess('Email deleted.');
                    fetchEmails();
                } catch (err) { notifyError('Failed to delete email.'); }
            }
        });
    };

    const toggleBlock = async (id: string) => {
        try {
            await fetch(`${API_URL}/visitors/blocked/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
            notifySuccess('Block status updated.');
            fetchBlocked();
        } catch (err) { notifyError('Failed to update block status.'); }
    };

    const logout = () => { localStorage.removeItem('raw_token'); navigate('/'); };
    const canExport = activeTab === 'emails' || activeTab === 'visitors';

    const statusColor: Record<string, string> = {
        new: 'text-green-600 bg-green-50 border-green-200',
        contacted: 'text-blue-600 bg-blue-50 border-blue-200',
        archived: 'text-gray-500 bg-gray-50 border-gray-200',
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const tabs: { key: ExtendedTab; label: string; icon: any }[] = [
        { key: 'overview', label: 'Overview', icon: IoPulseOutline },
        { key: 'emails', label: 'Emails', icon: IoMailOutline },
        { key: 'visitors', label: 'Visitors', icon: IoPeopleOutline },
        { key: 'blocked', label: 'Blocked IPs', icon: IoShieldCheckmarkOutline },
        { key: 'flags', label: 'Flags', icon: IoSettingsOutline },
    ];

    return (
        <main className="bg-[#f4f6fb] min-h-screen pb-20">
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Top bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="font-arimo text-xl font-bold text-black group flex items-center gap-2">
                            <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">R</span>
                            <span className="tracking-tighter">RAW.</span>
                        </a>
                        <span className="hidden sm:block h-5 w-px bg-gray-100" />
                        <span className="hidden sm:block font-mono text-[10px] tracking-wider text-gray-400 uppercase">System :: Control Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-mono text-[10px] tracking-wider text-green-700 font-bold uppercase">{adminEmail}</span>
                        </div>
                        <button onClick={logout} className="px-5 py-2 text-sm font-semibold font-arimo text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-2xl hover:border-red-100 transition-all cursor-pointer">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-blue-600 uppercase mb-3">
                            <IoShieldCheckmarkOutline className="text-sm" />
                            <span>Infrastructure :: v2.5 :: Secure</span>
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 uppercase tracking-tight leading-none">
                            Admin <span className="text-blue-600">Insights.</span>
                        </h1>
                    </div>

                    {/* Global Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                            <IoCalendarOutline className="text-gray-400" />
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="font-mono text-[10px] uppercase outline-none text-gray-600 cursor-pointer bg-transparent" />
                            <span className="text-gray-300">→</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="font-mono text-[10px] uppercase outline-none text-gray-600 cursor-pointer bg-transparent" />
                            {(startDate || endDate) && <button onClick={() => { setStartDate(''); setEndDate(''); }} className="ml-2 text-red-500 hover:text-red-700 transition cursor-pointer">✕</button>}
                        </div>
                        {canExport && (
                            <button onClick={exportData} disabled={isExporting} className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-mono text-[10px] tracking-wider uppercase rounded-2xl hover:bg-gray-800 transition shadow-lg shadow-black/10 cursor-pointer disabled:opacity-50">
                                <IoDownloadOutline className={`text-sm ${isExporting ? 'animate-bounce' : ''}`} />
                                {isExporting ? 'Exporting...' : 'Export CSV'}
                            </button>
                        )}
                    </div>
                </header>

                {/* Main Tabs Navigation */}
                <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-0 overflow-x-auto no-scrollbar">
                    {tabs.map((t) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-8 py-4 font-mono text-[10px] tracking-widest uppercase transition-all relative border-b-2 -mb-px whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === t.key ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                            <t.icon className="text-sm" />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ============ OVERVIEW TAB ============ */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Visits', val: overviewStats?.visitors.total || 0, icon: IoPeopleOutline, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Unique IPs', val: overviewStats?.visitors.unique || 0, icon: IoShieldCheckmarkOutline, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { label: 'Lead Emails', val: overviewStats?.emails.total || 0, icon: IoMailOutline, color: 'text-green-600', bg: 'bg-green-50' },
                                { label: 'System Blocks', val: overviewStats?.blocked.active || 0, icon: IoTrendingDownOutline, color: 'text-red-600', bg: 'bg-red-50' },
                            ].map((card, i) => (
                                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group">
                                    <div className={`${card.bg} ${card.color} w-10 h-10 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform`}>
                                        <card.icon />
                                    </div>
                                    <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-1">{card.label}</p>
                                    <h3 className="text-3xl font-black text-gray-900">{card.val.toLocaleString()}</h3>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-mono text-xs tracking-widest text-gray-400 uppercase flex items-center gap-2">
                                    <IoTrendingUpOutline className="text-blue-600" /> Traffic Trend // 15d
                                </h4>
                                <StatsChart data={trends.visitors.length ? trends.visitors : [0, 0, 0, 0, 0]} label="Visitor Volume" color="#3b82f6" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-mono text-xs tracking-widest text-gray-400 uppercase flex items-center gap-2">
                                    <IoMailOutline className="text-green-600" /> Conversion Trend // 15d
                                </h4>
                                <StatsChart data={trends.emails.length ? trends.emails : [0, 0, 0, 0, 0]} label="Email Submissions" color="#10b981" />
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="font-mono text-xs tracking-widest text-gray-400 uppercase flex items-center gap-2">
                                        <IoListOutline /> System Activity Hub
                                    </h4>
                                    <button onClick={fetchOverviewData} className="text-[10px] font-mono tracking-widest text-blue-600 uppercase hover:underline">Sync Live Data</button>
                                </div>
                                <div className="space-y-6">
                                    {activity.length === 0 && (
                                        <p className="text-center py-10 font-mono text-xs text-gray-400 uppercase tracking-widest">∅ No recent logs available.</p>
                                    )}
                                    {activity.map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 group">
                                            <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-gray-200 group-hover:bg-blue-500 transition-colors" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-md ${item.type === 'visitor' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-gray-300 uppercase">{formatDate(item.time)}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 font-arimo">{item.data}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Status / Health */}
                            <div className="space-y-8">
                                <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md text-2xl">
                                            <IoPulseOutline />
                                        </div>
                                        <span className="font-mono text-[10px] tracking-wider bg-white/20 px-3 py-1.5 rounded-full uppercase font-bold">Node-01 :: Live</span>
                                    </div>
                                    <p className="font-mono text-[10px] tracking-widest uppercase opacity-70 mb-2">Platform Utilization</p>
                                    <h3 className="text-4xl font-black mb-4">Stable.</h3>
                                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                                        <motion.div initial={{ width: 0 }} animate={{ width: overviewStats ? '62%' : '0%' }} className="h-full bg-white shadow-[0_0_10px_white]" />
                                    </div>
                                    <div className="flex justify-between font-mono text-[9px] uppercase opacity-50">
                                        <span>CPU: 42%</span>
                                        <span>MEM: 1.8GB</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                                    <h4 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-6 flex items-center gap-2">
                                        <IoSettingsOutline /> Quick Config
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Maintenance Mode', status: 'Inactive', color: 'text-gray-400' },
                                            { label: 'Cloudfire Sync', status: 'Operational', color: 'text-green-500' },
                                            { label: 'API Version', status: 'v2.5.4', color: 'text-blue-500' }
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                <span className="text-xs font-arimo text-gray-600">{item.label}</span>
                                                <span className={`font-mono text-[10px] uppercase font-bold ${item.color}`}>{item.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-3 border border-gray-100 rounded-2xl font-mono text-[10px] tracking-widest uppercase text-gray-400 hover:bg-gray-50 transition cursor-not-allowed">
                                        Manage System Core
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ============ EMAILS TAB ============ */}
                {activeTab === 'emails' && (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                            {[
                                { value: emailStats.total, label: 'Total Leads', color: 'text-gray-900', icon: IoMailOutline },
                                { value: emailStats.new, label: 'New Entries', color: 'text-green-600', icon: IoTrendingUpOutline },
                                { value: emailStats.contacted, label: 'Contacted', color: 'text-blue-600', icon: IoPeopleOutline },
                                { value: emailStats.archived, label: 'Archived', color: 'text-gray-500', icon: IoShieldCheckmarkOutline },
                            ].map((s) => (
                                <div key={s.label} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                            <s.icon className={`text-xl ${s.color}`} />
                                        </div>
                                    </div>
                                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                                    <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
                            <div className="relative flex-1 w-full">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">FIND // </span>
                                <input type="text" placeholder="Search entries..." value={emailSearch}
                                    onChange={(e) => { setEmailSearch(e.target.value); setEmailPage(1); }}
                                    className="w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[#f4f6fb] text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-100 transition font-arimo"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['all', 'new', 'contacted', 'archived'].map((f) => (
                                    <button key={f} onClick={() => { setEmailFilter(f); setEmailPage(1); }}
                                        className={`px-4 py-2 rounded-xl font-mono text-[10px] tracking-wider uppercase transition cursor-pointer ${emailFilter === f ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 bg-white border border-gray-100'
                                            }`}>{f}</button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                            <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-5 bg-gray-50/50 border-b border-gray-100">
                                <div className="col-span-5 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Identity // Email</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Channel</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">State</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Registration</div>
                            </div>
                            {emailLoading ? (
                                <div className="px-8 py-16 text-center">
                                    <span className="inline-block w-8 h-8 border-[3px] border-gray-100 border-t-blue-600 rounded-full animate-spin" />
                                    <p className="mt-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Syncing node data...</p>
                                </div>
                            ) : (
                                emails.map((entry) => (
                                    <motion.div layout key={entry._id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-8 py-5 border-b border-gray-50 hover:bg-blue-50/10 transition items-center group">
                                        <div className="sm:col-span-5"><span className="text-sm font-arimo font-semibold text-gray-800">{entry.email}</span></div>
                                        <div className="sm:col-span-2"><span className="font-mono text-[10px] tracking-wider text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded-lg">{entry.source}</span></div>
                                        <div className="sm:col-span-2">
                                            <select value={entry.status} onChange={(e) => updateEmailStatus(entry._id, e.target.value)}
                                                className={`font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-xl border-none ring-1 ring-gray-100 cursor-pointer shadow-sm ${statusColor[entry.status]}`}>
                                                <option value="new">● New</option>
                                                <option value="contacted">● Contacted</option>
                                                <option value="archived">● Archived</option>
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2"><span className="font-mono text-[10px] tracking-wider text-gray-400">{formatDate(entry.createdAt)}</span></div>
                                        <div className="sm:col-span-1 text-right">
                                            <button onClick={() => deleteEmail(entry._id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {emailTotalPages > 1 && (
                            <div className="mt-8 flex items-center justify-between">
                                <button onClick={() => setEmailPage((p) => Math.max(1, p - 1))} disabled={emailPage === 1}
                                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl font-mono text-[10px] tracking-widest uppercase text-gray-500 hover:border-gray-300 disabled:opacity-40 transition cursor-pointer">← Prev</button>
                                <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">Page {emailPage} // {emailTotalPages}</span>
                                <button onClick={() => setEmailPage((p) => Math.min(emailTotalPages, p + 1))} disabled={emailPage === emailTotalPages}
                                    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl font-mono text-[10px] tracking-widest uppercase text-gray-500 hover:border-gray-300 disabled:opacity-40 transition cursor-pointer">Next →</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ============ VISITORS TAB ============ */}
                {activeTab === 'visitors' && (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {[
                                { value: visitorStats.total, label: 'Accumulated Hits', color: 'text-gray-900', icon: IoTrendingUpOutline },
                                { value: visitorStats.unique, label: 'Distinct Source IPs', color: 'text-blue-600', icon: IoPeopleOutline },
                                { value: visitorStats.today, label: 'New Sessions Today', color: 'text-green-600', icon: IoShieldCheckmarkOutline },
                            ].map((s) => (
                                <div key={s.label} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-gray-50 rounded-2xl"><s.icon className={`text-xl ${s.color}`} /></div>
                                    </div>
                                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                                    <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-6 shadow-sm">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">QUERY // </span>
                                <input type="text" placeholder="Filter by IP, device, location..." value={visitorSearch}
                                    onChange={(e) => { setVisitorSearch(e.target.value); setVisitorPage(1); }}
                                    className="w-full pl-24 pr-4 py-3.5 rounded-2xl bg-[#f4f6fb] text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-100 transition font-arimo"
                                />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                            <div className="hidden sm:grid grid-cols-14 gap-4 px-8 py-5 bg-gray-50/50 border-b border-gray-100">
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Node // IP</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Region</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">System</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Client</div>
                                <div className="col-span-1 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Kernel</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Target</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Timestamp</div>
                            </div>
                            {visitorLoading ? (
                                <div className="px-8 py-16 text-center">
                                    <span className="inline-block w-8 h-8 border-[3px] border-gray-100 border-t-blue-600 rounded-full animate-spin" />
                                    <p className="mt-4 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Mapping network traffic...</p>
                                </div>
                            ) : (
                                visitors.map((v) => (
                                    <motion.div layout key={v._id} className="grid grid-cols-1 sm:grid-cols-14 gap-2 sm:gap-4 px-8 py-5 border-b border-gray-50 hover:bg-gray-50/80 transition items-center">
                                        <div className="sm:col-span-2"><span className="font-mono text-xs font-bold text-gray-800 tracking-tight">{v.ip}</span></div>
                                        <div className="sm:col-span-2 text-xs text-gray-500 font-arimo">{v.city !== 'Unknown' ? `${v.city}, ` : ''}{v.country}</div>
                                        <div className="sm:col-span-2 font-mono text-[10px] text-gray-400 uppercase">{v.device}</div>
                                        <div className="sm:col-span-2 font-mono text-[10px] text-gray-400 uppercase">{v.browser}</div>
                                        <div className="sm:col-span-1 font-mono text-[10px] text-gray-400 uppercase">{v.os}</div>
                                        <div className="sm:col-span-2 font-mono text-[10px] text-blue-600 font-bold underline decoration-blue-100 underline-offset-4">{v.page}</div>
                                        <div className="sm:col-span-2 font-mono text-[10px] text-gray-400">{formatDate(v.createdAt)}</div>
                                        <div className="sm:col-span-1 text-right relative">
                                            <button onClick={() => setVisitorMenuOpen(visitorMenuOpen === v._id ? null : v._id)} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                                                <IoListOutline className="text-gray-400" />
                                            </button>
                                            <AnimatePresence>
                                                {visitorMenuOpen === v._id && (
                                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} ref={visitorMenuRef} className="absolute right-0 top-10 z-100 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 overflow-hidden text-left">
                                                        <button onClick={() => copyToClipboard(v.ip)} className="w-full px-5 py-3 text-[10px] font-mono tracking-widest text-gray-600 hover:bg-gray-50 uppercase transition-colors">→ Copy IP</button>
                                                        <button onClick={() => blockVisitorIP(v.ip)} className="w-full px-5 py-3 text-[10px] font-mono tracking-widest text-red-600 hover:bg-red-50 uppercase transition-colors">⚠ Block Interface</button>
                                                        <button onClick={() => deleteVisitor(v._id)} className="w-full px-5 py-3 text-[10px] font-mono tracking-widest text-red-600 hover:bg-red-50 uppercase transition-colors">× Erase Metrics</button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ============ BLOCKED ============ */}
                {activeTab === 'blocked' && (
                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm mt-8">
                            <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-5 bg-gray-50/50 border-b border-gray-100">
                                <div className="col-span-3 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Blocked // IP</div>
                                <div className="col-span-3 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Reason Code</div>
                                <div className="col-span-1 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Freq</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Metric</div>
                                <div className="col-span-2 font-mono text-[10px] tracking-widest text-gray-400 uppercase">Assigned At</div>
                            </div>
                            {blockedLoading ? (
                                <div className="px-8 py-16 text-center"><span className="inline-block w-8 h-8 border-[3px] border-gray-100 border-t-red-600 rounded-full animate-spin" /></div>
                            ) : (
                                blocked.map((b) => (
                                    <div key={b._id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-8 py-5 border-b border-gray-50 hover:bg-red-50/10 transition items-center">
                                        <div className="sm:col-span-3 font-mono text-xs font-bold text-gray-900">{b.ip}</div>
                                        <div className="sm:col-span-3 font-mono text-[10px] text-gray-500 uppercase">{b.reason}</div>
                                        <div className="sm:col-span-1 font-mono text-xs text-red-600 font-black">{b.requestCount}</div>
                                        <div className="sm:col-span-2">
                                            <span className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-xl shadow-sm ${b.active ? 'text-red-700 bg-red-50' : 'text-green-700 bg-green-50'}`}>{b.active ? 'Blocked' : 'Clean'}</span>
                                        </div>
                                        <div className="sm:col-span-2 font-mono text-[10px] text-gray-400">{formatDate(b.createdAt)}</div>
                                        <div className="sm:col-span-1 text-right flex justify-end gap-2">
                                            <button onClick={() => toggleBlock(b._id)} className={`font-mono text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${b.active ? 'text-green-600 hover:text-green-800' : 'text-red-500 hover:text-red-700'}`}>{b.active ? 'Unlock' : 'Lock'}</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'flags' && <FeatureFlagsPanel />}

                {/* System Diagnostics Footer */}
                <footer className="mt-20 border-t border-gray-200 pt-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <div className="flex items-center gap-6">
                            <div className="font-black text-2xl tracking-tighter">RAW.SYS</div>
                            <span className="font-mono text-[10px] uppercase tracking-widest">Build 2.5.4-Stable</span>
                        </div>
                        <p className="font-mono text-[10px] text-center tracking-[0.3em] uppercase">Secure Operational Interface // Terminal 01 // Restricted Access</p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config/api';
import { useNotification } from '../context/NotificationContext';

type FlagCategory = 'page' | 'content' | 'navigation';

interface FeatureFlagRow {
    key: string;
    label: string;
    category: FlagCategory;
    route: string;
    target: string;
    description: string;
    enabled: boolean;
}

const categoryOrder: FlagCategory[] = ['page', 'navigation', 'content'];

export default function FeatureFlagsPanel() {
    const token = localStorage.getItem('raw_token');
    const { notifyError, notifySuccess } = useNotification();
    const [flags, setFlags] = useState<FeatureFlagRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingKey, setSavingKey] = useState<string | null>(null);

    const fetchFlags = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/flags`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.status === 'success') {
                setFlags(data.data);
            }
        } catch (error) {
            console.error('Flag fetch error:', error);
            notifyError('Failed to load feature flags.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlags();
    }, [token]);

    const groupedFlags = useMemo(() => {
        return categoryOrder.reduce((accumulator, category) => {
            accumulator[category] = flags.filter((flag) => flag.category === category);
            return accumulator;
        }, {} as Record<FlagCategory, FeatureFlagRow[]>);
    }, [flags]);

    const toggleFlag = async (flag: FeatureFlagRow) => {
        if (!token) return;

        setSavingKey(flag.key);
        try {
            const res = await fetch(`${API_URL}/flags/${flag.key}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ enabled: !flag.enabled }),
            });
            const data = await res.json();

            if (data.status === 'success') {
                setFlags((current) => current.map((item) => item.key === flag.key ? data.data : item));
                window.dispatchEvent(new Event('feature-flags-updated'));
                notifySuccess(`${flag.label} updated.`);
            } else {
                notifyError(data.message || 'Failed to update feature flag.');
            }
        } catch (error) {
            console.error('Flag update error:', error);
            notifyError('Failed to update feature flag.');
        } finally {
            setSavingKey(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categoryOrder.map((category) => (
                    <div key={category} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                        <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-2">{category}</p>
                        <h3 className="text-3xl font-black text-gray-900">{groupedFlags[category]?.length || 0}</h3>
                        <p className="text-xs text-gray-500 mt-1">Visible controls in this category</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categoryOrder.map((category) => (
                    <div key={category} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">{category}</p>
                                <h3 className="text-xl font-black text-gray-900 capitalize">{category} Flags</h3>
                            </div>
                            <button onClick={fetchFlags} className="text-[10px] font-mono tracking-widest uppercase text-blue-600 hover:underline">
                                Refresh
                            </button>
                        </div>

                        <div className="space-y-3">
                            {loading && flags.length === 0 ? (
                                <div className="py-10 text-center font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                                    Loading flags...
                                </div>
                            ) : groupedFlags[category]?.length ? (
                                groupedFlags[category].map((flag) => (
                                    <div key={flag.key} className="rounded-2xl border border-gray-100 bg-[#f8fafc] px-4 py-4 flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-gray-900">{flag.label}</span>
                                                <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">{flag.key}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{flag.description}</p>
                                            <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mt-2">{flag.target || flag.route}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleFlag(flag)}
                                            disabled={savingKey === flag.key}
                                            className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition ${flag.enabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'} ${savingKey === flag.key ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
                                        >
                                            {savingKey === flag.key ? 'Saving...' : flag.enabled ? 'Visible' : 'Hidden'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center font-mono text-[10px] tracking-widest text-gray-400 uppercase">
                                    No flags in this category.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
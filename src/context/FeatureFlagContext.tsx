import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config/api';

export interface FeatureFlagState {
    key: string;
    enabled: boolean;
    route?: string;
}

interface FeatureFlagContextValue {
    flags: FeatureFlagState[];
    loading: boolean;
    isEnabled: (key: string, fallback?: boolean) => boolean;
    refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
    const [flags, setFlags] = useState<FeatureFlagState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refreshFlags = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/flags/public`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            if (data.status === 'success' && data.data) {
                const nextFlags = Object.entries(data.data).map(([key, value]) => ({
                    key,
                    enabled: Boolean((value as { enabled?: boolean }).enabled),
                    route: (value as { route?: string }).route,
                }));
                setFlags(nextFlags);
                setError(null);
            }
        } catch (error) {
            console.error('Feature flag fetch error:', error);
            setError(error as Error);
            // Set default flags so app doesn't break
            setFlags([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshFlags();
    }, [refreshFlags]);

    useEffect(() => {
        const handleFlagsUpdated = () => {
            refreshFlags();
        };

        window.addEventListener('feature-flags-updated', handleFlagsUpdated);
        return () => window.removeEventListener('feature-flags-updated', handleFlagsUpdated);
    }, [refreshFlags]);

    const flagMap = useMemo(() => new Map(flags.map((flag) => [flag.key, flag.enabled])), [flags]);

    const isEnabled = useCallback((key: string, fallback = true) => {
        return flagMap.has(key) ? Boolean(flagMap.get(key)) : fallback;
    }, [flagMap]);

    const contextValue = useMemo(() => ({
        flags,
        loading,
        isEnabled,
        refreshFlags,
    }), [flags, loading, isEnabled, refreshFlags]);

    // Show error notification but still render children
    if (error) {
        console.warn('Feature flags failed to load, using defaults:', error.message);
    }

    return (
        <FeatureFlagContext.Provider value={contextValue}>
            {children}
        </FeatureFlagContext.Provider>
    );
}

export function useFeatureFlags() {
    const context = useContext(FeatureFlagContext);

    if (!context) {
        throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
    }

    return context;
}

export function useFeatureFlag(flagKey: string, fallback = true) {
    const { isEnabled } = useFeatureFlags();
    return isEnabled(flagKey, fallback);
}

export function FeatureGate({
    flagKey,
    fallback = null,
    children,
}: {
    flagKey: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}) {
    const enabled = useFeatureFlag(flagKey);

    if (!enabled) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config/api';
const TOKEN_KEY = 'raw_visitor_token';

// Parse user-agent for device/browser/os info
function getDeviceInfo() {
    const ua = navigator.userAgent;

    // Device
    let device = 'Desktop';
    if (/Mobi|Android/i.test(ua)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

    // Browser
    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    // OS
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { device, browser, os };
}

// Fetch real public IP using free API
async function getPublicIP(): Promise<string> {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip || 'unknown';
    } catch {
        return 'unknown';
    }
}

let isTracking = false;

export function useVisitorTracker() {
    const location = useLocation();

    useEffect(() => {
        // Prevent duplicate calls from React StrictMode double-firing effects
        if (isTracking) return;
        isTracking = true;

        const track = async () => {
            try {
                const { device, browser, os } = getDeviceInfo();
                const existingToken = localStorage.getItem(TOKEN_KEY);

                // Fetch real public IP (so localhost doesn't show ::1)
                const clientIP = await getPublicIP();

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                const res = await fetch(`${API_URL}/visitors/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page: location.pathname,
                        referrer: document.referrer || 'direct',
                        device,
                        browser,
                        os,
                        visitorToken: existingToken,
                        clientIP,
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!res.ok) {
                    console.warn('Visitor tracking failed:', res.status);
                    return;
                }

                const data = await res.json();

                // Store or update the session token
                if (data.token) {
                    localStorage.setItem(TOKEN_KEY, data.token);
                }
            } catch (err) {
                // Silently fail — don't break the app
                console.debug('Visitor tracking error:', err instanceof Error ? err.message : 'Unknown error');
            } finally {
                isTracking = false;
            }
        };

        track();
    }, [location.pathname]);
}

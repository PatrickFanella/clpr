import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/context/ConsentContext';
import { enablePostHog } from '@/lib/posthog-analytics';
import { isAnalyticsEnabled, trackPageView } from '@/lib/telemetry';

export function AnalyticsPageTracker() {
    const { pathname } = useLocation();
    const { canTrackAnalytics } = useConsent();

    useEffect(() => {
        if (!canTrackAnalytics) return;
        let cancelled = false;
        // Wait for the provider so the first page view survives SDK loading.
        void enablePostHog().then(() => {
            if (!cancelled && isAnalyticsEnabled()) trackPageView(pathname);
        });
        return () => { cancelled = true; };
    }, [pathname, canTrackAnalytics]);

    return null;
}

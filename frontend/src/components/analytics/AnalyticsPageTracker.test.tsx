import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsPageTracker } from './AnalyticsPageTracker';

const mocks = vi.hoisted(() => ({ consent: false, enabled: true, track: vi.fn(), enable: vi.fn() }));
vi.mock('@/context/ConsentContext', () => ({ useConsent: () => ({ canTrackAnalytics: mocks.consent }) }));
vi.mock('@/lib/posthog-analytics', () => ({ enablePostHog: mocks.enable }));
vi.mock('@/lib/telemetry', () => ({ isAnalyticsEnabled: () => mocks.enabled, trackPageView: mocks.track }));

beforeEach(() => {
    vi.clearAllMocks();
    mocks.consent = false;
    mocks.enabled = true;
    mocks.enable.mockResolvedValue(undefined);
});

describe('analytics page views', () => {
    it('does not send page views before consent', () => {
        render(<MemoryRouter><AnalyticsPageTracker /></MemoryRouter>);
        expect(mocks.track).not.toHaveBeenCalled();
        expect(mocks.enable).not.toHaveBeenCalled();
    });

    it('tracks the current route when consent is granted without including query parameters', async () => {
        const ui = <MemoryRouter initialEntries={['/search?q=private']}><AnalyticsPageTracker /></MemoryRouter>;
        const { rerender } = render(ui);
        mocks.consent = true;
        rerender(<MemoryRouter initialEntries={['/search?q=private']}><AnalyticsPageTracker /></MemoryRouter>);
        await waitFor(() => expect(mocks.track).toHaveBeenCalledWith('/search'));
        expect(mocks.track).toHaveBeenCalledTimes(1);
    });

    it('cancels a pending page view when consent is revoked', async () => {
        let finish!: () => void;
        mocks.enable.mockReturnValue(new Promise<void>(resolve => { finish = resolve; }));
        mocks.consent = true;
        const { rerender } = render(<MemoryRouter><AnalyticsPageTracker /></MemoryRouter>);
        mocks.consent = false;
        rerender(<MemoryRouter><AnalyticsPageTracker /></MemoryRouter>);
        finish();
        await Promise.resolve();
        expect(mocks.track).not.toHaveBeenCalled();
    });
});

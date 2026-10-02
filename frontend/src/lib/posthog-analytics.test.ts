import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    runtime: { enabled: true, postHogApiKey: 'phc_fixture', postHogHost: 'https://us.i.posthog.com' },
    sdk: { init: vi.fn(), capture: vi.fn(), identify: vi.fn(), reset: vi.fn(), opt_in_capturing: vi.fn(), opt_out_capturing: vi.fn() },
}));
vi.mock('./runtime-config', () => ({ getAnalyticsRuntimeConfig: () => mocks.runtime }));
vi.mock('posthog-js', () => ({ default: mocks.sdk }));

beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.runtime.enabled = true;
    mocks.runtime.postHogApiKey = 'phc_fixture';
    mocks.sdk.init.mockImplementation((_key, options) => { options.loaded(mocks.sdk); });
});

describe('PostHog consent and initialization', () => {
    it('does not initialize or capture before consent', async () => {
        const analytics = await import('./posthog-analytics');
        analytics.trackPostHogEvent('clip_shared');
        analytics.identifyPostHogUser('user-1');
        expect(mocks.sdk.init).not.toHaveBeenCalled();
        expect(mocks.sdk.capture).not.toHaveBeenCalled();
        expect(mocks.sdk.identify).not.toHaveBeenCalled();
    });

    it.each(['disabled', 'missing token'])('does not load a provider when %s', async reason => {
        if (reason === 'disabled') mocks.runtime.enabled = false;
        else mocks.runtime.postHogApiKey = '';
        const analytics = await import('./posthog-analytics');
        await analytics.enablePostHog();
        analytics.trackPostHogEvent('clip_shared');
        expect(mocks.sdk.init).not.toHaveBeenCalled();
        expect(mocks.sdk.capture).not.toHaveBeenCalled();
    });

    it('initializes once and preserves events while the SDK loads', async () => {
        const analytics = await import('./posthog-analytics');
        const first = analytics.enablePostHog();
        const second = analytics.enablePostHog();
        analytics.trackPostHogPageView('/discover', 'Discover');
        await Promise.all([first, second]);
        expect(mocks.sdk.init).toHaveBeenCalledTimes(1);
        expect(mocks.sdk.init).toHaveBeenCalledWith('phc_fixture', expect.objectContaining({
            api_host: 'https://us.i.posthog.com', autocapture: false, disable_session_recording: true,
            capture_pageview: false, respect_dnt: true,
        }));
        expect(mocks.sdk.capture).toHaveBeenCalledWith('$pageview', expect.objectContaining({ path: '/discover' }));
    });

    it('honors consent revoked during initialization and discards queued events', async () => {
        let loaded: (() => void) | undefined;
        mocks.sdk.init.mockImplementation((_key, options) => { loaded = () => options.loaded(mocks.sdk); });
        const analytics = await import('./posthog-analytics');
        const initializing = analytics.enablePostHog();
        analytics.trackPostHogEvent('clip_shared');
        await vi.waitFor(() => expect(loaded).toBeDefined());
        analytics.disablePostHog();
        loaded!();
        await initializing;
        expect(mocks.sdk.opt_out_capturing).toHaveBeenCalled();
        expect(mocks.sdk.capture).not.toHaveBeenCalled();
        await analytics.enablePostHog();
        analytics.trackPostHogEvent('clip_shared');
        expect(mocks.sdk.capture).toHaveBeenCalledTimes(1);
        expect(mocks.sdk.init).toHaveBeenCalledTimes(1);
    });

    it('does not include OAuth query strings in captured event URLs', async () => {
        window.history.replaceState({}, '', '/auth/callback?code=private&state=private');
        const analytics = await import('./posthog-analytics');
        await analytics.enablePostHog();
        analytics.trackPostHogEvent('login_completed');
        expect(mocks.sdk.capture).toHaveBeenCalledWith('login_completed', expect.objectContaining({
            $current_url: window.location.origin + '/auth/callback',
        }));
        window.history.replaceState({}, '', '/');
    });
});

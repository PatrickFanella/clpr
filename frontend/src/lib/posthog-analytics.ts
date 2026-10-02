import type { PostHog } from 'posthog-js';
import { getAnalyticsRuntimeConfig } from './runtime-config';

const runtime = getAnalyticsRuntimeConfig();
export const POSTHOG_API_KEY = runtime.postHogApiKey;
export const POSTHOG_HOST = runtime.postHogHost;

let instance: PostHog | null = null;
let loading: Promise<void> | null = null;
let capturingAllowed = false;
let initialized = false;
const pending: Array<[string, Record<string, unknown> | undefined]> = [];

export async function initPostHog(): Promise<void> {
    if (!runtime.enabled || !POSTHOG_API_KEY) return;
    capturingAllowed = true;
    if (initialized) {
        instance?.opt_in_capturing({ captureEventName: false });
        return;
    }
    if (loading) return loading;
    loading = (async () => {
        try {
            const { default: posthog } = await import('posthog-js');
            if (!capturingAllowed) return;
            instance = posthog;
            await new Promise<void>(resolve => {
                posthog.init(POSTHOG_API_KEY, {
                    api_host: POSTHOG_HOST,
                    capture_pageview: false,
                    capture_pageleave: false,
                    autocapture: false,
                    disable_session_recording: true,
                    person_profiles: 'identified_only',
                    respect_dnt: true,
                    secure_cookie: window.location.protocol === 'https:',
                    persistence: 'localStorage',
                    loaded: sdk => {
                        initialized = true;
                        if (capturingAllowed) {
                            instance?.opt_in_capturing({ captureEventName: false });
                            for (const [event, properties] of pending.splice(0)) {
                                sdk.capture(event, properties);
                            }
                        } else {
                            pending.length = 0;
                            sdk.opt_out_capturing();
                        }
                        resolve();
                    },
                });
            });
        } catch (error) {
            pending.length = 0;
            console.error('Failed to initialize PostHog:', error);
        } finally {
            loading = null;
        }
    })();
    return loading;
}

export function disablePostHog(): void {
    capturingAllowed = false;
    pending.length = 0;
    instance?.opt_out_capturing();
}

export async function enablePostHog(): Promise<void> {
    return initPostHog();
}

export function trackPostHogEvent(event: string, properties?: Record<string, unknown>): void {
    if (!capturingAllowed) return;
    // OAuth and search query strings do not belong in event URLs.
    const safeProperties = {
        ...properties,
        $current_url: window.location.origin + window.location.pathname,
    };
    if (initialized && instance) instance.capture(event, safeProperties);
    else if (pending.length < 100) pending.push([event, safeProperties]);
}

export function trackPostHogPageView(path: string, title?: string): void {
    trackPostHogEvent('$pageview', {
        path,
        title: title || document.title,
        $current_url: window.location.origin + path,
    });
}

export function identifyPostHogUser(id: string, traits?: Record<string, unknown>): void {
    if (!capturingAllowed || !initialized) return;
    instance?.identify(id, traits);
}

export function resetPostHogUser(): void {
    if (initialized) instance?.reset();
}

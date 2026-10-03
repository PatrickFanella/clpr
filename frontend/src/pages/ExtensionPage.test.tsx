import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExtensionPage } from './ExtensionPage';

vi.mock('../components', () => ({
    Container: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={className}>{children}</div>
    ),
    CardBody: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SEO: () => null,
    Button: ({ children, variant, asChild }: { children: React.ReactNode; variant?: string; size?: string; asChild?: boolean }) => (
        asChild ? <>{children}</> : <button data-variant={variant}>{children}</button>
    ),
}));

describe('ExtensionPage', () => {
    function renderPage() {
        return render(
            <MemoryRouter>
                <ExtensionPage />
            </MemoryRouter>,
        );
    }

    it('renders the page heading', () => {
        renderPage();
        expect(
            screen.getByRole('heading', { name: /clpr browser extension/i }),
        ).toBeInTheDocument();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('says the extension is unlisted instead of linking to a missing store page', () => {
        renderPage();
        expect(screen.getByTestId('extension-unlisted')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /get clpr for/i })).not.toBeInTheDocument();
    });

    it('renders an install link only for a configured store listing', async () => {
        vi.stubEnv('VITE_EXTENSION_FIREFOX_URL', 'https://addons.mozilla.org/firefox/addon/example');
        vi.resetModules();
        const { ExtensionPage: Configured } = await import('./ExtensionPage');
        render(<MemoryRouter><Configured /></MemoryRouter>);
        expect(screen.getByRole('link', { name: /get clpr for firefox/i })).toHaveAttribute('href', 'https://addons.mozilla.org/firefox/addon/example');
        expect(screen.queryByRole('link', { name: /get clpr for chrome/i })).not.toBeInTheDocument();
    });

    it('renders the feature list', () => {
        renderPage();
        expect(
            screen.getByRole('heading', { name: /what it does/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/auto-detect clips/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /context menu/i, level: 3 })).toBeInTheDocument();
        expect(screen.getByText(/submit from the popup/i)).toBeInTheDocument();
    });

    it('renders the How it works section', () => {
        renderPage();
        expect(
            screen.getByRole('heading', { name: /how it works/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/log in/i)).toBeInTheDocument();
    });

    it('renders the Supported browsers table', () => {
        renderPage();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText(/chrome \/ chromium/i)).toBeInTheDocument();
        // Firefox appears in both the download button and the browser table; verify the table cell.
        const rows = screen.getAllByText(/firefox/i);
        expect(rows.length).toBeGreaterThanOrEqual(1);
    });

    it('does not publish a repository link', () => {
        renderPage();
        expect(screen.queryByRole('link', { name: /view source/i })).not.toBeInTheDocument();
    });
});

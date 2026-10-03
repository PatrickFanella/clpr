import { expect, test } from '@playwright/test';

test.describe('mocked UI smoke', () => {
    test('renders the browser extension release surface', async ({ page }) => {
        await page.goto('/extension');

        await expect(
            page.getByRole('heading', { name: 'clpr browser extension' }),
        ).toBeVisible();
        // Install buttons render only for configured store listings; without
        // one the page must say so instead of linking to a missing page.
        const installLinks = page.getByRole('link', { name: /Get clpr for (Chrome|Firefox)/ });
        if ((await installLinks.count()) === 0) {
            await expect(page.getByTestId('extension-unlisted')).toBeVisible();
        } else {
            for (const link of await installLinks.all()) {
                await expect(link).toHaveAttribute('href', /^https:\/\//);
            }
        }
    });
});

// Renders clpr's raster brand assets from the SVG sources in public/ and the
// self-hosted fonts in src/assets/fonts. The logo and mark come from the CLPR
// brand pack in subcult-studio (see docs/brand-provenance.json). Run after
// changing the logo, icon, or social card: `node scripts/render-brand-assets.mjs`. Requires Playwright's
// Chromium (installed for the e2e suite).
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const fontDir = path.join(root, 'src/assets/fonts');

const icon = await readFile(path.join(publicDir, 'icons/icon.svg'), 'utf8');
const maskable = await readFile(path.join(publicDir, 'icons/icon-maskable.svg'), 'utf8');
const favicon = await readFile(path.join(publicDir, 'favicon.svg'), 'utf8');
const logo = await readFile(path.join(publicDir, 'clpr-logo.svg'), 'utf8');
const mark = await readFile(path.join(root, 'src/assets/brand/clpr-mark.svg'), 'utf8');

// setContent pages cannot read file:// URLs, so fonts are inlined as data URLs.
const fontFace = async (family, weight, file) => {
    const data = (await readFile(path.join(fontDir, file))).toString('base64');
    return `@font-face { font-family: '${family}'; font-weight: ${weight}; src: url(data:font/woff2;base64,${data}) format('woff2'); }`;
};
const fonts = (await Promise.all([
    fontFace('Barlow', 400, 'barlow-400.woff2'),
    fontFace('Barlow Condensed', 700, 'barlow-condensed-700.woff2'),
    fontFace('IBM Plex Mono', 400, 'ibm-plex-mono-400.woff2'),
])).join('\n');

const sized = (svg, width, height) => svg.replace('<svg ', `<svg width="${width}" height="${height}" `);
const placed = (svg, x, y, width, height) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${width}" height="${height}" `);

/** The wordmark centred on ink, used for profile images and banners. */
function logoCard({ width, height, logoHeight }) {
    return `<!doctype html><html><head><style>
        * { margin: 0; box-sizing: border-box; }
        body { width: ${width}px; height: ${height}px; background: #0E0C13; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        svg { height: ${logoHeight}px; width: auto; display: block; }
    </style></head><body>${logo}</body></html>`;
}

/**
 * The 1200x630 link-preview card. It follows the clip stack layout of the
 * CLPR brand pack: wordmark, headline, three overlapping clip cards, a violet
 * rule and a mono destination.
 */
function socialCard({ headline, caption }) {
    const clip = (dx, dy, angle, stroke) =>
        `<g transform="rotate(${angle} ${985 + dx} ${284 + dy})"><rect x="${820 + dx}" y="${150 + dy}" width="330" height="268" rx="10" fill="#211B30" stroke="${stroke}" stroke-width="2"/></g>`;
    const lines = headline
        .map((line, index) => `<text x="48" y="${286 + index * 88}" class="headline">${line}</text>`)
        .join('');
    return `<!doctype html><html><head><style>
        ${fonts}
        * { margin: 0; }
        body { width: 1200px; height: 630px; overflow: hidden; }
        .headline { font: 700 84px 'Barlow Condensed'; text-transform: uppercase; fill: #EEEDF7; }
        .caption { font: 400 24px 'Barlow'; fill: #EEEDF7; }
        .site { font: 400 18px 'IBM Plex Mono'; fill: #EEEDF7; }
    </style></head><body>
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
            <rect width="1200" height="630" fill="#0E0C13"/>
            ${placed(logo, 48, 40, 261, 120)}
            ${lines}
            <text x="48" y="456" class="caption">${caption}</text>
            ${clip(24, 24, 6, '#493C64')}
            ${clip(12, 12, -5, '#493C64')}
            ${clip(0, 0, 0, '#8C5CFF')}
            ${placed(mark, 925, 218, 120, 120)}
            <path d="M840 394H1130" stroke="#3DDC97" stroke-width="3"/>
            <path d="M48 548H1152" stroke="#8C5CFF" stroke-width="2"/>
            <text x="48" y="588" class="site">clpr.tv</text>
        </svg>
    </body></html>`;
}

const browser = await chromium.launch();

async function shoot(html, width, height, out) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(publicDir, out) });
    await page.close();
}

const svgPage = svg => `<html><body style="margin:0">${svg}</body></html>`;

for (const size of [72, 96, 128, 144, 152, 192, 384, 512]) {
    await shoot(svgPage(sized(icon, size, size)), size, size, `icons/icon-${size}x${size}.png`);
}
for (const size of [192, 512]) {
    await shoot(svgPage(sized(maskable, size, size)), size, size, `icons/icon-${size}x${size}-maskable.png`);
    await shoot(svgPage(sized(icon, size, size)), size, size, `favicon_io/android-chrome-${size}x${size}.png`);
}
await shoot(svgPage(sized(icon, 180, 180)), 180, 180, 'favicon_io/apple-touch-icon.png');
for (const size of [16, 32]) {
    await shoot(svgPage(sized(favicon, size, size)), size, size, `favicon_io/favicon-${size}x${size}.png`);
}

await shoot(
    socialCard({
        headline: ['The moments shaping', 'live culture'],
        caption: 'Twitch clips by creator, topic and tag',
    }),
    1200,
    630,
    'social-card.png',
);
await shoot(logoCard({ width: 500, height: 500, logoHeight: 110 }), 500, 500, 'clpr-500px.png');
await shoot(logoCard({ width: 1024, height: 1024, logoHeight: 230 }), 1024, 1024, 'clpr-1021px.png');
await shoot(logoCard({ width: 500, height: 294, logoHeight: 90 }), 500, 294, 'clpr-banner-500px.png');
await shoot(logoCard({ width: 1021, height: 601, logoHeight: 180 }), 1021, 601, 'clpr-banner-1021px.png');

// The browser extension ships the same icon; the smallest size uses the larger favicon mark.
for (const size of [16, 32, 48, 128]) {
    const source = size === 16 ? favicon : icon;
    await shoot(svgPage(sized(source, size, size)), size, size, `../../extension/icons/icon-${size}.png`);
}

await browser.close();
console.log('Brand assets rendered. Assemble favicon.ico from the favicon PNGs:');
console.log('  magick public/favicon_io/favicon-16x16.png public/favicon_io/favicon-32x32.png public/favicon_io/favicon.ico');

import { Search, MousePointer, Tag, PenLine, Zap, Lock } from 'lucide-react';
import { Container, Card, CardBody, SEO, Button } from '../components';

// Store listings are configured at build time. Until a listing exists its
// button is not rendered, so the page never links to a missing store page.
const CHROME_STORE_URL = import.meta.env.VITE_EXTENSION_CHROME_URL || '';
const FIREFOX_STORE_URL = import.meta.env.VITE_EXTENSION_FIREFOX_URL || '';
const hasStoreListing = Boolean(CHROME_STORE_URL || FIREFOX_STORE_URL);

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
    return (
        <div className="flex gap-4">
            <span className="flex-shrink-0" aria-hidden="true">
                {icon}
            </span>
            <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export function ExtensionPage() {
    return (
        <>
            <SEO
                title="Browser Extension"
                description="A browser extension for Chrome and Firefox that submits the Twitch clip you are watching to clpr."
                canonicalUrl="/extension"
            />
            <Container className="py-8 max-w-4xl">
                {/* Hero */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        clpr browser extension
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Watching a clip on Twitch that should be on clpr? The extension notices the clip page, fills in the title, and lets you add tags and a description before you submit.
                    </p>
                    {hasStoreListing ? (
                        <div className="flex flex-wrap gap-3 justify-center">
                            {CHROME_STORE_URL && (
                                <Button asChild variant="primary" size="lg">
                                    <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get clpr for Chrome">
                                        Add to Chrome
                                    </a>
                                </Button>
                            )}
                            {FIREFOX_STORE_URL && (
                                <Button asChild variant={CHROME_STORE_URL ? 'secondary' : 'primary'} size="lg">
                                    <a href={FIREFOX_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get clpr for Firefox">
                                        Add to Firefox
                                    </a>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <p className="kicker" data-testid="extension-unlisted">
                            Not yet listed in the Chrome Web Store or Firefox Add-ons
                        </p>
                    )}
                </div>

                {/* Features */}
                <Card className="mb-8">
                    <CardBody>
                        <h2 className="text-2xl font-semibold mb-6">What it does</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Feature
                                icon={<Search size={16} strokeWidth={1.75} />}
                                title="Auto-detect clips"
                                description="Notices Twitch clip pages (twitch.tv and clips.twitch.tv) and turns on the share button."
                            />
                            <Feature
                                icon={
                                    <MousePointer
                                        size={16}
                                        strokeWidth={1.75}
                                    />
                                }
                                title="Context menu"
                                description='Right-click any Twitch clip page to see "Share to clpr" in the context menu.'
                            />
                            <Feature
                                icon={<PenLine size={16} strokeWidth={1.75} />}
                                title="Editable metadata"
                                description="Pre-fills the clip title from Twitch. You can edit the title, add a description, and pick tags before sharing."
                            />
                            <Feature
                                icon={<Tag size={16} strokeWidth={1.75} />}
                                title="Tag selection"
                                description="Search clpr tags in the popup and pick the ones that apply."
                            />
                            <Feature
                                icon={<Zap size={16} strokeWidth={1.75} />}
                                title="Submit from the popup"
                                description="Click Share Clip and it is sent. A desktop notification confirms the clip is pending review."
                            />
                            <Feature
                                icon={<Lock size={16} strokeWidth={1.75} />}
                                title="Your clpr login"
                                description="Uses the clpr account you already have. No second password."
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* How it works */}
                <Card className="mb-8">
                    <CardBody>
                        <h2 className="text-2xl font-semibold mb-6">
                            How it works
                        </h2>
                        <ol className="space-y-4 list-decimal list-inside text-sm text-muted-foreground">
                            <li>
                                <strong className="text-foreground">
                                    Install
                                </strong>{' '}
                                the extension once it is listed for your
                                browser.
                            </li>
                            <li>
                                <strong className="text-foreground">
                                    Log in
                                </strong>{' '}
                                by clicking the extension icon and selecting{' '}
                                <em>Login with Twitch</em>. This opens your
                                clpr account in a new tab.
                            </li>
                            <li>
                                <strong className="text-foreground">
                                    Browse Twitch
                                </strong>
                                . When you land on a clip page the extension
                                badge lights up automatically.
                            </li>
                            <li>
                                <strong className="text-foreground">
                                    Click the icon
                                </strong>{' '}
                                (or right-click → Share to clpr) to open the
                                popup.
                            </li>
                            <li>
                                <strong className="text-foreground">
                                    Review and submit
                                </strong>{' '}
                                – edit the title, add tags, and click{' '}
                                <em>Share Clip</em>.
                            </li>
                        </ol>
                    </CardBody>
                </Card>

                {/* Supported browsers */}
                <Card className="mb-8">
                    <CardBody>
                        <h2 className="text-2xl font-semibold mb-4">
                            Supported browsers
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-2 pr-8">
                                            Browser
                                        </th>
                                        <th className="text-left py-2">
                                            Minimum version
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground">
                                    <tr className="border-b border-border">
                                        <td className="py-2 pr-8">
                                            Chrome / Chromium
                                        </td>
                                        <td className="py-2">99+</td>
                                    </tr>
                                    <tr className="border-b border-border">
                                        <td className="py-2 pr-8">
                                            Microsoft Edge
                                        </td>
                                        <td className="py-2">99+</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-8">Firefox</td>
                                        <td className="py-2">109+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </>
    );
}

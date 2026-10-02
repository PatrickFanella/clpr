import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button, Container, SEO } from '../components';
import { fetchClips } from '../lib/clip-api';
import { SUPPORT_URL } from '../lib/support-link';

const LIVE_CLIP_COUNT = 3;

const actions = [
  {
    title: 'Browse',
    description: 'Start from a person, a subject or a tag instead of a Twitch category.',
    links: [
      { label: 'Creators', to: '/creators' },
      { label: 'Topics', to: '/topics' },
      { label: 'Tags', to: '/tags' },
    ],
  },
  {
    title: 'Watch collections',
    description: 'Lists that refresh daily and weekly, built around creators, topics and moments.',
    links: [{ label: 'Discover', to: '/discover' }],
  },
  {
    title: 'Save, vote and comment',
    description: 'Keep favorites for later. Upvotes and comments help timely clips rise in the feed.',
    links: [{ label: 'Feed', to: '/' }],
  },
  {
    title: 'Submit',
    description: 'Send in a Twitch clip that deserves a wider audience.',
    links: [{ label: 'Submit a clip', to: '/submit' }],
  },
];

/** Today's top clips, so the page shows the product instead of describing it. */
function LiveClips() {
  const { data } = useQuery({
    queryKey: ['about', 'live-clips'],
    queryFn: () => fetchClips({ filters: { sort: 'trending', timeframe: 'day' } }),
    staleTime: 5 * 60 * 1000,
  });
  const clips = (data?.clips ?? []).filter(clip => clip.thumbnail_url && !clip.is_nsfw).slice(0, LIVE_CLIP_COUNT);
  if (clips.length === 0) return null;

  return (
    <section aria-labelledby='about-live' className='border-t border-line-strong pt-6'>
      <p className='kicker mb-2'>Trending today</p>
      <h2 id='about-live' className='mb-4 text-2xl'>On clpr right now</h2>
      <ul className='grid gap-4 sm:grid-cols-3'>
        {clips.map(clip => (
          <li key={clip.id}>
            <Link to={`/clip/${clip.id}`} className='group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'>
              <img src={clip.thumbnail_url} alt='' width={640} height={360} loading='lazy' className='aspect-video w-full border border-border object-cover group-hover:border-line-strong' />
              <span className='mt-2 block font-heading text-lg font-bold uppercase leading-tight text-foreground line-clamp-2'>{clip.title}</span>
              <span className='kicker mt-1 block'>{clip.broadcaster_name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AboutPage() {
  return (
    <>
      <SEO title='About' description='clpr helps people discover the creators and moments shaping live culture.' canonicalUrl='/about' />
      <Container className='py-8'>
        <div className='mx-auto max-w-4xl space-y-10'>
          <header>
            <p className='kicker mb-3'>Live culture, clipped</p>
            <h1 className='display mb-4 text-4xl sm:text-5xl'>Find the creators everyone will be talking about.</h1>
            <p className='max-w-3xl text-lg text-text-secondary'>clpr brings together memorable Twitch moments so you can discover people worth following, not just whatever category happens to be live.</p>
          </header>

          <LiveClips />

          <section aria-labelledby='about-scope' className='border-t border-line-strong pt-6'>
            <h2 id='about-scope' className='mb-4 text-2xl'>More than gaming</h2>
            <p className='max-w-3xl text-text-secondary'>Live creators move freely between IRL, reactions, music, news, politics, sports, art, gaming, and conversations that do not fit neatly into a box. clpr is built around those creators and the moments their communities remember.</p>
          </section>

          <section aria-labelledby='about-actions'>
            <h2 id='about-actions' className='mb-4 text-2xl'>What you can do</h2>
            <dl className='border-b border-line-strong'>
              {actions.map(action => (
                <div key={action.title} className='grid gap-1 border-t border-line-strong py-5 sm:grid-cols-[14rem_1fr] sm:gap-8'>
                  <dt className='font-heading text-xl font-bold uppercase tracking-[0.01em] text-foreground'>{action.title}</dt>
                  <dd className='text-text-secondary'>
                    {action.description}{' '}
                    {action.links.map((link, index) => (
                      <span key={link.to}>
                        {index > 0 && ', '}
                        <Link to={link.to} className='text-link underline underline-offset-2'>{link.label}</Link>
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby='about-join'>
            <h2 id='about-join' className='mb-4 text-2xl'>Be part of it</h2>
            <p className='mb-5 max-w-3xl text-text-secondary'>Please read our <Link to='/community-rules' className='text-link underline underline-offset-2'>community rules</Link> and help keep clpr welcoming to creators and viewers alike.</p>
            <div className='flex flex-wrap gap-3'>
              <Button asChild><Link to='/contact'>Contact us</Link></Button>
              <Button asChild variant='outline'><a href={SUPPORT_URL} target='_blank' rel='noopener noreferrer'>Support us on Patreon</a></Button>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

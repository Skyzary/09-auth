import Link from 'next/link';
import css from './not-found.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - NoteHub',
  description: 'The requested page does not exist.',
  openGraph: {
    title: 'Page Not Found - NoteHub',
    description: 'The requested page does not exist.',
    url: 'https://ac.goit.global/404',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Page Not Found',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>Not Found</h1>
      <p className={css.text}>Could not find requested resource</p>
      <Link href="/" className={css.link}>
        Return Home
      </Link>
    </div>
  );
}

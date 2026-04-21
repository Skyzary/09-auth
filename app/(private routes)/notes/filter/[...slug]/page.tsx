import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '../../../../../lib/api/serverApi';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activeTag = slug?.[0];
  const title = activeTag ? `Notes - ${activeTag}` : 'Notes';
  const description = activeTag
    ? `View notes filtered by ${activeTag}`
    : 'Browse all notes';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ac.goit.global/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - Notes Filtered by ${activeTag}`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const activeTag = slug?.[0];
  const queryClient = new QueryClient();

  const tagForApi = activeTag && activeTag !== 'all' ? activeTag : undefined;

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tagForApi],
    queryFn: () => fetchNotes(undefined, 1, tagForApi),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={activeTag} />
    </HydrationBoundary>
  );
}

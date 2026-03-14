'use client';

import { useRouter } from 'next/navigation';
import Modal from '../../../../components/Modal/Modal';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import { BarLoader } from 'react-spinners';
import Error from '../../../../components/Error/Error';

export default function NotePreviewClient({ id }: { id: string }) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, // Додана ця опція згідно з фідбеком
  });

  if (!id) return null;

  return (
    <Modal onClose={() => router.back()}>
      {isLoading ? (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
           <BarLoader color="#2341ba" />
        </div>
      ) : isError ? (
        <Error message="Error loading note" />
      ) : note ? (
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{note.title}</h2>
          </div>
          <p style={{ 
            display: 'inline-block', 
            padding: '4px 8px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '4px', 
            fontSize: '14px', 
            marginBottom: '16px' 
          }}>
            {note.tag}
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>{note.content}</p>
          <p style={{ fontSize: '14px', color: '#6c757d' }}>{new Date(note.createdAt).toLocaleDateString()}</p>
        </div>
      ) : null}
    </Modal>
  );
}

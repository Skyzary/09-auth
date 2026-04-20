import { api } from './api';
import { Note } from '../../types/note';
import { User } from '../../types/user';
import { cookies } from 'next/headers';

export const fetchNotes = async (
  search?: string,
  page: number = 1,
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = await cookies();
  const { data } = await api.get('/notes', {
    params: {
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
      page,
      perPage: 12,
    },
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get('/users/me', {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const checkSession = async (headers?: Record<string, string>) => {
  if (headers) {
    return api.get('/auth/session', { headers });
  }
  const cookieStore = await cookies();
  return api.get('/auth/session', {
    headers: { Cookie: cookieStore.toString() },
  });
};

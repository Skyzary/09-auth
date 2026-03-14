import axios from 'axios';
import { Note } from '../../types/note';
import { User } from '../../types/user';
import { cookies } from 'next/headers';

const baseURL = (process.env.NEXT_PUBLIC_API_URL || '') + '/api';

export const serverApi = axios.create({
  baseURL,
});

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (cookieHeader) {
    config.headers.Cookie = cookieHeader;
  }
  return config;
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search?: string,
  page: number = 1,
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await serverApi.get('/notes', {
    params: {
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
      page,
      perPage: 12,
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await serverApi.get(`/notes/${id}`);
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await serverApi.get('/users/me');
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await serverApi.get('/auth/session');
    if (!data || Object.keys(data).length === 0) return null;
    return data;
  } catch (err) {
    return null;
  }
};
